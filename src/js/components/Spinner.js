import React from 'react'
import classnames from 'classnames'

import '../../styles/spinner.scss'

export default class Spinner extends React.Component {
  render() {
    return (
      <div className={classnames(this.props.className, 'ko-spinner-string')}>
        <div className="ko-spinner-string__content">
          <span className={classnames('ko-spinner', { 'is-animating': this.props.animating })} />
          {this.props.children ? <span>{this.props.children}</span> : null}
        </div>
      </div>
    )
  }
}
