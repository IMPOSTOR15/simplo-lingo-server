const {Question, SolvedQuestion} = require('../models/models')
const ApiError = require('../error/ApiError')
const sequelize = require('../db')
const { Op } = require('sequelize');
const { pushAnswers, pushAnswersDrag } = require('./answerController');

class QuestionController {
    async create(req, res, next) {
        try {
            console.log(req.body);
            const {title, type, text, points, dificult, theme, answersArr} = req.body.questionData
            let question = await Question.create({title, type, text, points, dificult, correct_answer_id: null, theme})
            let correctAnswer;
            if (type === 'form') {
                if (answersArr) {
                    correctAnswer = await pushAnswers(question.id, answersArr)
                    question = await question.update({ correct_answer_id: correctAnswer.id });
                }
            }
            if (type === 'drag') {
                if (answersArr) {
                    correctAnswer = await pushAnswersDrag(question.id, answersArr)
                    question = await question.update({ correct_answer_id: correctAnswer.id });
                }
            }
            return res.json(question)
        } catch (e) {
            console.log(e);
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

    async getAllWithSolvedMarkerAndThemeBySort(req, res) {
        let {dificult, theme, user_id, limit = 20, page = 1} = req.body
        console.log(req.body);
        let offset = (page - 1) * limit;
    
        let conditions = {};
        if (dificult) conditions.dificult = dificult;
        if (theme) conditions.theme = theme;
    
        let questions = await Question.findAndCountAll({where: conditions, limit, offset, order: [
            ['id', 'ASC']
          ]})
        
        console.log("questions", questions);
        const solvedByuserQestionsId = await SolvedQuestion.findAll({where: {solved_by_user: user_id}})
    
        let ids = solvedByuserQestionsId.map(question => question.question_id);
    
        questions.rows = questions.rows.map(question => {
            question.dataValues.solvedByUser = ids.includes(question.id);
            return question;
        });
    
        return res.set('X-Total-Count', questions.count).json(questions)
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
        const question = await Question.findOne(
            {
                where: {dificult},
            }
        )
        return res.json(question)
    }
    async getOneById(req, res) {
        const {id} = req.params
        const question = await Question.findOne({ where: {id}})
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