import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createSelector, createStructuredSelector } from 'reselect'
import get from 'lodash/get'
import kebabCase from 'lodash/kebabCase'

import Layout from './Layout'
import { incrementOverflowCount, decrementOverflowCount } from '../utils/overflowManager'
import analytics from '../utils/analytics'

import '../../styles/modal.scss'

const modalSelector = state => state.modal
const modalComponentNameSelector = createSelector(
  modalSelector, (modal) => get(modal, 'component')
)

const mapStateToProps = createStructuredSelector({
  componentName: modalComponentNameSelector
})

@connect(mapStateToProps)
export default class Modal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func
  };

  render() {
    const modalClassName = get(this.props.with, 'modalClassName', get(this.props.with, 'WrappedComponent.modalClassName'))
    return (
      <div className="modal" onClick={this.props.onClose}>
        <div className="modal__backdrop" />
        <div className="modal__layout">
          <div className="modal__container">
            <Layout.Modal className={modalClassName} onClick={event => event.stopPropagation()}>
              {this.props.children}
              <div className="modal__close" onClick={this.props.onClose}>&times;</div>
            </Layout.Modal>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount() {
    incrementOverflowCount(false)

    this.handleKeydown = this._handleKeydown.bind(this)
    window.addEventListener('keydown', this.handleKeydown, true)

    analytics.hit(`/virtual/modal/${kebabCase(this.props.componentName)}`, this.props.componentName)
  }

  componentWillUnmount() {
    decrementOverflowCount()

    window.removeEventListener('keydown', this.handleKeydown, true)
    document.body.style.overflow = 'visible'
  }

  _handleKeydown(event) {
    if (this.props.onClose && (event.key === 'Escape' || event.keyCode === 27)) {
      this.props.onClose()
    }
  }
}
