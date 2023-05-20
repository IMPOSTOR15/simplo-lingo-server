const {Rating} = require('../models/models')
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
}

module.exports = new RatingController()