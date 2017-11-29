import React, { Component } from 'react'
import PropTypes from 'prop-types'
import config from 'assets/fonts/icons/config.json'
import CSSModules from 'react-css-modules'
import styles from 'styles/icons.scss'

const nameToChar = name => {
  const glyph = config.glyphs.find(item => item.css === name)
  if (glyph) {
    return String.fromCodePoint(glyph.code)
  } else {
    return ''
  }
}

@CSSModules(styles)
export default class extends Component {
  render() {
    return <span styleName="root">{nameToChar(this.props.name)}</span>
  }
}
