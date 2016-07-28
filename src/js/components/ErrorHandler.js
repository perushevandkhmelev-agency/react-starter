import React from 'react'
import { Link } from 'react-router'

export default class ErrorHandler extends React.Component {
  static get propTypes() {
    return {
      code: React.PropTypes.number
    }
  }

  static get defaultProps() {
    return {
      code: 404
    }
  }

  render() {
    return (
      <div>
        <h1>{this.props.code}</h1>
        <p><Link to="/">Домой</Link></p>
      </div>
    )
  }
}
