export default store => [
  {
    component: require('./components/Root'),
    routes: [].concat(require('./routes/Static'))
  }
]
