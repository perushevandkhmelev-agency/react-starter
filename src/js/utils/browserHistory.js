import { useRouterHistory } from 'react-router'
import { createHistory } from 'history'

const forceRefresh = /(iPhone|iPod|iPad).*AppleWebKit/i.test(window.navigator.userAgent)
const history = useRouterHistory(createHistory)({ forceRefresh })

export default history
