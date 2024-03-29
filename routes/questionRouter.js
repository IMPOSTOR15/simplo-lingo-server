const Router = require('express')
const router = new Router()
const questionController = require('../controllers/questionController')


router.post('/', questionController.create)
router.post('/notsolved', questionController.getNotSolved)
router.post('/solved_theme_filter', questionController.getAllWithSolvedMarkerAndThemeBySort)
router.post('/check_solved', questionController.checkQuestionSolved)

router.get('/randome', questionController.getRandome)
router.get('/dificult/:dificult', questionController.getOneByDificult)
router.get('/id/:id', questionController.getOneById)
router.get('/', questionController.getAll)



module.exports = router