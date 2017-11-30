import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from 'styles/layout.scss'
import container from 'styles/layout.container.scss'
import modal from 'styles/layout.modal.scss'

@CSSModules(styles)
export default class Layout extends Component {
  render() {
    const { children, ...props } = this.props
    return (
      <section {...props} styleName="root">
        <div styleName="header">Header</div>
        <div styleName="content">{children}</div>
        <div styleName="footer">Footer</div>
      </section>
    )
  }
}

const component = styles =>
  @CSSModules(styles)
  class extends Component {
    render() {
      const { children, ...props } = this.props
      return (
        <div {...props} styleName="root">
          {children}
        </div>
      )
    }
  }

Layout.Container = component(container)
Layout.Modal = component(modal)
