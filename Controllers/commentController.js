import {Comments , validateComment } from '../Models/comments.js'
import {Posts} from '../Models/posts.js'
import mongoose from 'mongoose'
import Joi from 'joi'


const createComment = async (req , res) => {
    const {error} = validateComment(req.body)
    if(error) return res.status(400).json({ message: error.details[0].message });

    try{
        const { body } = req.body
        const author = req.user._id
        const postId = req.params.postId

        const comment = new Comments({
            body,
            author,
            post: postId
        })

        await comment.save()

        await Posts.findByIdAndUpdate(postId, {
            $push: { comments: comment._id } // what is the difference between comment._id and commentId
        })
        res.status(201).send(comment)
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}

const editComment = async (req , res) => {
    const {error} = validateComment(req.body)
    if(error) return res.status(400).json({ message: error.details[0].message });

    try{
        const commentId = req.params.commentId
        const { body } = req.body

        const comment = await Comments.findByIdAndUpdate( commentId, 
            { body: body },
            { new: true }
        )

        if(!comment) return res.status(404).json({ message: 'comment not found!' })
        res.status(200).send(comment)
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }
}


const deleteComment = async (req , res) => {
    
    try{
        const { commentId , postId } = req.params
        

        const comment = await Comments.findByIdAndDelete(commentId)
        if(!comment) return res.status(404).json({ message: 'Comment not found!' })
        

        await Posts.findByIdAndUpdate(postId, {
            $pull: { comments: comment._id }
        })
        res.status(200).send('comment deleted')
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
}


export {createComment, editComment, deleteComment}