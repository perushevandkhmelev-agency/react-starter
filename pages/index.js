export default store => [
  {
    component: require('components/Root'),
    routes: [
      {
        path: '/',
        exact: true,
        component: require('./Main'),
        routes: []
      },
      {
        path: '/test',
        component: require('./Test')
      },
      {
        path: '*',
        component: require('components/ErrorPage')
      }
    ]
  }
]
