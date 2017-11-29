import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import CSSModules from 'react-css-modules'
import kebabCase from 'lodash/kebabCase'
import Layout from './Layout'
import { incrementOverflowCount, decrementOverflowCount } from 'utils/overflowManager'
import analytics from 'utils/analytics'
import styles from 'styles/modal.scss'

@CSSModules(styles)
export default class extends Component {
  static contextTypes = {
    mount: PropTypes.object
  }

  componentDidMount() {
    incrementOverflowCount()

    window.addEventListener('keydown', this.handleKeydown, true)

    analytics.hit(`/virtual/modal/${kebabCase(this.props.name)}`, this.props.name)
  }

  componentWillUnmount() {
    decrementOverflowCount()

    window.removeEventListener('keydown', this.handleKeydown, true)
  }

  render() {
    return (
      <div styleName="root" onClick={this.context.mount.pop}>
        <div styleName="backdrop" />
        <div styleName="container">
          <div styleName="layout">
            <div styleName="content">
              <Layout.Modal className={this.props.className} onClick={event => event.stopPropagation()}>
                {this.props.children}
                <div styleName="close" onClick={this.context.mount.pop}>
                  &times;
                </div>
              </Layout.Modal>
            </div>
          </div>
        </div>
      </div>
    )
  }

  _handleKeydown = event => {
    if (event.key === 'Escape' || event.keyCode === 27) {
      this.context.mount.pop()
    }
  }
}
