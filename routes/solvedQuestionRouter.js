const Router = require('express')
const router = new Router()
const solvedQuestionController = require('../controllers/solvedQuestionController')

router.get('/:user_id', solvedQuestionController.getUserSolvedQestions)
// router.post('/update_rating', solvedQuestionController.updateRating)
// router.post('/get_answer', solvedQuestionController.getCorrectAnswer)

module.exports = router