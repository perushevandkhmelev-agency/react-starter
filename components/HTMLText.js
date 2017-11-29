import React from 'react'

export default class HTMLText extends React.Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  static propTypes = {
    component: React.PropTypes.oneOfType([
      React.PropTypes.string,
      React.PropTypes.func
    ])
  };

  static defaultProps = {
    component: 'span'
  };

  render() {
    let { text, html, component, ...props } = this.props
    if (text) {
      html = text.replace(/(?:\r)?\n/g, '<br/>')
    }

    if (html) {
      return React.createElement(
        this.props.component,
        {
          ...props,
          onClick: this._handleClick.bind(this),
          dangerouslySetInnerHTML: {__html: html }
        }
      )
    } else {
      return null
    }
  }

  _handleClick(event) {
    if (event.target.nodeName === 'A') {
      const href = event.target.getAttribute('href')
      const target = event.target.getAttribute('target')

      if (!target && (/^\/[^\/]/.test(href) || href === '/')) {
        event.preventDefault()
        event.stopPropagation()
        this.context.router.push(href)
      }
    }
  }
}
