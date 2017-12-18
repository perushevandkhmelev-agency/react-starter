import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { renderRoutes } from 'react-router-config'
import Helmet from 'react-helmet'
import ErrorPage from './ErrorPage'
import Mount from './Mount'
import styled from 'styled-components'

export default class extends Component {
  static contextTypes = {
    error: PropTypes.object
  }

  render() {
    const { code } = this.context.error

    return (
      <Test className="max-height">
        <Helmet title="Project name" />
        {code ? <ErrorPage code={code} /> : <Mount>{renderRoutes(this.props.route.routes)}</Mount>}
      </Test>
    )
  }
}

const Test = styled.section`
  background-color: red;
`
