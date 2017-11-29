import { fork } from 'child_process'
import assets from './assets'

let server = null
let env = Object.create(process.env)
env.CHILD = '1'

assets.serve(() => {
  if (server) {
    console.log('Shut down server...')
    server.kill()
  }

  console.log('Starting server...')
  server = fork('./scripts/start.js', { env })
})

