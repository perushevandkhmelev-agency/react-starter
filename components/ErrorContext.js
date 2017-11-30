import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class extends Component {
  static get childContextTypes() {
    return {
      error: PropTypes.object
    }
  }

  getChildContext() {
    return {
      error: this.props.error
    }
  }

  render() {
    return this.props.children
  }
}
