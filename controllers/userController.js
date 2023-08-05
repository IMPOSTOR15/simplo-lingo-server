const ApiError = require('../error/ApiError')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {User, Rating} = require('../models/models')
const uuid = require('uuid')
const path = require('path')
const resizeImage = require('../additionalFunctions/imgResizer');

const generateJwt = (id, email, role) => {
    return jwt.sign(
        {id, email, role},
        process.env.SECRET_KEY,
        {expiresIn: '24h'}
    )
}
class UserController {
    async getUserData(req, res, next) {
        const {id} = req.body
        try {
            const user = await User.findOne({where: {id}})
            return res.json({user})
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
        
    }
    async registration(req, res, next) {
        const {email, password, role} = req.body
        if (!email || !password) {
            return next(ApiError.badRequest('Не задан пароль или логин'))
        }
        const candidate = await User.findOne({where: {email}})
        if (candidate) {
            return next(ApiError.badRequest('Пользователь уже существует'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        const user = await User.create({email, role, password: hashPassword})
        const rating = await Rating.create({user_id: user.id})
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async login(req, res, next) {
        const {email, password, role} = req.body
        const user = await User.findOne({where: {email}})
        if (!user) {
            return next(ApiError.internal('Пользователь не найден'))
        }
        let comparePassword = bcrypt.compareSync(password, user.password)
        console.log(comparePassword);
        if (!comparePassword) {
            return next(ApiError.internal('Неверный пароль'))
        }
        const token = generateJwt(user.id, user.email, user.role)
        return res.json({token})
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role)
        return res.json({token})
    }
    
    async editUser(req, res, next) {
        try {
            const {id, name, email} = req.body
            const user = await User.findOne({ where: { id: id } });
            if (req.body.img !== "null") {
                const {img} = req.files
                let fileId = uuid.v4()
                let filename = fileId + '.jpg'
                let smallfilename = fileId + '-small.jpg'
                img.mv(path.resolve(__dirname, '..', 'static', filename))
                try {
                    await resizeImage(path.join(__dirname, '..', 'static', filename), path.join(__dirname, '..', 'static', smallfilename), 20)
                    console.log('Image resizing succeeded');
                } catch (err) {
                    console.error(`Error during image resizing: ${err}`);
                }
                user.avatar = filename;
            }

            if (name) {
                user.name = name
            }

            if (email) {
                user.email = email
            }

            await user.save();
            return res.json({ message: 'correct' });
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
    async changePassword(req, res, next) {
        try {
            const { id, password } = req.body
            const hashPassword = await bcrypt.hash(password, 5)
            const user = await User.update({ password: hashPassword }, { where: { id: id } })

            if (user[0] === 0) {
                return next(ApiError.badRequest("Пользователь не найден"));
            }

            const token = generateJwt(user.id, user.email, user.role)
            return res.json({token})
            
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new UserController()