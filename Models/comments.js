import mongoose from 'mongoose'
import Joi from 'joi'
import joiObjectId from 'joi-objectid'
Joi.objectId = joiObjectId(Joi)



const commentSchema = new mongoose.Schema({
    body: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 1024
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})


const Comments = mongoose.model('comment' , commentSchema);


const validateComment = (comment) => {
    
    const schema = Joi.object({
        body: Joi.string().min(1).max(1024).required()
    })
    return schema.validate(comment)
    
}

export {Comments , commentSchema, validateComment}




