import gulp from 'gulp'
import pkg from './package.json'

let exec = require('child_process').exec,
  platform = process.platform,
  /**
   * Opens the font-server defined in package.json
   *
   * @return {void} logs to terminal.
   */
  iconsEdit = () => {
    let openFont = {
      linux: `/opt/google/chrome/google-chrome --enable-plugins ${pkg.config.iconsServer}/$(cat .fontello)`,
      darwin: `open -a "Google Chrome" ${pkg.config.iconsServer}/$(cat .fontello)`,
      win32: `start chrome "${pkg.config.iconsServer}/$(cat .fontello)"`
    }

    if (!openFont[platform]) {
      return false
    }

    // Connects to font server to get a fresh token for our editing session.
    // sends current config in the process.
    let getFontToken = `curl --silent --show-error --fail --output .fontello --form "config=@${
      pkg.config.iconsConfig
    }" ${pkg.config.iconsServer} \n`

    return exec(getFontToken + openFont[platform], function(err, stdout, stderr) {
      console.log(stdout)
      if (stderr) {
        console.error(err, stderr)
      }
    })
  },
  /**
   * Downloads and unpacks our updated font from the iconsServer
   *
   * @return {void} logs operations to terminal.
   */
  iconsSave = () => {
    var scripts = [
      'if test ! $(which unzip); then echo "Unzip is installed"; exit 128; fi',
      'rm -rf .fontello.src .fontello.zip',
      `curl --silent --show-error --fail --output .fontello.zip ${pkg.config.iconsServer}/$(cat .fontello)/get`,
      'unzip .fontello.zip -d .fontello.src'
    ]

    // Move typeface to multiple destinations
    for (var i = 0; i < pkg.config.iconsLocation.length; i++) {
      scripts.push(
        `cp $(find ./.fontello.src -maxdepth 1 -name 'fontello-*')/font/*.woff* ${pkg.config.iconsLocation[i]}`
      )
    }

    // Clean up
    scripts = scripts.concat([
      `mv $(find ./.fontello.src -maxdepth 1 -name 'fontello-*')/config.json ${pkg.config.iconsConfig}`,
      'rm -rf .fontello.src .fontello.zip'
    ])

    exec(scripts.join(' \n '), function(err, stdout, stderr) {
      if (stderr) {
        console.error(err, stderr)
      } else {
        console.log(stdout)
      }
    })
  }

gulp.task('icons-edit', iconsEdit)
gulp.task('icons-save', iconsSave)
