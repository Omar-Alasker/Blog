import { Users } from "../Models/users.js";
import mongoose from "mongoose";
import Joi from "joi";
import bcrypt from 'bcrypt';
import _ from 'lodash'  // ← add this!


const authUser = async (req , res) => {
    //validating using Joi
    const {error} = validateAuth(req.body)
    if (error) return res.status(400).json({ message: error.details[0].message });

    //now db validation
    try{
        const { email , password } = req.body
        let registeredUser = await Users.findOne({email: email})
        if(!registeredUser) return res.status(400).send('Invalid email or password!')

        const validPassword = await bcrypt.compare(password, registeredUser.password)
        if(!validPassword) return res.status(400).send('Invalid email or password!')
        
        const token = registeredUser.generateAuthToken()
        res.json({ 
            token,
            user: _.pick(registeredUser, ['_id', 'name', 'surname', 'email'])
        })
    }
    catch(err){
        res.status(500).json({ message: err.message });
    }

}


const validateAuth = (req) => {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    })

    return schema.validate(req)
}

export {authUser, validateAuth}
