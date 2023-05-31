const Router = require('express')
const router = new Router()
const questionController = require('../controllers/questionController')

router.post('/', questionController.create)
router.post('/notsolved', questionController.getNotSolved)

router.get('/randome', questionController.getRandome)
router.get('/dificult/:dificult', questionController.getOneByDificult)
router.get('/id/:id', questionController.getOneById)
router.get('/', questionController.getAll)


module.exports = router