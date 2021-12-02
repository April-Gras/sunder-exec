import { IncomingMessage } from "http"

export function getJsonFromReq(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    const bufferArray: any[] = []
    req
      .on("data", (chunk) => {
        bufferArray.push(chunk)
      })
      .on("end", () => {
        try {
          resolve(JSON.parse(Buffer.concat(bufferArray).toString()))
        } catch (err) {
          reject(err)
        }
      })
  })
}
