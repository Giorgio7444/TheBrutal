import { Storage } from '@google-cloud/storage'

const storage = new Storage({ keyFilename: './serviceAccount.json' })

await storage.bucket('thebrutal-b5a44.firebasestorage.app').setCorsConfiguration([
  {
    origin: ['*'],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD'],
    responseHeader: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With'],
    maxAgeSeconds: 3600,
  },
])

console.log('CORS configurato correttamente')