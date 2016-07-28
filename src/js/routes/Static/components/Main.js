import React, { Component } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import { Link } from 'react-router'

import Layout from '../../../components/Layout'

const messages = defineMessages({
  title: {
    id: 'main.title',
    description: 'Main page',
    defaultMessage: 'Главная страница'
  },
  link: {
    id: 'main.link',
    description: 'Test',
    defaultMessage: 'Тестовая страница'
  }
})

export default class Main extends Component {
  render() {
    return (
      <Layout>
        <div>
          <FormattedMessage {...messages.title} /><br />
          <Link to="/test">
            <FormattedMessage {...messages.link} />
          </Link>
        </div>
      </Layout>
    )
  }
}
