import fs from "fs"
import path from "path"
import { RuntimeConfiguration } from "../configReader"

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
