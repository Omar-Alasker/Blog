import mongoose from 'mongoose'
import Joi from 'joi'
import {Posts, validatePost} from '../Models/posts.js'
import _ from "lodash";


const createPost = async (req , res) => {
    const { error } = validatePost(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try{
        const {title, body, image} = req.body
        const author = req.user._id 
        let newPost = new Posts({
            title,
            body,
            image,
            author
        })

        await newPost.save()
        console.log('req.user:', req.user)  
        console.log('author:', req.user._id)  
        res.status(201).send(_.pick(newPost, ['title' , 'body' , 'image' , 'author' , '_id']))
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
}

const getMyPosts = async (req, res) => {
    try{
        const currentUser = req.user._id
        const currentUserPosts = await Posts.find({author: currentUser})
            .populate('author' , '-password')
            .sort({ createdAt: -1 })

        res.status(200).json(currentUserPosts)
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
}

const findPost = async (req , res) => {
    try{
        const { title } = req.query
        const wantedPost = await Posts.find({
            title: {$regex: title , $options: 'i'}})
            .populate('author')
            .populate('comments')
            .sort({ createdAt: -1 })
            .limit(10)
        if(!wantedPost) return res.status(404).send('no such post')
        
        res.status(200).send(wantedPost)
    } 
    catch(err){
        res.status(500).json({ message: err.message })
    }
}

const getPostById = async (req, res) => {
    try {
        const id = req.params.id
        const post = await Posts.findById(id)
            .populate('author', '-password')
            .populate({
                path: 'comments',
                populate: {
                    path: 'author',
                    select: 'name surname'
                }
            })
        if(!post) return res.status(404).json({ message: 'Post not found!' })
        res.status(200).json(post)
    }
    catch(err) {
        res.status(500).json({ message: err.message })
    }
}



const getAllPosts = async (req , res) => {
    try{
        const result = await Posts.find().populate('author', '-password')
        res.status(200).send(result)
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
}

const editPost = async (req , res) => {

    const {error} = validatePost(req.body)
    if (error) return res.status(400).json({ message: error.details[0].message });

    try{
        const id = req.params.id
        const {title , body, image} = req.body
        const updatedPost = await Posts.findByIdAndUpdate(id, 
            {title: title , body: body, image: image},
            {new: true} 
        )
        if(!updatedPost) return res.status(404).json({ message: 'Post not found!' })
        res.status(200).send(updatedPost)
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
}

const deletePost = async (req , res) => {
    try{
        const id = req.params.id
        const deletedPost = await Posts.findByIdAndDelete(id)
        if(!deletedPost) return res.status(404).json({ message: 'Post not found!' })
        res.status(200).send('post deleted')
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
}


const likePost = async (req , res) => {
    try{
        const id = req.params.id
        const post = await Posts.findById(id)
        if(!post) return res.status(404).json({ message: 'Post not found!' })

        const liked = post.likes.includes(req.user._id)
        if(liked) {
           post.likes.pull(req.user._id)
        }
        else {
           post.likes.push(req.user._id)
        }

        await post.save()
        res.status(200).json({ likes: post.likes.length, post})
    }
    catch(err){
        res.status(500).json({ message: err.message })
    }
}

export {createPost, findPost, getAllPosts, editPost, deletePost , likePost , getMyPosts, getPostById}