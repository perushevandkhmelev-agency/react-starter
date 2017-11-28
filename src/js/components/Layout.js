import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

import 'styles/layout.scss'

export default class Layout extends Component {
  render() {
    const { className, children, ...props } = this.props
    return (
      <section {...props} className={classnames(className, 'layout')}>
        <div className="layout__header">Header</div>
        <div className="layout__content">{children}</div>
        <div className="layout__footer">Footer</div>
      </section>
    )
  }
}

const component = type =>
  class extends Component {
    render() {
      const { className, children, ...props } = this.props
      return (
        <div {...props} className={classnames(className, `layout-${type}`)}>
          {children}
        </div>
      )
    }
  }

Layout.Container = component('container')
