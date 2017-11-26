import React from 'react'
import classnames from 'classnames'
import { connect } from 'react-redux'
import { createSelector, createStructuredSelector } from 'reselect'
import Transition from 'react-transition-group'
import get from 'lodash/get'

import Modal from './Modal'
import ErrorHandler from './ErrorHandler'
import { modalComponentFromKey } from '../constants/ModalComponents'
import * as ModalAction from '../actions/modal'

import '../../styles/modal-animation.scss'

const modalSelector = state => state.modal

const modalComponentSelector = createSelector(
  modalSelector, (modal) => modalComponentFromKey(get(modal, 'component'))
)

const modalPropsSelector = createSelector(
  modalSelector, (modal) => get(modal, 'props', {})
)

const modalUidSelector = createSelector(
  modalSelector, (modal) => get(modal, 'uid')
)

const mapStateToProps = createStructuredSelector({
  component: modalComponentSelector,
  componentUid: modalUidSelector,
  componentProps: modalPropsSelector
})

@connect(mapStateToProps, ModalAction)
export default class Root extends React.Component {
  render() {
    return this.props.error ? this._renderError() : this._renderApplication()
  }

  _renderError() {
    return <ErrorHandler code={this.props.error} />
  }

  _renderApplication() {
    return (
      <section className={classnames('max-height', { 'has-modal': !!this.props.component })}>
        {this.props.children}
        <Transition transitionName='modal-animation' transitionEnterTimeout={500} transitionLeaveTimeout={100}>
          {this.props.component ?
            <Modal key={this.props.componentUid} with={this.props.component} onClose={this.props.hideModal}>
              <this.props.component {...this.props.componentProps} />
            </Modal> : null}
        </Transition>
      </section>
    )
  }
}
