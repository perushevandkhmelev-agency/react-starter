import { SYNC_TIME, SYNC_RESPONSE_TIME } from 'constants/ActionTypes'

export default (state = {}, action) => {
  switch (action.type) {
    case SYNC_TIME:
      return { ...state, render: action.data }

    case SYNC_RESPONSE_TIME:
      return { ...state, response: action.data }

    default:
      return state
  }
}
