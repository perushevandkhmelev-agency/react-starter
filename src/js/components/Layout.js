import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import CSSModules from 'react-css-modules'
import styles from 'styles/layout.scss'

@CSSModules(styles)
export default class Layout extends Component {
  render() {
    const { className, children, ...props } = this.props
    return (
      <section {...props} styleName="test" className={classnames(className, 'layout')}>
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
Layout.Modal = component('modal')
