const Router = require('express')
const router = new Router()
const UserController = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/getuserdata', UserController.getUserData)
router.post('/registration', UserController.registration)
router.post('/login', UserController.login)
router.get('/auth', authMiddleware, UserController.check)
router.post('/edituser', UserController.editUser)
router.post('/changepassword', UserController.changePassword)

module.exports = router