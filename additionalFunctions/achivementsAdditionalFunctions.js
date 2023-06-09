const { Achievements, User_achievements, Rating } = require("../models/models")

const checkAchivements = async (user_rating) => {
    try {
        const achivements = await Achievements.findAll()
        achivements.forEach(async (achivement) => {
            let conditionColumnName = achivement.condition.split(' ')[0]
            let conditionTerm = achivement.condition.split(' ')[1] === '>' &&  "more"
            let conditionQuantity = achivement.condition.split(' ')[2]
            if (conditionTerm === 'more') {
                if (user_rating[conditionColumnName] > conditionQuantity) {
                    await User_achievements.create({achievement_id: achivement.id, user_id: user_rating.user_id, isClaimed: false})
                }
            }
        })
    } catch (err) {
        console.log(err)
    }
}
const claimAchivement = async (achievement_id, user_id) => {
    try {
        const currentAchivement = await Achievements.findOne({where: {id: achievement_id}})
        const currentUserAchivement = await User_achievements.findOne({where: {achievement_id, user_id}})
        const currentUserRating = await Rating.findOne({where: {user_id}})
        currentUserRating.points = parseInt(currentUserRating.points) + parseInt(currentAchivement.pointsReward)
        currentUserRating.save()
        currentUserAchivement.isClaimed = true
        currentUserAchivement.save()
    } catch (err) {
        console.log(err);
    }
    
}
module.exports = {
    checkAchivements,
    claimAchivement
};