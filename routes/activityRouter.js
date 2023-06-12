const Router = require('express')
const router = new Router()
const activityController = require('../controllers/activityController')

router.post('/get_user_activity', activityController.getUserActivity)



module.exports = router