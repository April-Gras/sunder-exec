import path from "path"
import fs from "fs"
import { ChildProcess, exec } from "child_process"
import UidGen from "uid-generator"
import { RuntimeConfiguration } from "./configReader"
import { SocketIoManager } from "./socket"
import { ApiResult } from "./routes"

const uidgen = new UidGen()

type ProcessAttachedUid = string

class ProcessDefinition {
  uid: ProcessAttachedUid
  process: ChildProcess
  private _ioManager: SocketIoManager
  private _streamsAreSetup: boolean
  fileName: string
  directoryPath: string

  constructor(
    fileName: string,
    directoryPath: string,
    process: ChildProcess,
    ioManager: SocketIoManager
  ) {
    this.process = process
    this._ioManager = ioManager
    this.uid = uidgen.generateSync()
    this._streamsAreSetup = false
    this.directoryPath = directoryPath
    this.fileName = fileName
  }

  getInfos() {
    const { pid, killed, exitCode, connected } = this.process

    return { pid, killed, exitCode, connected } as const
  }

  setUpExecutionStreams(): void {
    if (!this._streamsAreSetup) {
      process.stdout?.setEncoding("utf-8")
      process.stderr?.setEncoding("utf-8")
      this.process.stdout?.on("data", (string: string) => {
        this._ioManager.emit("streamData", {
          directoryPath: this.directoryPath,
          fileName: this.fileName,
          uid: this.uid,
          type: "out",
          text: string,
        })
      })
      this.process.stderr?.on("data", (string: string) => {
        this._ioManager.emit("streamData", {
          directoryPath: this.directoryPath,
          fileName: this.fileName,
          uid: this.uid,
          type: "err",
          text: string,
        })
      })
    } else
      console.warn(
        `[ProcessDefinition] - Process ${this.uid} ${this.fileName} already has streams setup`
      )
  }
}

export type ProcessInfos = ReturnType<
  InstanceType<typeof ProcessDefinition>["getInfos"]
>

export class ProcessPool {
  pool: ProcessDefinition[]
  private _configuration: RuntimeConfiguration
  private _ioManager: SocketIoManager

  constructor(configuration: RuntimeConfiguration, ioManager: SocketIoManager) {
    this.pool = []
    this._configuration = configuration
    this._ioManager = ioManager
  }

  public addNewProcessFromDirectoryAndFileName(
    directoryPath: string,
    fileName: string
  ): Promise<ApiResult<string>> {
    return new Promise((resolve) => {
      const cleanedDirectoryPath = path.normalize(directoryPath)
      const cleanedFileName = path.normalize(fileName)
      const fullPath = path.join(cleanedDirectoryPath, cleanedFileName)

      if (
        this._configuration.targetDirectories.includes(cleanedDirectoryPath)
      ) {
        if (fs.existsSync(fullPath)) {
          const extention: "" | string = path.extname(cleanedFileName)
          const launchCmd: string | undefined | null =
            this._configuration.extentionMapping[extention]

          if (extention === "" || typeof launchCmd === "string") {
            const execString = `${launchCmd ? `${launchCmd} ` : ""} ${fullPath}`
            const process = exec(execString)
            const definition = new ProcessDefinition(
              fileName,
              directoryPath,
              process,
              this._ioManager
            )

            this.pool.push(definition)
            definition.setUpExecutionStreams()
            resolve({ value: definition.uid, err: null })
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

  public findProcessByUid(
    uid: ProcessAttachedUid
  ): ProcessDefinition | undefined {
    return this.pool.find((e) => e.uid === uid)
  }
}
