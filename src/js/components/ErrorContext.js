import React from 'react'
import PropTypes from 'prop-types'

export default class ErrorContext extends React.Component {
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
