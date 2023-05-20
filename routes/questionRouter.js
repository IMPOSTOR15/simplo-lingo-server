const Router = require('express')
const router = new Router()
const questionController = require('../controllers/questionController')

router.post('/', questionController.create)
router.post('/notsolved', questionController.getNotSolved)
router.get('/', questionController.getAll)
router.get('/randome', questionController.getRandome)
// router.get('/:dificult', questionController.getOneByDificult)
router.get('/:id', questionController.getOneById)



module.exports = router