import React, { Component } from 'react'

export default class Layout extends Component {
  render() {
    const { children, ...props } = this.props
    return (
      <section {...props} className="root">
        <div className="header">Header</div>
        <div className="content">{children}</div>
        <div className="footer">Footer</div>
      </section>
    )
  }
}

const component = styles =>
  class extends Component {
    render() {
      const { children, ...props } = this.props
      return (
        <div {...props} className="root">
          {children}
        </div>
      )
    }
  }

Layout.Container = component('container')
Layout.Modal = component('modal')
