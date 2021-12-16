import path from "path"
import fs, { WriteStream } from "fs"
import { ChildProcess, exec } from "child_process"
import consola from "consola"
import UidGen from "uid-generator"
import { RuntimeConfiguration } from "./configReader"
import { SocketIoManager } from "./socket"
import { ApiResult } from "./routes"

const uidgen = new UidGen()

type ProcessAttachedUid = string

export type ProcessLog = {
  directoryPath: string
  fileName: string
  uid: ProcessAttachedUid
  type: "out" | "err"
  text: string
}

class ProcessDefinition {
  readonly uid: ProcessAttachedUid
  readonly process: ChildProcess
  private _ioManager: SocketIoManager
  private _streamsAreSetup: boolean
  private _processWatcherIsSetup: boolean
  private _launchDate: Date
  private _logWriteStream: WriteStream
  private _runtimeConfig: RuntimeConfiguration
  private _exited: boolean
  readonly fileName: string
  readonly directoryPath: string

  constructor(
    uid: ProcessAttachedUid,
    execString: string,
    fileName: string,
    directoryPath: string,
    ioManager: SocketIoManager,
    writeStream: WriteStream,
    runtimeConfig: RuntimeConfiguration
  ) {
    this.uid = uid
    this._exited = false
    this._runtimeConfig = runtimeConfig
    this._ioManager = ioManager
    this._streamsAreSetup = false
    this._processWatcherIsSetup = false
    this.directoryPath = directoryPath
    this.fileName = fileName
    this._launchDate = new Date()
    this._logWriteStream = writeStream
    this.process = exec(execString)
    this.setUpExecutionStreams()
    this.setUpProcessStatusWatcher()
    this._ioManager.emit("confirmScriptLaunch", this.getInfos)
  }

  get isAlive() {
    return !this._exited
  }

  get getInfos() {
    const { pid, killed, exitCode, connected, signalCode } = this.process
    const { uid, fileName, directoryPath, _launchDate, _exited } = this

    return {
      pid,
      killed,
      exitCode,
      signalCode,
      connected,
      uid,
      fileName,
      directoryPath,
      exited: _exited,
      timestamp: _launchDate.getTime(),
    } as const
  }

  get logFilePath() {
    return `${this._runtimeConfig.logDirectory}/${this.uid}.log` as const
  }

  get processLogBaseObject(): Omit<ProcessLog, "type" | "text"> {
    return {
      directoryPath: this.directoryPath,
      fileName: this.fileName,
      uid: this.uid,
    }
  }

  private _pauseStd(): void {
    this.process.stdout?.pause()
    this.process.stderr?.pause()
  }

  setUpProcessStatusWatcher(): void {
    if (!this._processWatcherIsSetup) {
      this.process.on("exit", (code, signal) => {
        this._exited = true
        this._ioManager.emit("confirmScriptExit", {
          signal: signal ?? "N/A",
          code: code ?? -1,
          process: this.getInfos,
        })
      })
      this._processWatcherIsSetup = true
    } else
      consola.warn(
        `[ProcessDefinition] - Process ${this.uid} ${this.fileName} already has a status watcher`
      )
  }

  setUpExecutionStreams(): void {
    if (!this._streamsAreSetup) {
      process.stdout?.setEncoding("utf-8")
      process.stderr?.setEncoding("utf-8")
      this.process.stdout?.on("data", (string: string) => {
        this._ioManager.emit("streamData", {
          ...this.processLogBaseObject,
          type: "out",
          text: string,
        })
      })
      this.process.stderr?.on("data", (string: string) => {
        this._ioManager.emit("streamData", {
          ...this.processLogBaseObject,
          type: "err",
          text: string,
        })
      })
      this.process.stderr?.pipe(this._logWriteStream)
      this.process.stdout?.pipe(this._logWriteStream)
      this._streamsAreSetup = true
    } else
      consola.warn(
        `[ProcessDefinition] - Process ${this.uid} ${this.fileName} already has streams setup`
      )
  }
}

export type ProcessInfos = InstanceType<typeof ProcessDefinition>["getInfos"]

export class ProcessPool {
  pool: ProcessDefinition[]
  private _runtimeConfig: RuntimeConfiguration
  private _ioManager: SocketIoManager

  constructor(runtimeConfig: RuntimeConfiguration, ioManager: SocketIoManager) {
    this.pool = []
    this._runtimeConfig = runtimeConfig
    this._ioManager = ioManager
  }

  public addNewProcessFromDirectoryAndFileName(
    directoryPath: string,
    fileName: string
  ): Promise<ApiResult<ProcessInfos>> {
    return new Promise((resolve) => {
      const cleanedDirectoryPath = path.normalize(directoryPath)
      const cleanedFileName = path.normalize(fileName)
      const fullPath = path.join(cleanedDirectoryPath, cleanedFileName)

      if (
        this._runtimeConfig.targetDirectories.includes(cleanedDirectoryPath)
      ) {
        if (fs.existsSync(fullPath)) {
          const extention: "" | string = path.extname(cleanedFileName)
          const launchCmd: string | undefined | null =
            this._runtimeConfig.extentionMapping[extention]

          if (extention === "" || typeof launchCmd === "string") {
            const execString = `${launchCmd ? `${launchCmd} ` : ""} ${fullPath}`
            const newProcessUid = uidgen.generateSync()

            this.buildNewWriteStreamForProcessDefinition(newProcessUid)
              .then((writeSream) => {
                const definition = new ProcessDefinition(
                  newProcessUid,
                  execString,
                  fileName,
                  directoryPath,
                  this._ioManager,
                  writeSream,
                  this._runtimeConfig
                )

                this.pool.push(definition)
                resolve({ value: definition.getInfos, err: null })
              })
              .catch(() => {
                resolve({
                  value: null,
                  err: {
                    message: "Runtime error could not setup log streams",
                    statusCode: 500,
                  },
                })
              })
          } else {
            resolve({
              value: null,
              err: {
                message: `No bound program for ${extention} files`,
                statusCode: 404,
              },
            })
          }
        } else
          resolve({
            value: null,
            err: { message: "File doesn't exist", statusCode: 404 },
          })
      } else
        resolve({
          value: null,
          err: { message: "Directory not part of config", statusCode: 404 },
        })
    })
  }

  buildNewWriteStreamForProcessDefinition(
    uid: ProcessAttachedUid
  ): Promise<WriteStream> {
    return new Promise((resolve, reject) => {
      const fullPath = `${this._runtimeConfig.logDirectory}/${uid}.log`
      fs.writeFile(
        `${this._runtimeConfig.logDirectory}/${uid}.log`,
        "",
        function (err) {
          if (err) throw reject(err)
          else resolve(fs.createWriteStream(fullPath, { flags: "w" }))
        }
      )
    })
  }

  public findProcessByUid(
    uid: ProcessAttachedUid
  ): ProcessDefinition | undefined {
    return this.pool.find((e) => e.uid === uid)
  }
}
