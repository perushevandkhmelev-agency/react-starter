import {
  MISC_SET_META,
  ROUTER_BEFORE_NAVIGATE
} from '../constants/ActionTypes'

import pickBy from 'lodash/pickBy'
import identity from 'lodash/identity'

export default function(state = {}, action) {
  switch (action.type) {

  case MISC_SET_META: {
    return {
      ...state,
      ...pickBy(action.data, identity)
    }
  }

  case ROUTER_BEFORE_NAVIGATE: {
    return {
      title: 'Project name',
      description: 'Project description',
      image: null
    }
  }

  default:
    return state
  }
}


