import mongoose from 'mongoose'
import Joi from 'joi'
import joiObjectId from 'joi-objectid'
Joi.objectId = joiObjectId(Joi)


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    body: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 1024
    },
    image: String,
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comment',
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
})


const Posts = mongoose.model('post' , postSchema)


const validatePost = (post) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        body: Joi.string().min(10).max(1024).required(),
        image: Joi.string(),
    })
    return schema.validate(post)
}


export {Posts , postSchema , validatePost}