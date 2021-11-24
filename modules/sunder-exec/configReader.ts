import path from 'path'
import { readFile } from 'fs'

export interface RuntimeConfiguration {
  targetDirectories: string[]
  extentionMapping: Record<string, string>
  noExtentionExec: null | string
}

export function getRuntimeExtention (): Promise<RuntimeConfiguration> {
  return new Promise((resolve, reject) => {
    readFile(path.resolve(path.join(__dirname, '../../', 'sunder-exec-config.json')), {
      encoding: 'utf-8'
    }, (err, data) => {
      if (err) { reject(err) } else {
        data = JSON.parse(data)

        if (contentIsValidConfig(data)) {
          resolve(data)
        } else { reject(new Error('Config is invalid vro')) }
      }
    })
  })
}

function contentIsValidConfig (data: any): data is RuntimeConfiguration {
  if (!valueIsObject(data)) {
    console.log('Missing data')
    return false
  }
  if (!valueIsArray(data.targetDirectories)) {
    console.log('targetDirectory is not an array')
    return false
  }
  if (!arrayIsFilledWithString(data.targetDirectories)) {
    console.log('Some content in targetDirectories is not a string')
    return false
  }
  if (!valueIsObject(data.extentionMapping)) {
    console.log('extentionMapping is not an object')
    return false
  }
  if (!objectContainsOnlyStringsOrNull(data.extentionMapping)) {
    console.log('Some extentionMapping value are not strings')
    return false
  }
  if (!(data.noExtentionExec === null || typeof data.noExtentionExec === 'string')) {
    console.log('noExtentionExec is neither null nor is it a string')
    return false
  } else { return true }
}

function valueIsObject (value: any): value is Object {
  return typeof value === 'object' && !(value instanceof Array)
}

function objectContainsOnlyStringsOrNull (value: Object) {
  return Object.values(value).every(e => typeof e === 'string' || e === null)
}

function valueIsArray (value: any): value is any[] {
  return value instanceof Array
}

function arrayIsFilledWithString (value: any[]): value is string[] {
  return value.every(e => typeof e === 'string')
}
