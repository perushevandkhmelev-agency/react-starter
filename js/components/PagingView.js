import React from 'react'
import classnames from 'classnames'
import { findDOMNode } from 'react-dom'

import '../../styles/paging-view.scss'

export default class PagingView extends React.Component {
  static get propTypes() {
    return {
      page: React.PropTypes.number,
      onPagesChange: React.PropTypes.func
    }
  }

  constructor() {
    super()

    this.state = {
      pages: 0,
      position: 0,
      animation: true
    }
  }

  componentDidMount() {
    this._handleResize = this._handleResize.bind(this)
    window.addEventListener('resize', this._handleResize)
    this._handleResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.page !== this.props.page) {
      this._updatePage(nextProps.page, this.state.pages)
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.children.length !== prevProps.children.length) {
      this._handleResize()
    }
  }

  render() {
    const modifiers = {
      'with-animation': this.state.animation
    }
    return (
      <div
        className={classnames(this.props.className, 'paging-view', modifiers)}
        onTouchStart={this._handleSwipeStart.bind(this)}
        onTouchMove={this._handleSwipeMove.bind(this)}
        onTouchEnd={this._handleSwipeEnd.bind(this)}
        onTouchCancel={this._handleSwipeEnd.bind(this)}
      >
        <div ref="content" className="paging-view__content" style={this._positionStyle()}>
          {this.props.children}
        </div>
      </div>
    )
  }

  _handleResize() {
    let pages = this._calculatePages()
    this._updatePage(this.props.page, pages)
  }

  _handleSwipeStart(event) {
    if (!event.touches || event.touches.length !== 1 || this.state.pages <= 1) {
      return
    }

    this._startX = event.touches[0].pageX
    this._startPosition = this.state.position
    this._dragging = true
  }

  _handleSwipeMove(event) {
    if (!this._dragging || !event.touches || event.touches.length !== 1) {
      return
    }

    let touchX = event.touches[0].pageX
    let touchTimestamp = new Date().getTime() / 1000
    let swipeLength = Math.round(Math.sqrt(Math.pow(touchX - this._startX, 2)))

    if (swipeLength > 10) {
      event.preventDefault()
    } else {
      return
    }

    if (this._touchX) {
      this._speed = (touchX - this._touchX) / (touchTimestamp - this._touchTimestamp)
    }

    this._touchX = touchX
    this._touchTimestamp = touchTimestamp
    this._direction = touchX > this._startX ? -1 : 1

    let contentNode = this.refs.content
    let width = contentNode.offsetWidth
    let maxOffset = width / 5
    let rico = Math.pow(width, 2) / maxOffset

    let position = this._startPosition + -swipeLength * this._direction
    if (position > 0) {
      let absPannedOffset = Math.abs(position)
      let absOffset = ((-1 / rico) * Math.pow(absPannedOffset - width, 2)) + maxOffset
      position = absOffset
    }

    else if (Math.abs(position) > contentNode.scrollWidth - contentNode.offsetWidth) {
      let absPannedOffset = Math.abs(position) - (contentNode.scrollWidth - contentNode.offsetWidth)
      let absOffset = ((-1 / rico) * Math.pow(absPannedOffset - width, 2)) + maxOffset
      position = this._startPosition - absOffset
    }

    this.setState({
      animation: false,
      position: position
    })
  }

  _handleSwipeEnd() {
    let node = findDOMNode(this)
    let page = -this.state.position / node.offsetWidth

    if (this._direction > 0 && Math.abs(this._speed) >= 100) {
      page = Math.ceil(page)
    }

    else if (this._direction < 0 && Math.abs(this._speed) >= 100) {
      page = Math.floor(page)
    }

    else {
      page = Math.round(page)
    }

    page = Math.min(Math.max(0, page), this.state.pages - 1)
    this._updatePage(page, this.state.pages)
  }

  _updatePage(page, pages) {
    let node = findDOMNode(this)

    this.setState({
      animation: true,
      pages: pages,
      position: pages > 1 ? -page * node.offsetWidth : 0
    })

    if (this.props.onPagesChange) {
      this.props.onPagesChange(page, pages)
    }
  }

  _calculatePages() {
    let node = this.refs.content
    if (node) {
      return Math.ceil(node.scrollWidth / node.offsetWidth)
    }
    return 0
  }

  _positionStyle() {
    let translate = `translate3d(${this.state.position}px, 0px, 0px)`
    let translate2d = `translate(${this.state.position}px, 0px)`
    return {
      WebkitTransform: translate,
      msTransform: translate2d,
      transform: translate
    }
  }
}
