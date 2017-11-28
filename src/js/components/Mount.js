import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import get from 'lodash/get'
import uniqueId from 'lodash/uniqueId'
import pick from 'lodash/pick'
import omit from 'lodash/omit'
import without from 'lodash/without'
import dropRightWhile from 'lodash/dropRightWhile'

import { ROUTER_NAVIGATE } from '../constants/ActionTypes'
export const MOUNT_SET_ACTIONS = 'MOUNT_SET_ACTIONS'
export const MOUNT_REMOVE_ACTIONS = 'MOUNT_REMOVE_ACTIONS'

export const mount = function(state = null, action) {
  switch (action.type) {
    case MOUNT_SET_ACTIONS: {
      return action.actions
    }

    case MOUNT_REMOVE_ACTIONS: {
      return null
    }

    default:
      return state
  }
}

export const middleware = store => next => action => {
  if (process.browser) {
    if (action.type && action.type === ROUTER_NAVIGATE) {
      const autoclose = get(store.getState(), 'mount.autoclose')
      if (autoclose) {
        autoclose()
      }
    }

    return next(action)
  } else {
    return next(action)
  }
}

const TRANSITION_KEYS = [
  'transitionName',
  'transitionAppear',
  'transitionAppearTimeout',
  'transitionEnter',
  'transitionEnterTimeout',
  'transitionLeave',
  'transitionLeaveTimeout'
]

const DEFAULT_TRANSITION = {
  transitionEnter: true,
  transitionLeave: true,
  transitionName: 'modal',
  transitionEnterTimeout: 250,
  transitionLeaveTimeout: 250
}

import '../../styles/mount.scss'

export default class MountContainer extends Component {
  static contextTypes = {
    store: PropTypes.object
  }

  static childContextTypes = {
    mount: PropTypes.object
  }

  static defaultProps = {
    onMountChange: () => {}
  }

  state = {
    stack: [],
    mounted: {},
    transitionOptions: DEFAULT_TRANSITION
  }

  constructor(props) {
    super(props)

    this.push = this.push.bind(this)
    this.pop = this.pop.bind(this)
    this.autoclose = this.autoclose.bind(this)
    this._didMount = this._didMount.bind(this)
    this._renderStackItem = this._renderStackItem.bind(this)
  }

  getChildContext() {
    return {
      mount: {
        push: this.push,
        pop: this.pop
      }
    }
  }

  componentDidMount() {
    this.context.store.dispatch({
      type: MOUNT_SET_ACTIONS,
      actions: { push: this.push, pop: this.pop, autoclose: this.autoclose }
    })
  }

  componentWillUnmount() {
    this.context.store.dispatch({ type: MOUNT_REMOVE_ACTIONS })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.stack !== prevState.stack) {
      this.props.onMountChange(this.state.stack)
    }
  }

  render() {
    const isMounted = this.state.mounted[get(this.state, 'stack[0].key', null)] || false
    return (
      <section className={classnames('mount', this.props.className)}>
        <div ref="mobile" className="only-mobile" />
        <div className={classnames('mount__content', this.props.contentClassName, { 'is-mounted': isMounted })}>
          {this.props.children}
        </div>
        {/*<ReactCSSTransitionGroup {...this.state.transitionOptions}>*/}
        {this.state.stack.map(this._renderStackItem)}
        {/*</ReactCSSTransitionGroup>*/}
      </section>
    )
  }

  _renderStackItem(item, index) {
    const itemIndex = this.state.stack.indexOf(item)
    const isMounted = this.state.mounted[get(this.state, `stack[${itemIndex + 1}].key`, null)] || false
    return (
      <div className={classnames('mount__layer', { 'is-mounted': isMounted })} key={item.key}>
        {item.component}
      </div>
    )
  }

  push(component, options = {}) {
    return new Promise((resolve, reject) => {
      const componentNode = React.createElement(component, options.props)
      const transitionOptions = { ...DEFAULT_TRANSITION, ...pick(options, TRANSITION_KEYS) }

      const stack = this.state.stack.concat({
        autoclose: true,
        ...options,
        resolve,
        reject,
        scrollTop: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
        component: componentNode,
        key: uniqueId('mount-component-')
      })

      this.setState({ transitionOptions }, () => {
        this.setState({ stack }, () => {
          console.log('transitionOptions.transitionEnterTimeout', transitionOptions.transitionEnterTimeout)
          // if (transitionOptions.transitionEnter) {
          //   this._mountTimeout = setTimeout(this._didMount, transitionOptions.transitionEnterTimeout)
          // } else {
          this._didMount(stack)
          // }
        })
      })
    })
  }

  autoclose() {
    if (this.state.stack.length === 0) {
      return
    }

    let nextStack = dropRightWhile(this.state.stack, ['autoclose', true])
    if (nextStack.length === this.state.stack.length) {
      return
    }

    const resolvedItems = without(this.state.stack, nextStack)
    const nextMounted = omit(this.state.mounted, resolvedItems.map(item => item.key))
    const lastStackItem = this.state.stack[this.state.stack.length - 1]
    const leftResolvedItem = resolvedItems[0]

    const transitionOptions = { ...DEFAULT_TRANSITION, ...pick(lastStackItem, TRANSITION_KEYS) }

    this.setState({ stack: nextStack, mounted: nextMounted, transitionOptions }, () => {
      window.scrollTo(0, leftResolvedItem.scrollTop)

      resolvedItems.map(item => item.resolve())
    })
  }

  pop() {
    if (this.state.stack.length === 0) {
      return
    }
    clearTimeout(this._mountTimeout)

    const lastStackItem = this.state.stack[this.state.stack.length - 1]
    const mounted = omit(this.state.mounted, lastStackItem.key)
    const transitionOptions = { ...DEFAULT_TRANSITION, ...pick(lastStackItem, TRANSITION_KEYS) }

    const stack = this.state.stack.slice(0, -1)
    this.setState({ stack, transitionOptions, mounted }, () => {
      window.scrollTo(0, lastStackItem.scrollTop)
      lastStackItem.resolve()
    })
  }

  _didMount(stack = this.state.stack) {
    const lastStackItem = stack[stack.length - 1]
    if (!lastStackItem) {
      console.log('stack length', stack.length)
    }
    const mounted = { ...this.state.mounted, [lastStackItem.key]: true }

    this.setState({ mounted }, () => {
      const style = window.getComputedStyle(this.refs.mobile, null)
      if (style['display'] !== 'none') {
        window.scrollTo(0, 0)
      }
    })
  }
}
