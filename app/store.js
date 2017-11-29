import { createStore, combineReducers, applyMiddleware } from 'redux'
import { apiMiddleware } from 'redux-api-middleware'
import thunkMiddleware from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import { middleware as mountMiddleware } from 'components/Mount'
import * as reducers from 'reducers'

const reducer = combineReducers(reducers)
const createStoreWithMiddleware = applyMiddleware(thunkMiddleware, apiMiddleware, mountMiddleware, promiseMiddleware())(
  createStore
)

export default function(initialState) {
  return createStoreWithMiddleware(reducer, initialState)
}
