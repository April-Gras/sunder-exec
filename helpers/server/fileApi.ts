import fs from 'fs'

export type DirectoryPath = string
export type FileName = string

export type ExtentionMapping = Record<string, string | null>
export type ExecTargetConfigElem = { directoryPath: DirectoryPath, fileNameArray: FileName[] }
export type TargetsApiResponse = ExecTargetConfigElem[]

export function getContentFromDirectoryPath (directoryPath: DirectoryPath, extentionMapping: ExtentionMapping): Promise<ExecTargetConfigElem> {
  return new Promise((resolve, reject) => {
    getTargetFileListFromDirectoryPath(directoryPath).then((fileNameArray) => {
      resolve({
        directoryPath, fileNameArray: filterOutUnvalidExtentionFiles(fileNameArray, extentionMapping)
      })
    }).catch((err) => {
      reject(err)
    })
  })
}

export function filterOutUnvalidExtentionFiles (fileNameArray: FileName[], extentionMapping: ExtentionMapping): FileName[] {
  const validExtentionList = Object.keys(extentionMapping)

  return fileNameArray.filter((fileName) => {
    const extention = extractExtentionFromFileName(fileName)

    return (extention === null || validExtentionList.includes(extention)) && !fileName.startsWith('.')
  })
}

export function extractExtentionFromFileName (fileName: FileName): FileName | null {
  const stringSplit = fileName.split('.')

  return stringSplit.length > 1 ? stringSplit[stringSplit.length - 1] : null
}

export function getTargetFileListFromDirectoryPath (directoryPath: DirectoryPath): Promise<FileName[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(directoryPath, {
      encoding: 'utf-8',
      withFileTypes: true
    }, (err, fileNameArray) => {
      if (err) { reject(err) } else {
        resolve(fileNameArray.reduce((accumulartor, file) => {
          if (file.isFile()) { accumulartor.push(file.name) }
          return accumulartor
        }, [] as FileName[]))
      }
    })
  })
}
