import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import _config from "../config/config.js";
import { publishToQueue } from "../broker/rabbit.js";


export async function register(req, res) {
    const {email, password,fullname:{firstname,lastname}} = req.body;

    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            email,
            password: hashedPassword,
            fullname: { firstname, lastname }
        });

        const token= jwt.sign({id:user._id,role:user.role},_config.JWT_SECRET,{expiresIn:'2d'});
        res.cookie('token', token, { httpOnly: true });
                await publishToQueue('user_registration', JSON.stringify({
            id:user._id,
            email:user.email,
            fullname:user.fullname,
            role:user.role
        }));

        res.status(201).json({ message: "User registered successfully",user });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });

    }

}

export async function googleAuthCallback(req, res) {
    const user = req.user;
    
    const isUserExists = await userModel.findOne({ 
        $or:[
            {email:user.emails[0].value},
            {googleId:user.id}
        
        ]
     });
     
    if (isUserExists) {
        const token= jwt.sign({
            id:isUserExists._id,
            role:isUserExists.role},_config.JWT_SECRET,{expiresIn:'2d'});
        res.cookie('token', token, { httpOnly: true });
        res.status(200).json({ message: "Google authentication successful", user: isUserExists });
    } else {
        res.status(404).json({ message: "User not found" });
    }

    const newUser=await userModel.create({
        email:user.emails[0].value,
        googleId:user.id,
        fullname:{
            firstname:user.name.givenName,
            lastname:user.name.familyName
        }
    })
 
    await publishToQueue('user_registration', JSON.stringify({
        id:newUser._id,
        email:newUser.email,
        fullname:newUser.fullname,
        role:newUser.role
    }));
    
    const token= jwt.sign({id:newUser._id,role:newUser.role},_config.JWT_SECRET,{expiresIn:'2d'});
    res.cookie('token', token, { httpOnly: true });
    res.status(201).json({ message: "Google authentication successful", user: newUser });
}
