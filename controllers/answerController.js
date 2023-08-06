const {Answer, Question, SolvedQuestion} = require('../models/models')
const ApiError = require('../error/ApiError')

class AnswerController {
    async addAnswers(req, res, next) {
        try {
            const {question_id, answersArr} = req.body
            let completeAnswersArr = []
            await pushAnswers(question_id, answersArr)
            return res.json(completeAnswersArr)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async pushAnswers(question_id, answersArr) {
        answersArr.map(async (elem) => {
            await Answer.create({question_id, answer: elem.text, is_correct: elem.isCorrect})
        })
        return await Answer.findOne({where: {is_correct: true, question_id}})
    }
    async pushAnswersDrag(question_id, answersArr) {
        await Answer.create({question_id, answer: answersArr[0].questionDragAllText, is_correct: false})
        await Answer.create({question_id, answer: answersArr[0].questionDragCorrectText, is_correct: true})
        return await Answer.findOne({where: {is_correct: true, question_id}})
    }
    async getAnswers(req, res) {
        let {question_id} = req.params
        const currentQestion = await Question.findOne({where: {id: question_id}})
        if (currentQestion) {
            if (currentQestion.type === "drag") {
                var answers = await Answer.findAll({attributes: ["id", "answer"], where: {question_id, is_correct: false}})
                return res.json({answers: answers, type: currentQestion.type})
            } 
            if (currentQestion.type === "form") {
                var answers = await Answer.findAll({attributes: ["id", "answer"], where: {question_id}})
                return res.json({answers: answers, type: currentQestion.type})
            }
        } else {
            return res.json("no answer")
        }
    }

    async getCorrectAnswers(req, res) {
        try {
            let {question_id, user_id} = req.body
            const currentQestion = await Question.findOne({where: {id: question_id}})
            const isQestionSolvedByUser = await SolvedQuestion.findOne({where: {question_id, solved_by_user: user_id}})
            if (currentQestion && isQestionSolvedByUser) {
                if (currentQestion.type === "drag") {
                    var answers = await Answer.findAll({where: {question_id, is_correct: true}})
                    return res.json({answers: answers, type: currentQestion.type})
                } 
                if (currentQestion.type === "form") {
                    var answers = await Answer.findAll({
                        attributes: ["id", "answer", "is_correct"],
                        where: {question_id}
                    })
                    return res.json({answers: answers, type: currentQestion.type})
                }
            } else {
                return res.json("no solved")
            }
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
        
        
    }
    

}

module.exports = new AnswerController()