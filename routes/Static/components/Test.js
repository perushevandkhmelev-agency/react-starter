import React, { Component } from 'react'
import { defineMessages, FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'

const messages = defineMessages({
  title: {
    id: 'test.title',
    defaultMessage: 'Тестовая страница'
  },
  back: {
    id: 'test.back',
    defaultMessage: 'Главная страница'
  }
})

export default class extends Component {
  render() {
    return (
      <Layout>
        <h1>
          <FormattedMessage {...messages.title} />
        </h1>
        <p>
          <Link to="/">
            <FormattedMessage {...messages.back} />
          </Link>
        </p>
      </Layout>
    )
  }
}
