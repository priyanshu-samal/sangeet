import mongoose from 'mongoose';



const userSchema = new mongoose.Schema({
 
    email:{
        type: String,
        required: true,
        unique: true,
    },
    fullname:{
        firstName:{
            type: String,
            required: true,
        },
        lastName:{
            type: String,
            required: true,
        }
    },
    password:{
        type: String,
        required: true,
    
    },
    googleId:{
        type: String,
    }

})