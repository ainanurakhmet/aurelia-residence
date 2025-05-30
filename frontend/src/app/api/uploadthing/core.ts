import { createUploadthing } from 'uploadthing/next'
import type { FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

console.log('🔑 UPLOADTHING_TOKEN =', process.env.UPLOADTHING_TOKEN)

const f = createUploadthing()

async function auth(req: Request) {
  const h = req.headers.get('authorization')
  if (!h?.startsWith('Bearer ')) {
    throw new UploadThingError('Unauthorized')
  }
  return { id: h.split(' ')[1] }
}

export const ourFileRouter = {
  roomsUploader: f({ image: { maxFileSize:'4MB', maxFileCount:1 } })
    .onUploadComplete(({ file }) => {
      console.log('✅ Uploaded:', file.key, file.url)
    }),
} satisfies FileRouter


export type OurFileRouter = typeof ourFileRouter
