const {Achievements, User_achievements} = require('../models/models')
const ApiError = require('../error/ApiError')
const sequelize = require('../db')
const { Op } = require('sequelize');
const uuid = require('uuid')
const path = require('path')
const resizeImage = require('../additionalFunctions/imgResizer');
const { claimAchivement } = require('../additionalFunctions/achivementsAdditionalFunctions');

class AchivementController {
    async addAchivement(req, res, next) {
        try {
            const {name, rare, reward } = req.body
            let filename, fileId, smallfilename
            if (req.body.img !== "null") {
                const {img} = req.files
                fileId = uuid.v4() + name
                filename = fileId + '.jpg'
                smallfilename = fileId + '-small.jpg'
                img.mv(path.resolve(__dirname, '..', 'static', filename))
                try {
                    await resizeImage(path.join(__dirname, '..', 'static', filename), path.join(__dirname, '..', 'static', smallfilename), 20)
                    console.log('Image resizing succeeded');
                } catch (err) {
                    console.error(`Error during image resizing: ${err}`);
                }
                const achivement = await Achievements.create({name, rare, photo: filename, pointsReward: reward})
                return res.json(achivement)
            } else {
                return res.json('No img')
            }

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async getAllAchivements(req, res) {
        const answers = await Achievements.findAll()
        return res.json(answers)
    }
    async getUserAchivements(req, res) {
        const {user_id} = req.params
        const userAchivements =  await User_achievements.findAll({
            attributes: ['achievement_id', 'isClaimed'],
            where: {user_id}
        })
    
        return res.json(userAchivements)
    }
    async claimAchivementByUser(req, res, next) {
        try {
            const {user_id, achivement_id} = req.body
            await claimAchivement(achivement_id, user_id)
            return res.json('succesfuly')
        } catch (err) {
            return res.json(err)
        }
    }
    

}

module.exports = new AchivementController()