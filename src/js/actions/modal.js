import {
  SHOW_MODAL,
  HIDE_MODAL
} from '../constants/ActionTypes'

export function showModal(component, props) {
  return {
    type: SHOW_MODAL,
    payload: { component, props }
  }
}

export function hideModal() {
  return {
    type: HIDE_MODAL
  }
}
