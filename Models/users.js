import mongoose from 'mongoose'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import config from 'config'


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        maxLength: 25,
        required: true
    },
    surname: {
        type: String,
        minLength: 3,
        maxLength: 25,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        minLength: 5,
        maxLength: 255,
        required: true,
        unique: true
    },
    password: {
        type: String,
        minLength: 5,
        maxLength: 1024,
        required: true,
    }
})

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id} , config.get('jwtPrivateKey'))
    return token
}

const Users = mongoose.model('user' , userSchema)





const validateUser = (user) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(25).required(),
        surname: Joi.string().min(3).max(25).required(),
        age: Joi.number().required(),
        gender: Joi.string().required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    })

    return schema.validate(user)
}


export {Users , userSchema, validateUser}