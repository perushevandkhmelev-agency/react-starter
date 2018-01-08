import React, { Component } from 'react'
import styled from 'styled-components'

export default class extends Component {
  render() {
    return (
      <Root>
        <Header>Header</Header>
        <Content>{this.props.children}</Content>
        <Footer>Footer</Footer>
      </Root>
    )
  }
}

const Root = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%;
`

const Header = styled.header`
  flex-shrink: 0;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`

const Footer = styled.footer`
  flex-shrink: 0;
`
