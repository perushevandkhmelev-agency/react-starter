import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export default class extends Component {
  static get propTypes() {
    return {
      code: PropTypes.number
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
        <p>
          <Link to="/">Домой</Link>
        </p>
      </div>
    )
  }
}
