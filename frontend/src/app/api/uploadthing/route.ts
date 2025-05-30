import { createRouteHandler } from 'uploadthing/next'
import { ourFileRouter }      from './core'

const handler = createRouteHandler({ router: ourFileRouter })

export const GET  = handler.GET
export const POST = handler.POST

export const config = { api: { bodyParser: false } }
