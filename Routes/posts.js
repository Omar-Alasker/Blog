import express from 'express'
import auth from '../middleware/auth.js'
import {createPost, editPost, getAllPosts, findPost, deletePost , likePost , getMyPosts, getPostById} from '../Controllers/postController.js'

const router = express.Router()




router.get('/my-posts', auth, getMyPosts)    
router.get('/search', findPost)               
router.get('/:id', getPostById)              
router.post('/', auth, createPost)
router.put('/:id', auth, editPost)
router.put('/:id/like', auth, likePost)
router.delete('/:id', auth, deletePost)
router.get('/', getAllPosts)

export default router