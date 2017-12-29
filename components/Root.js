import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import ScrollMemory from 'react-router-scroll-memory'
import Helmet from 'react-helmet'
import ErrorPage from './ErrorPage'
import Mount from './Mount'

export default class extends Component {
  static contextTypes = {
    error: PropTypes.object
  }

  render() {
    const { code } = this.context.error

    return (
      <section className="max-height">
        <ScrollMemory />
        <Helmet title="Project name" />
        {code ? <ErrorPage code={code} /> : <Mount>{renderRoutes(this.props.route.routes)}</Mount>}
      </section>
    )
  }
}
