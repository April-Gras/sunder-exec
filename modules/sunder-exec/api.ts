import { IncomingMessage, ServerResponse } from 'http'
import { initializeSocketProcess } from './socket'

type SocketManager = ReturnType<typeof initializeSocketProcess>

type ReqResBundle = {
  req: IncomingMessage
  res: ServerResponse
}

export default function (req: IncomingMessage, res: ServerResponse, ioManager: SocketManager): void {
  handleOptionCase({ req, res }, () => {
    postRoutes.find(e => e.routeUrl === '/rest-ping')?.handler.bind({ server: { req, res }, ioManager })('ok')
  })
}

function handleOptionCase ({ req, res }: ReqResBundle, notOptionCallback: (context: ReqResBundle) => void) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Request-Method', '*')
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST')
  res.setHeader('Access-Control-Allow-Headers', '*')
  res.setHeader('Content-Type', 'application/json')

  switch (req.method) {
    case 'GET': return notOptionCallback({ req, res })
    case 'POST': return notOptionCallback({ req, res })
    case 'OPTION': return res.end('OPTION OK')
    default:
      res.statusCode = 404
      res.statusMessage = 'Url not found'
      res.end('Url not found')
  }
}

type PostPayloadDescriptor = {
  '/rest-ping': 'ok'
  '/type-test': 'not ok'
}
type AvailablePostRoutes = keyof PostPayloadDescriptor

type PostThis = { server: ReqResBundle, ioManager: SocketManager }
type PostValidator<T extends AvailablePostRoutes> = (value: any) => value is PostPayloadDescriptor[T]
type PostHandler<T extends AvailablePostRoutes> = (this: PostThis, value: PostPayloadDescriptor[T]) => void

function createPostRoute<T extends AvailablePostRoutes> (routeUrl: T, handler: PostHandler<T>, validator: PostValidator<T>): {
    handler: PostHandler<T>
    validator: PostValidator<T>
    routeUrl: T
} {
  return {
    handler, validator, routeUrl
  }
}

function postRestPingValidator<T extends PostPayloadDescriptor['/rest-ping']> (value: any): value is T {
  return typeof value === 'string' && value === 'ok'
}

function postRestPingHandler<T extends PostPayloadDescriptor['/rest-ping']> (this: PostThis, value: T) {
  this.ioManager.emit('confirmScriptLaunch', {
    directoryPath: 'lmfao',
    fileName: 'knfai',
    uid: 'dkajhs'
  })
  this.server.res.end(value)
}

const postRoutes = [
  createPostRoute('/rest-ping', postRestPingHandler, postRestPingValidator)
]
const livePostRoutes = postRoutes.map(e => e.routeUrl)
