import { SYNC_TIME, MISC_SET_LOCALE, MISC_SET_CONFIG } from 'constants/ActionTypes'

export const syncTime = () => ({
  type: SYNC_TIME,
  data: Date.now()
})

export const setConfig = config => ({
  type: MISC_SET_CONFIG,
  data: config
})

export const setLocale = (nextLocale, translations) => {
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
