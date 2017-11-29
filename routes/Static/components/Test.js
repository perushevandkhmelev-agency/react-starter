import React, { Component } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
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
  static fetchData(state, store) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, 2000)
    })
  }

  render() {
    return (
      <Layout>
        <div>
          <FormattedMessage {...messages.title} />
          <br />
          <Link to="/">
            <FormattedMessage {...messages.back} />
          </Link>
        </div>
      </Layout>
    )
  }
}
