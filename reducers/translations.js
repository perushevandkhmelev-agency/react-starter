import { MISC_SET_LOCALE } from 'constants/ActionTypes'

export default function(state = null, action) {
  switch (action.type) {
    case MISC_SET_LOCALE: {
      return action.translations && action.translations[action.locale] ? action.translations[action.locale] : {}
    }

    default: {
      return state
    }
  }
}
