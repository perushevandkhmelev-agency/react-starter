import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import CSSModules from 'react-css-modules'
import classnames from 'classnames'
import get from 'lodash/get'
import uniqueId from 'lodash/uniqueId'
import pick from 'lodash/pick'
import omit from 'lodash/omit'
import without from 'lodash/without'
import findLast from 'lodash/findLast'
import dropRightWhile from 'lodash/dropRightWhile'
import { ROUTER_NAVIGATE } from '../constants/ActionTypes'

import styles from 'styles/mount.scss'
import modal from 'styles/modal.scss'

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

const TRANSITION_KEYS = ['classNames', 'appear', 'enter', 'exit', 'timeout']

const DEFAULT_TRANSITION = {
  enter: true,
  exit: true,
  classNames: {
    enter: modal['enter'],
    enterActive: modal['enter-active'],
    exit: modal['exit'],
    exitActive: modal['exit-active']
  },
  timeout: {
    enter: 250,
    exit: 250
  }
}

@CSSModules(styles)
export default class extends Component {
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
      actions: { push: this.push, pop: this.pop, autoclose: this.autoclose, next: this.next }
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
      <section className={classnames('max-height', this.props.className)}>
        <div ref="mobile" className="only-mobile" />
        <div
          className={classnames('max-height', this.props.contentClassName)}
          styleName={isMounted ? 'content-mounted' : null}>
          {this.props.children}
        </div>
        <TransitionGroup className={isMounted ? 'max-height' : null}>
          {this.state.stack.map(this._renderStackItem)}
        </TransitionGroup>
      </section>
    )
  }

  _renderStackItem = (item, index) => {
    const itemIndex = this.state.stack.indexOf(item)
    const isMounted = this.state.mounted[get(this.state, `stack[${itemIndex + 1}].key`, null)] || false
    return (
      <CSSTransition key={item.key} {...this.state.transitionOptions}>
        <div styleName={isMounted ? 'layer-mounted' : 'layer'}>{item.component}</div>
      </CSSTransition>
    )
  }

  push = (component, options = {}) => {
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
        this.setState({ stack })

        if (transitionOptions.timeout && transitionOptions.timeout.enter) {
          this._mountTimeout = setTimeout(this._didMount, transitionOptions.timeout.enter)
        } else {
          this._didMount(stack)
        }
      })
    })
  }

  autoclose = () => {
    if (this.state.stack.length === 0) {
      return
    }

    let nextStack = dropRightWhile(this.state.stack, 'autoclose', true)
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

  pop = () => {
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

  next = () => {
    if (this.state.stack.length > 0) {
      const lastStackWithNext = findLast(this.state.stack, item => 'next' in item)
      if (lastStackWithNext) {
        return lastStackWithNext.next
      }
    }
  }

  _didMount = (stack = this.state.stack) => {
    console.log('did mount')
    const lastStackItem = stack[stack.length - 1]
    const mounted = { ...this.state.mounted, [lastStackItem.key]: true }

    this.setState({ mounted }, () => {
      const style = window.getComputedStyle(this.refs.mobile, null)
      if (style['display'] !== 'none') {
        window.scrollTo(0, 0)
      }
    })
  }
}
