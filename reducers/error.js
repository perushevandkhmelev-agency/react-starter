import { ROUTER_BEFORE_NAVIGATE, ROUTER_NAVIGATE, ROUTER_ERROR_RAISE, ROUTER_REJECTED } from 'constants/ActionTypes'

export default function(state = {}, action) {
  switch (action.type) {
    case ROUTER_BEFORE_NAVIGATE: {
      if (action.initial) {
        return state
      }

      return { ...state, nextCode: null }
    }

    case ROUTER_ERROR_RAISE: {
      if (state.nextCode) {
        return state
      }

      return { ...state, nextCode: action.errorCode }
    }

    case ROUTER_REJECTED: {
      if (state.nextCode) {
        return state
      }

      return { ...state, nextCode: action.payload.code || action.payload.status || 404 }
    }

    case ROUTER_NAVIGATE: {
      return { ...state, code: state.nextCode }
    }

    default: {
      return state
    }
  }
}
