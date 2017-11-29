import {
  MISC_SET_CONFIG
} from '../constants/ActionTypes'

export default function(state = {}, action) {
  switch (action.type) {

  case MISC_SET_CONFIG: {
    return {
      ...state,
      ...action.data
    }
  }

  default:
    return state
  }
}
