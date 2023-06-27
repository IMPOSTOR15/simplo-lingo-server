const Router = require('express')
const router = new Router()
const answerController = require('../controllers/answerController')

router.post('/add_answers', answerController.addAnswers)
router.get('/:question_id', answerController.getAnswers)
router.post('/correct_answers', answerController.getCorrectAnswers)

module.exports = router