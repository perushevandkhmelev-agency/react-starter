import { ROUTER_BEFORE_NAVIGATE, ROUTER_NAVIGATE, ROUTER_ERROR_RAISE } from 'constants/ActionTypes'

export const beforeNavigate = (state, initial) => ({
  type: ROUTER_BEFORE_NAVIGATE,
  state: state,
  initial: initial
})

export const navigate = state => ({
  type: ROUTER_NAVIGATE,
  state: state
})

export const raiseError = errorCode => ({
  type: ROUTER_ERROR_RAISE,
  errorCode: errorCode
})
