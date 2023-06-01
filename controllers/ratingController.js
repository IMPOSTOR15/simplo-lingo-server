const {Rating, Question, Answer} = require('../models/models')
const ApiError = require('../error/ApiError')
const sequelize = require('../db')

class RatingController {
    async initialCreate(user_id) {
        try {
            await Rating.create({user_id, points: 0, total_solved: 0})
        } catch (e) {
            console.log('error in initial create');
        }
    }
    async updateRating(req, res, next) {
        const {user_id, earned_points, solved_qestion_count} = req.body
        try {
            // Находим запись рейтинга пользователя
            const rating = await Rating.findOne({ where: { user_id} });
    
            if (!rating) {
                console.log('No rating found for this user');
                return;
            }
            rating.points += earned_points;
            rating.total_solved += solved_qestion_count;
    
            // Сохраняем обновленную запись
            await rating.save();
            return res.json(rating)
    
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getUserRating(req, res) {
        let {user_id} = req.params
        console.log(user_id)
        const rating = await Rating.findOne({where: {user_id}})
        return res.json(rating)
    }

    async getCorrectAnswer(req, res, next) {
        let {qestion_id, answer_id, user_id} = req.body
        const currentQestion = await Question.findOne({where: {id: qestion_id}})
        const currentAnswer = await Answer.findOne({where: {id: answer_id}})
        const userRating = await Rating.findOne({where: {user_id}})
        if (answer_id === currentQestion.correct_answer_id && currentAnswer.is_correct) {
            userRating.total_solved = +userRating.total_solved + 1
            userRating.points = +userRating.points + +currentQestion.points
            userRating.save()
        }

        return res.json(userRating)
    }
}

module.exports = new RatingController()