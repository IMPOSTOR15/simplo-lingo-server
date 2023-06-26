const {Rating, Question, Answer, SolvedQuestion, User, Achievements, User_achievements} = require('../models/models')
const ApiError = require('../error/ApiError')
const { Sequelize } = require('sequelize');
const {checkAchivements} = require('../additionalFunctions/achivementsAdditionalFunctions');
const { addActivity } = require('./activityController');

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
            const rating = await Rating.findOne({ where: { user_id} });
    
            if (!rating) {
                console.log('No rating found for this user');
                return;
            }
            rating.points += earned_points;
            rating.total_solved += solved_qestion_count;
    
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
        let {type} = req.body
        if (type === "form") {
            try {
                let {qestion_id, answer_id, user_id} = req.body
                const currentQestion = await Question.findOne({where: {id: qestion_id}})
                const currentAnswer = await Answer.findOne({where: {id: answer_id}})
                const userRating = await Rating.findOne({where: {user_id}})
                
                if (answer_id === currentQestion.correct_answer_id && currentAnswer.is_correct) {
                    userRating.total_solved = +userRating.total_solved + 1
                    userRating.points = +userRating.points + +currentQestion.points
                    userRating.save()
                    SolvedQuestion.create(
                        {question_id: currentQestion.id, solved_by_user: user_id}
                    )
                    await addActivity(user_id)
                    
                    await checkAchivements(userRating)
    
                    return res.json({isCorrect: true})
                } else {
                    return res.json({isCorrect: false})
                }
    
            } catch (e) {
                console.log(e);
                next(ApiError.badRequest(e.message))
            }
        }
        if (type === "drag") {
            try {
                let {qestion_id, answers, user_id} = req.body
                const currentQestion = await Question.findOne({where: {id: qestion_id}})
                const currentAnswer = await Answer.findOne({where: {question_id: qestion_id, is_correct: true}})
                const userRating = await Rating.findOne({where: {user_id}})
                console.log("currentAnswer", currentAnswer.answer);
                // console.log("answers",answers);
                let userAnswersStr = ''
                for (let i = 0; i < answers.length; i++) {
                    userAnswersStr += answers[i].text + ', '
                }
                userAnswersStr = userAnswersStr.slice(0, -2)
                console.log(userAnswersStr);
                console.log(userAnswersStr === currentAnswer.answer);
                if (userAnswersStr === currentAnswer.answer) {
                    userRating.total_solved = +userRating.total_solved + 1
                    userRating.points = +userRating.points + +currentQestion.points
                    userRating.save()
                    SolvedQuestion.create(
                        {question_id: currentQestion.id, solved_by_user: user_id}
                    )
                    await addActivity(user_id)
                    
                    await checkAchivements(userRating)
    
                    return res.json({isCorrect: true})
                } else {
                    return res.json({isCorrect: false})
                }
            } catch (e) {
                console.log(e);
                next(ApiError.badRequest(e.message))
            }
        }
        
    }

    

    async getLeaderboardData(req, res, next) {
        try {
            const leaderboard = await User.findAll({
                attributes: ['name', 'avatar'],
                include: [{
                    model: Rating,
                    as: 'Rating',
                    required: true,
                    attributes: ['points', 'total_solved'],
                    where: {
                        points: {
                            [Sequelize.Op.gt]: 0
                        }
                    }
                }],
                order: [[{ model: Rating, as: 'Rating' }, 'points', 'DESC']],
                limit: 100
            });
            
            return res.json(leaderboard);
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new RatingController()