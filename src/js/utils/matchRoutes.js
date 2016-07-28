import { match } from 'react-router'

export default function(history, routes, location) {
  return new Promise(resolve => {
    match({ history, routes, location }, (...args) => resolve(Array.from(args)))
  })
}
