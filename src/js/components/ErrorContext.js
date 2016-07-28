import React from 'react'

export default class ErrorContext extends React.Component {
  static get childContextTypes() {
    return {
      error: React.PropTypes.object
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
