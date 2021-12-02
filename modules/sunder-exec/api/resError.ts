import { ServerResponse } from "http"

export const resError = function (
  res: ServerResponse,
  message: string,
  statusCode = 404
) {
  res.statusCode = statusCode
  res.statusMessage = message
  res.end(JSON.stringify({ message, statusCode }))
}
