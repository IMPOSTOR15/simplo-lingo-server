const {Activity_tracker} = require('../models/models')
const ApiError = require('../error/ApiError')
const sequelize = require('../db')
const { Op } = require('sequelize');
const uuid = require('uuid')
const path = require('path')
const resizeImage = require('../additionalFunctions/imgResizer');
const { claimAchivement } = require('../additionalFunctions/achivementsAdditionalFunctions');

class ActivityController {
    async addActivity(user_id) {
        const currentDate = new Date().setHours(0,0,0,0)
        if (await Activity_tracker.findOne({where: {date: {[Op.eq]: currentDate}}})) {
            console.log(Activity_tracker.findOne({where: {date: {[Op.eq]: currentDate}}}));
        } else {
            Activity_tracker.create({user_id, date:currentDate, total_solved: 0})
        }
    }
    async getUserActivity(req, res, next) {
        const {user_id, month_index} = req.body
        console.log("user_id", user_id);
        console.log("month_index", month_index);
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
            console.log("monthActivity", monthActivity);
            return res.json(monthActivity)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getAllAchivements(req, res) {

    }
    async getUserAchivements(req, res) {

    }
    async claimAchivementByUser(req, res, next) {

    }
    

}

module.exports = new ActivityController()