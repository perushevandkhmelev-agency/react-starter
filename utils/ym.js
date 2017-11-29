var isBrowser = typeof window !== 'undefined'
var c = 'yandex_metrika_callbacks'
var a = 'yandex_metrika_accounts'
var inited = false

function ymProxy(methodName, ...args) {
  window[a].forEach(id => {
    try {
      window[`yaCounter${id}`][methodName](...args)
    } catch (ex) {
      console && console.warn && console.warn(ex)
    }
  })
}

function ymAsyncProxy(...args) {
  if (window[c]) {
    window[c].push(() => ymProxy(...args))
  } else {
    ymProxy(...args)
  }
}

function ym(...args) {
  if (isBrowser && inited) {
    ymAsyncProxy(...args)
  } else {
    console && console.info && console.info('[ym]', args)
  }
}

ym.init = function init(accounts, options = {}) {
  inited = true
  window[a] = window[a].concat(accounts)
  window[c].push(() => {
    window[a].forEach(id => {
      let defaultOptions = {id}

      try {
        window[`yaCounter${id}`] = new Ya.Metrika({
          ...defaultOptions,
          ...options
        })
      } catch (ex) {
        console && console.warn && console.warn(ex)
      }
    })
  })

  let insertPoint = document.getElementsByTagName('script')[0], el = document.createElement('script')
  el.type = 'text/javascript'; el.async = true; el.src = 'https://mc.yandex.ru/metrika/watch.js'
  insertPoint.parentNode.insertBefore(el, insertPoint)
}

if (isBrowser) {
  window[c] = window[c] || []
  window[a] = window[a] || []
}

export default ym
