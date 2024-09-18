import User from "../models/User.js";
import jwt from "jsonwebtoken";
import StatusCode from "http-status-codes";
import dotenv from "dotenv";

dotenv.config();

const register = async (req, res) => {
    const {email, password} = req.body;

    try{
        let user = await User.findOne({email});
        if(user){
            return res.status(StatusCode.BAD_REQUEST).json({message: "User already exists."});
        }

        user = new User({email, password});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1h"});

        res.status(StatusCode.CREATED).json({token, message: "User registered successfully."});
    }catch(error){
        console.log(req.body);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({message: "Server error."});
    }
}

const logIn = async (req, res) => {
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email});
        if(!user){
            return res.status(StatusCode.NOT_FOUND).json({message: "Invalid credentials."});
        }

        const isCorrectPassword = await user.comparePassword(password);
        if(!isCorrectPassword){
            return res.status(StatusCode.NOT_FOUND).json({message: "Invalid credentials."});
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1m"});

        res.status(StatusCode.OK).json({token, message: "Successfull login."});
    }catch(error){
        console.log(req.body);
        res.status(StatusCode.INTERNAL_SERVER_ERROR).json({message: "Server error."});
    }
}

export {register, logIn};