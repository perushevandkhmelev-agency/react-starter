import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { defineMessages, FormattedMessage } from 'react-intl'
import { Link } from 'react-router-dom'
import Layout from 'components/Layout'
import Icon from 'components/Icon'
import MainModal from 'components/MainModal'

const messages = defineMessages({
  title: {
    id: 'main.title',
    defaultMessage: 'Главная страница'
  },
  link: {
    id: 'main.link',
    defaultMessage: 'Тестовая страница'
  }
})

export default class extends Component {
  static contextTypes = {
    mount: PropTypes.object
  }

  render() {
    return (
      <Layout>
        <h1>
          <Icon name="thumbs-up" />
          <FormattedMessage {...messages.title} />
        </h1>
        <button onClick={() => this.context.mount.push(MainModal)}>Open test modal</button>
        <p>
          <Link to="/test">
            <FormattedMessage {...messages.link} />
          </Link>
        </p>
      </Layout>
    )
  }
}
