import nprogress from 'nprogress'
import defer from 'lodash/defer'
import '../../styles/nprogress.scss'

let index = 0

function increment() {
  if (index++ === 0) {
    nprogress.start()
  }
}

function decrement() {
  index = Math.max(0, index - 1)

  if (index === 0) {
    done()
  }
}

function done() {
  index = 0
  defer(nprogress.done)
}

function start() {
  index = 0
  increment()
}

function wrap(...args) {
  increment()
  Promise.all(args)
    .then(decrement)
    .catch(decrement)
}

export default {
  increment,
  decrement,
  start,
  done,
  wrap
}

