import React from 'react'
import range from 'lodash/utility/range'
import partial from 'lodash/function/partial'
import classnames from 'classnames'

import '../../styles/page-control.scss'

export default class PageControl extends React.Component {
  static get propTypes() {
    return {
      page: React.PropTypes.number.isRequired,
      pages: React.PropTypes.number.isRequired,
      onPageClick: React.PropTypes.func,
      appearance: React.PropTypes.oneOf(['black', 'white'])
    }
  }

  static get defaultProps() {
    return {
      page: 0,
      pages: 0,
      onPageClick: () => {}
    }
  }

  render() {
    const modifiers = {
      [`is-${this.props.appearance}`]: this.props.appearance
    }

    return (
      <div className={classnames(this.props.className, 'page-control', modifiers)}>
        {this.props.pages > 8 ? this._renderCounter() : range(this.props.pages).map(this._renderPage.bind(this))}
      </div>
    )
  }

  _renderPage(index) {
    if (this.props.pages <= 1) {
      return null
    }

    const modifiers = {
      'is-selected': index === this.props.page
    }
    return (
      <div
        key={index}
        className={classnames('page-control__page', modifiers)}
        onClick={partial(this.props.onPageClick, index)}
      ><span /></div>
    )
  }

  _renderCounter() {
    return (
      <div className={classnames('page-control__counter')}>
        <strong>{this.props.page + 1}</strong> / {this.props.pages}
      </div>
    )
  }
}
