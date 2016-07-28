import React from 'react'
import classnames from 'classnames'

import '../../styles/layout.scss'

export default class Layout extends React.Component {
  static propTypes = {
    footer: React.PropTypes.bool,
    user: React.PropTypes.object
  };

  static defaultProps = {
    footer: true,
    user: null
  };

  render() {
    const { className, ...restProps } = this.props
    return (
      <section className={classnames(this.props.className, 'layout')}>
        <div className="layout__header">
          Header
        </div>
        <div className="layout__content">
          {this.props.children}
        </div>
        <div className="layout__footer">
          Footer
        </div>
      </section>
    )
  }
}

function component(type) {
  class LayoutComponent extends React.Component {
    render() {
      return (
        <div {...this.props} className={classnames(this.props.className, `layout-${type}`)}>
          {this.props.children}
        </div>
      )
    }
  }
  return LayoutComponent
}

Layout.Container = component('container')
