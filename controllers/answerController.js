const {Answer, Question, SolvedQuestion} = require('../models/models')
const ApiError = require('../error/ApiError')

class AnswerController {
    async addAnswers(req, res, next) {
        try {
            const {question_id, AnswersObj} = req.body
            let answersArr = []
            for (var key in AnswersObj) {
                answersArr.push(await Answer.create({question_id, answer: AnswersObj[key], is_correct: false}))
            }   
            return res.json(answersArr)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
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