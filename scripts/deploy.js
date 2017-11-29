if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ silent: true })

  var exec = require('child_process').exec
  exec('./node_modules/.bin/webpack --config ./app/webpack/default.config.babel.js', function(error, stdout, stderr) {
    console.log('stdout: ' + stdout)
    console.log('stderr: ' + stderr)
    if (error !== null) {
      console.log('exec error: ' + error)
    }
  })
}
