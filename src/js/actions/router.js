import {
  ROUTER_BEFORE_NAVIGATE,
  ROUTER_NAVIGATE,
  ROUTER_ERROR_RAISE
} from '../constants/ActionTypes'

export function beforeNavigate(state, initial) {
  return {
    type: ROUTER_BEFORE_NAVIGATE,
    state: state,
    initial: initial
  }
}

export function navigate(state) {
  return {
    type: ROUTER_NAVIGATE,
    state: state
  }
}

export function raiseError(errorCode) {
  return {
    type: ROUTER_ERROR_RAISE,
    errorCode: errorCode
  }
}
