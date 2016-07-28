import {
  SHOW_MODAL,
  HIDE_MODAL,
  ROUTER_BEFORE_NAVIGATE
} from '../constants/ActionTypes'

import uniqueId from 'lodash/uniqueId'

export default function modal(state = null, action) {
  switch (action.type) {
  case SHOW_MODAL: {
    return { uid: uniqueId('modal-'), ...action.payload }
  }

  case ROUTER_BEFORE_NAVIGATE:
  case HIDE_MODAL: {
    return null
  }

  default:
    return state
  }
}
