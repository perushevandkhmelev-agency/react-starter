export default {
  port: process.env.SERVER_PORT || 4000,
  apiUrl: process.env.API_URL || 'http://api.projectname',
  gaTrackingCode: process.env.GA_TRACKING_CODE || null,
  ymTrackingCode: process.env.YM_TRACKING_CODE || null
}
