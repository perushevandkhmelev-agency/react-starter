import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import Helmet from 'react-helmet'
import ErrorHandler from './ErrorHandler'
import Mount from './Mount'

export default class extends Component {
  static contextTypes = {
    error: PropTypes.object
  }

  render() {
    const { code } = this.context.error

    return (
      <section className="max-height">
        <Helmet title="Project name" />
        {code ? <ErrorHandler code={code} /> : <Mount>{renderRoutes(this.props.route.routes)}</Mount>}
      </section>
    )
  }
}
