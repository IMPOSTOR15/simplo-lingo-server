const {Answer} = require('../models/models')
const ApiError = require('../error/ApiError')
const sequelize = require('../db')
const { Op } = require('sequelize');

class AnswerController {
    async addAnswers(req, res, next) {
        try {
            const {question_id, AnswersObj} = req.body
            let answersArr = []
            for (var key in AnswersObj) {
                answersArr.push(await Answer.create({question_id, answer: AnswersObj[key]}))
            }   
            
            return res.json(answersArr)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getAnswers(req, res) {
        let {question_id} = req.params
        console.log(question_id)
        const answers = await Answer.findAll({where: {question_id}})
        return res.json(answers)
    }
    

}

module.exports = new AnswerController()