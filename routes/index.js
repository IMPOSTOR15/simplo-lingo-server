const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const answerRouter = require('./answerRouter')
const questionRouter = require("./questionRouter")
const solvedQuestionRouter = require('./solvedQuestionRouter')
const ratingRouter = require('./ratingRouter')
const achivementRouter = require('./achivementRouter')
const activityRouter = require('./activityRouter')
router.use('/user', userRouter)
router.use('/question', questionRouter)
router.use('/rating', ratingRouter)
router.use('/answer', answerRouter)
router.use('/solved_question', solvedQuestionRouter)
router.use('/achivements', achivementRouter)
router.use('/activity', activityRouter)


module.exports = router