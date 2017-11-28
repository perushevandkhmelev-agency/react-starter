export default [
  {
    path: '/',
    exact: true,
    component: require('routes/Static/components/Main'),
    routes: []
  },
  {
    path: '/test',
    component: require('routes/Static/components/Test')
  }
]
