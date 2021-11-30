import { IncomingMessage, ServerResponse } from "http"
import { initializeSocketProcess } from "../socket"

export type SocketManager = ReturnType<typeof initializeSocketProcess>

export type ReqResBundle = {
  req: IncomingMessage
  res: ServerResponse
}

export default function (
  req: IncomingMessage,
  res: ServerResponse,
  ioManager: SocketManager
): void {
  handleOptionCase({ req, res }, () => {
    res.end("ok")
  })
}

function handleOptionCase(
  { req, res }: ReqResBundle,
  notOptionCallback: (context: ReqResBundle) => void
) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Request-Method", "*")
  res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST")
  res.setHeader("Access-Control-Allow-Headers", "*")
  res.setHeader("Content-Type", "application/json")

  switch (req.method) {
    case "GET":
      return notOptionCallback({ req, res })
    case "POST":
      return notOptionCallback({ req, res })
    case "OPTION":
      return res.end("OPTION OK")
    default:
      res.statusCode = 404
      res.statusMessage = "Url not found"
      res.end("Url not found")
  }
}
