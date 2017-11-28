import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import kebabCase from 'lodash/kebabCase'
import Layout from './Layout'
import { incrementOverflowCount, decrementOverflowCount } from 'utils/overflowManager'
import analytics from 'utils/analytics'
import 'styles/modal.scss'

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
      <div className="modal" onClick={this.context.mount.pop}>
        <div className="modal__backdrop" />
        <div className="modal__container">
          <div className="modal__layout">
            <div className="modal__content">
              <Layout.Modal className={this.props.className} onClick={event => event.stopPropagation()}>
                {this.props.children}
                <div className="modal__close" onClick={this.context.mount.pop}>
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
