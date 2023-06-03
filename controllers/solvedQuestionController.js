const { SolvedQuestion, Question} = require('../models/models')
const ApiError = require('../error/ApiError')
const sequelize = require('../db')
const { Op, where } = require('sequelize');

class solvedQuestionController {
    async getUserSolvedQestions(req, res, next) {
        const {user_id} = req.params
        const solvedByuserQestionsId = await SolvedQuestion.findAll({where: {solved_by_user: user_id}})
        // console.log(solvedByuserQestionsId);
        let ids = solvedByuserQestionsId.map(question => question.question_id);
        // console.log(ids);
        const solvedByuserQestion = await Question.findAll({where: {
            id: {
                [Op.in]: ids // Оператор IN для списка ID
              }
        }})
        return res.json(solvedByuserQestion)
    }
}

module.exports = new solvedQuestionController()