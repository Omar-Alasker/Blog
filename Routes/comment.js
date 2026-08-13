import express from 'express'
import {createComment, editComment, deleteComment} from '../Controllers/commentController.js'
import auth from '../middleware/auth.js'

const router = express.Router()


router.post('/:postId/comments' , auth , createComment)
router.put('/:postId/comments/:commentId' , auth , editComment)
router.delete('/:postId/comments/:commentId' , auth , deleteComment)


export default router