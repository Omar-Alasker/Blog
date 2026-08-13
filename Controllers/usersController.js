import _ from "lodash";
import bcrypt from "bcrypt";
import { Users, userSchema, validateUser } from "../Models/users.js";
import mongoose from "mongoose";
import Joi from "joi";


export const createUser = async (req, res) => {
  // joi validation code
  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // db validation
  try {
    const { name, surname, age, gender, email, password } = req.body;
    let newUser = await Users.findOne({ email: email });
    if (newUser) return res.status(400).send("User already registered");
    newUser = new Users({
      name,
      surname,
      age,
      gender,
      email,
      password,
    });

    
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(newUser.password, salt);
    await newUser.save();

    
    const token = newUser.generateAuthToken()
    res.header('x-auth-token' , token).send(_.pick(newUser, ["name", "surname", "email", "_id"]));

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
