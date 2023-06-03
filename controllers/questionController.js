const {Question, SolvedQuestion} = require('../models/models')
const ApiError = require('../error/ApiError')
const sequelize = require('../db')
const { Op } = require('sequelize');

class QuestionController {
    async create(req, res, next) {
        try {
            const {title, type, text, points, dificult} = req.body
            const question = await Question.create({title, type, text, points, dificult})
            return res.json(question)

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    
    async getAll(req, res) {
        let {dificult} = req.query
        let questions
        if (dificult) {
            questions = await Question.findAndCountAll({where: {dificult}})
        } else {
            questions = await Question.findAll()
        }

        return res.json(questions)
    }

    async getAllWithSolvedMarker(req, res) {
        let {dificult, user_id} = req.body
        let questions 
        if (dificult) {
            questions = await Question.findAndCountAll({where: {dificult}})
        } else {
            questions = await Question.findAll()
        }

        const solvedByuserQestionsId = await SolvedQuestion.findAll({where: {solved_by_user: user_id}})

        let ids = solvedByuserQestionsId.map(question => question.question_id);

        questions = questions.map(question => {
            question.dataValues.solvedByUser = ids.includes(question.id);
            return question;
        });


        return res.json(questions)
    }
    async checkQuestionSolved(req, res, next) {
        let {user_id, question_id} = req.body
        const solvedByuserQestionsId = await SolvedQuestion.findAll({where: {solved_by_user: user_id}})
        let ids = solvedByuserQestionsId.map(question => question.question_id);

        if (ids.includes(question_id)) {
            return res.json({isSolved: true})
        } else {
            return res.json({isSolved: false})
        }
    }

    async getOneByDificult(req, res) {
        const {dificult} = req.params
        console.log(dificult);
        const question = await Question.findOne(
            {
                where: {dificult},
            }
        )
        return res.json(question)
    }
    async getOneById(req, res) {
        const {id} = req.params
        const question = await Question.findOne({ where: {id}}
        )
        return res.json(question)
    }
    async getNotSolved(req, res) {
        // const {user_id} = req.params
        const {user_id} = req.body
        const question = await Question.findOne({
            where: {
                id: {
                    [Op.notIn]: sequelize.literal(`(SELECT question_id FROM solved_question WHERE solved_by_user = ${user_id})`)
                }
            }
        })
        return res.json(question)
    }
    async getRandome(req, res) {
        const question = await Question.findOne({ 
            order: sequelize.random() 
          }
        );
        return res.json(question)
    }
}

module.exports = new QuestionController()