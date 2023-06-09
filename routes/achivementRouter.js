const Router = require('express')
const router = new Router()
const achivementController = require('../controllers/achivementController')

router.get('/all', achivementController.getAllAchivements)
router.get('/user/:user_id', achivementController.getUserAchivements)

router.post('/add_achivement', achivementController.addAchivement)
router.post('/claim', achivementController.claimAchivementByUser)


module.exports = router