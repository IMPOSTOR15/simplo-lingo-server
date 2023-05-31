const {Question} = require('../models/models')
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