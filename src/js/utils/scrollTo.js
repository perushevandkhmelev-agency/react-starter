import raf from 'raf'

function easeOutQuad(t, b, c, d) {
  const ts = (t /= d) * t
  const tc = ts * t
  return b + c * (-1 * ts * ts + 4 * tc + -6 * ts + 4 * t)
}

export default function scrollTo(to, duration, element = window) {
  return new Promise((resolve) => {
    let start = window.pageYOffset
    if (element.scrollbars) {
      start = element.scrollbars.getScrollTop()
    } else {
      start = element.scrollTop
    }

    const change = to - start
    const endTime = new Date().getTime() + duration

    raf(function animateScroll() {
      const currentTime = new Date().getTime()
      const progress = Math.min(duration, duration - (endTime - currentTime))
      const value = easeOutQuad(progress, start, change, duration)

      if (element === window) {
        element.scrollTo(0, value)
      } else if (element.scrollbars) {
        element.scrollbars.scrollTop(value)
      } else {
        element.scrollTop = value
      }

      if (currentTime < endTime) {
        raf(animateScroll)
      } else {
        raf(resolve)
      }
    })

  })
}
