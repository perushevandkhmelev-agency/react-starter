import React, { Component } from 'react'
import styled, { css } from 'styled-components'
import PropTypes from 'prop-types'
import range from 'lodash/range'
import partial from 'lodash/partial'

export default class extends Component {
  static propTypes = {
    page: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    onPageClick: PropTypes.func
  }

  static defaultProps = {
    page: 0,
    pages: 0,
    onPageClick: () => {}
  }

  render() {
    return <Root>{this.props.pages > 9 ? this._renderCounter() : range(this.props.pages).map(this._renderPage)}</Root>
  }

  _renderPage = index => {
    if (this.props.pages <= 1) {
      return null
    }

    return <Item active={index === this.props.page} onClick={partial(this.props.onPageClick, index)} key={index} />
  }

  _renderCounter = () => {
    return (
      <Counter>
        {this.props.page + 1} / {this.props.pages}
      </Counter>
    )
  }
}

const Root = styled.div`
  text-align: center;
`

const Item = styled.div`
  display: inline-block;
  width: 5px;
  height: 5px;
  border: 1px solid black;
  border-radius: 50%;

  ${props =>
    props.active &&
    css`
      background-color: black;
    `};
`

const Counter = styled.div`
  font-weight: bold;
`
