const Router = require('express')
const router = new Router()
const ratingController = require('../controllers/ratingController')

router.get('/leaderbord', ratingController.getLeaderboardData)
router.get('/user/:user_id', ratingController.getUserRating)

router.post('/update_rating', ratingController.updateRating)
router.post('/get_answer', ratingController.getCorrectAnswer)

module.exports = router