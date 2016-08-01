import React from 'react'
import classnames from 'classnames'

import '../../styles/spinner.scss'

export default class Spinner extends React.Component {
  render() {
    return (
      <div className={classnames(this.props.className, 'spinner-string')}>
        <div className="spinner-string__content">
          <span className={classnames('spinner', { 'is-animating': this.props.animating })} />
          {this.props.children ? <span>{this.props.children}</span> : null}
        </div>
      </div>
    )
  }
}
