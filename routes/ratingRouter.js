const Router = require('express')
const router = new Router()
const ratingController = require('../controllers/ratingController')

// router.post('/', questionController.create)
// router.post('/notsolved', questionController.getNotSolved)
// router.get('/', questionController.getAll)
// router.get('/randome', ratingController.getRandome)
// // router.get('/:dificult', questionController.getOneByDificult)
router.get('/:user_id', ratingController.getUserRating)
router.post('/update_rating', ratingController.updateRating)



module.exports = router