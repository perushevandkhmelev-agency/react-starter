import { MISC_SET_LOCALE } from 'constants/ActionTypes'

export default (state = null, action) => {
  switch (action.type) {
    case MISC_SET_LOCALE:
      return action.locale

    default:
      return state
  }
}
