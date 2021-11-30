import fs from "fs"
import path from "path"
import { RuntimeConfiguration } from "../../configReader"
import { GetHandler, GetPayloadReturnDescriptor } from "../../routes/index"

type ExpectedReturn = GetPayloadReturnDescriptor["/readDirectoryFromConfig"]

export const handler = function () {
  return new Promise((resolve) => {
    const { targetDirectories } = this.runtimeConfig

    console.log({ targetDirectories })
    Promise.allSettled(
      targetDirectories.map((directoryPath) => {
        return getContentFromDirectoryPath(
          directoryPath,
          this.runtimeConfig.extentionMapping
        )
      })
    ).then((promiseReturns) => {
      const apiReturn: ExpectedReturn = promiseReturns.reduce(
        (accumulator, response) => {
          if (response.status === "fulfilled") {
            accumulator.push(response.value)
          } else {
            console.warn(
              `[WARN] - Failed to read a directory from the config:\n${response.reason}`
            )
          }
          return accumulator
        },
        [] as ExpectedReturn
      )

      resolve({
        err: null,
        value: apiReturn,
      })
    })
  })
} as GetHandler<"/readDirectoryFromConfig">

export function getContentFromDirectoryPath(
  directoryPath: string,
  extentionMapping: RuntimeConfiguration["extentionMapping"]
): Promise<{ directoryPath: string; fileNameArray: string[] }> {
  return new Promise((resolve, reject) => {
    getTargetFileListFromDirectoryPath(directoryPath)
      .then((fileNameArray) => {
        resolve({
          directoryPath,
          fileNameArray: filterOutUnvalidExtentionFiles(
            fileNameArray,
            extentionMapping
          ),
        })
      })
      .catch((err) => {
        reject(err)
      })
  })
}

function filterOutUnvalidExtentionFiles(
  fileNameArray: string[],
  extentionMapping: RuntimeConfiguration["extentionMapping"]
): string[] {
  const validExtentionList = Object.keys(extentionMapping)

  console.log({ validExtentionList })
  return fileNameArray.filter((fileName) => {
    const extention = path.extname(fileName)

    return (
      (extention === "" || validExtentionList.includes(extention)) &&
      !fileName.startsWith(".")
    )
  })
}

function getTargetFileListFromDirectoryPath(
  directoryPath: string
): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(
      directoryPath,
      {
        encoding: "utf-8",
        withFileTypes: true,
      },
      (err, fileNameArray) => {
        if (err) {
          reject(err)
        } else {
          resolve(
            fileNameArray.reduce((accumulartor, file) => {
              if (file.isFile()) {
                accumulartor.push(file.name)
              }
              return accumulartor
            }, [] as string[])
          )
        }
      }
    )
  })
}
