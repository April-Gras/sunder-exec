import path from 'path'
import { ChildProcess, exec } from 'child_process'
import UidGen from 'uid-generator'
import { RuntimeConfiguration } from './configReader'
import { DirectoryPath, FileName } from '~/helpers/server/fileApi'

const uidgen = new UidGen()

type ProcessAttachedUid = string

class ProcessDefinition {
  uid: ProcessAttachedUid
  private _process: ChildProcess

  constructor (process: ChildProcess) {
    this._process = process
    this.uid = uidgen.generateSync()
  }
}

export class ProcessPool {
  pool: readonly ProcessDefinition[]
  private _configuration: RuntimeConfiguration

  constructor (configuration: RuntimeConfiguration) {
    this.pool = []
    this._configuration = configuration
  }

  // public addNewProcessFromDirectoryAndFileName (directoryPath: DirectoryPath, fileName: FileName): ProcessAttachedUid {
  //   const newProcess = exec()
  // }

  // public findProcessByUid (uid: ProcessAttachedUid): ProcessDefinition | undefined {
  //   return this.pool.find(e => e.uid === uid)
  // }
}
