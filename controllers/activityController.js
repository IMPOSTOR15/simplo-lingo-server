const {Activity_tracker} = require('../models/models')
const ApiError = require('../error/ApiError')
const { Op } = require('sequelize');


class ActivityController {
    async addActivity(user_id) {
        const currentDate = new Date().setHours(0,0,0,0)
        const userActivity = await Activity_tracker.findOne({where: {date: {[Op.eq]: currentDate}, user_id}})
        if (userActivity) {
            userActivity.total_solved = parseInt(userActivity.total_solved) + 1
            userActivity.save()
        } else {
            Activity_tracker.create({user_id, date:currentDate, total_solved: 1})
        }
    }

    async getUserActivity(req, res, next) {
        const {user_id, month_index} = req.body
        var date = new Date();
        date.setHours(0,0,0,0);
        if (month_index) {
            date.setMonth(month_index);
        }
        var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        var firstDayOfNextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

        try {
            const monthActivity = await Activity_tracker.findAll({
                attributes: ['date', 'total_solved'],
                where: {
                    date: {
                        [Op.gte]: firstDayOfMonth,
                        [Op.lt]: firstDayOfNextMonth
                    },
                    user_id
                }
            })
            return res.json(monthActivity)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new ActivityController()