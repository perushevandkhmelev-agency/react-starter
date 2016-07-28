import {
  SYNC_TIME,
  MISC_SET_LOCALE,
  MISC_SET_META,
  MISC_SET_CONFIG
} from '../constants/ActionTypes'

import { CALL_API } from 'redux-api-middleware'
import * as api from '../utils/api'

export function syncTime() {
  return {
    type: SYNC_TIME,
    data: Date.now()
  }
}

export function setConfig(config) {
  return {
    type: MISC_SET_CONFIG,
    data: config
  }
}

export function setLocale(nextLocale, translations) {
  return (dispatch, getState) => {
    const { locale } = getState()
    if (locale !== nextLocale) {
      dispatch({
        type: MISC_SET_LOCALE,
        locale: nextLocale,
        translations: translations
      })
    }
  }
}

export function setMeta(meta) {
  return {
    type: MISC_SET_META,
    data: meta
  }
}
