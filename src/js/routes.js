export default (store) => ({
  component: require('./components/Root'),
  getChildRoutes: (location, callback) => {
    let routes = []

    routes = routes.concat(
      require('./routes/Static')
    )

    callback(null, routes)
  }
})

