import express from 'express'
import {authUser} from '../Controllers/authController.js'


const router = express.Router()



router.post('/' , authUser)


export default router