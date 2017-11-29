let overflowCount = 0
let overflow = false

export function incrementOverflowCount(shouldScroll = true) {
  overflowCount++

  if (overflowCount > 0 && !overflow) {
    overflow = true
    document.body.style.overflow = 'hidden'

    const style = window.getComputedStyle(document.body)
    const overflowStyle = style.getPropertyValue('overflow')
  }
}

export function decrementOverflowCount() {
  overflowCount--

  if (overflowCount <= 0 && overflow) {
    overflow = false
    document.body.style.removeProperty('overflow')
  }
}
