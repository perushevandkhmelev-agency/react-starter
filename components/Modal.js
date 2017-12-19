import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import kebabCase from 'lodash/kebabCase'
import { incrementOverflowCount, decrementOverflowCount } from 'utils/overflowManager'
import analytics from 'utils/analytics'
import styled, { css, injectGlobal, keyframes } from 'styled-components'
import { media, zIndex } from 'utils/styles'

export default class extends Component {
  static contextTypes = {
    mount: PropTypes.object
  }

  componentDidMount() {
    incrementOverflowCount()

    window.addEventListener('keydown', this.handleKeydown, true)

    analytics.hit(`/virtual/modal/${kebabCase(this.props.name)}`, this.props.name)
  }

  componentWillUnmount() {
    decrementOverflowCount()

    window.removeEventListener('keydown', this.handleKeydown, true)
  }

  render() {
    return (
      <Root className="max-height" onClick={this.context.mount.pop}>
        <Backdrop />
        <Container className="max-height">
          <Layout className="max-height">
            <Wrapper className="max-height">
              <Content onClick={event => event.stopPropagation()}>
                {this.props.children}
                <Close onClick={this.context.mount.pop}>&times;</Close>
              </Content>
            </Wrapper>
          </Layout>
        </Container>
      </Root>
    )
  }

  _handleKeydown = event => {
    if (event.key === 'Escape' || event.keyCode === 27) {
      this.context.mount.pop()
    }
  }
}

const ModalFixed = css`
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  overflow-y: auto;
`

injectGlobal`
  .modal-enter {
    ${media.mobile`
      ${ModalFixed};
      opacity: 0;
      transform: translate(0, 50px);
    `};
  }

  .modal-enter-active {
    ${media.mobile`
      opacity: 1;
      transform: translate(0, 0);
      transition: transform 0.25s ease-out, opacity 0.25s;
    `};
  }

  .modal-exit {
    z-index: ${zIndex.modal};
    opacity: 1;

    ${media.mobile`
      ${ModalFixed};
    `};
  }

  .modal-exit-active {
    opacity: 0.01;
    transition: opacity 0.25s;
  }
`

const Root = styled.div`
  ${media.desktop`
    position: fixed;
    z-index: ${zIndex.modal};
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  `};
`

const modalFadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const Backdrop = styled.div`
  ${media.desktop`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    animation: ${modalFadeIn} 0.3s;
    background: rgba(0, 0, 0, 0.4);
  `};
`

const Container = styled.div`
  ${media.desktop`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  `};
`

const modalEnter = keyframes`
  0% {
    transform: translate(0, 50px);
    opacity: 0;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translate(0, 0px);
  }
`

const Layout = styled.div`
  ${media.desktop`
    display: table;
    width: 100%;
    height: 100%;
    padding: 50px 0;
    animation: ${modalEnter} 0.5s cubic-bezier(0.1, 0.9, 0.2, 1);
  `};
`

const Wrapper = styled.div`
  ${media.desktop`
    position: relative;
    display: table-cell;
    width: 100%;
    transform: translateZ(0);
    text-align: center;
    vertical-align: middle;
  `};
`

const Content = styled.div`
  position: relative;
  padding: 40px 20px;
  text-align: left;
  background-color: white;

  ${media.mobile`
    min-height: 100%;
  `};

  ${media.desktop`
    width: 620px;
    margin-right: auto;
    margin-left: auto;
    padding-right: 40px;
    padding-left: 40px;
    border-radius: 5px;
  `};
`

const Close = styled.div`
  position: absolute;
  top: 6px;
  right: 12px;
  cursor: pointer;
  color: rgba(black, 0.3);
  transition: color 0.2s ease-out;
  font-size: 38px;

  ${media.desktop`
    &:hover {
      color: black;
    }
  `};
`
