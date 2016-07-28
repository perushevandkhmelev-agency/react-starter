import koaRouter from 'koa-router'
import koaProxy from 'koa-proxy'

export default function(requestPath, apiUrl) {
  return koaRouter()
    .all(requestPath, koaProxy({ host: apiUrl }))
    .routes()
}
