import {User} from "../models/user.model.js";
import { generateAccessToken, generateRefreshToken } from "../utilits/token.js";


const registerUser = async (req, res) =>{
    try {
        const {username, email, password} = req.body;

        //basic validation
        if(!username|| !email || !password){
            return res.status(400).json({message: "All field are important!"})

        }

        //check if user already exists

        const existing = await User.findOne({email:email.toLowerCase()});
        if(existing){
            return res.status(400).json({message: "User already exists!"});
        }


        //create user

        const user = await User.create({ 
            username,
            email: email.toLowerCase(),
            password,
            loggedIn: false,
        });

        res.status(201).json({
            message: "User registered successfully", 
            user: {id:user._id, username:user.username, email:user.email}
        });
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
};

const loginUser = async (req, res)=>{
     try {
        
        //check if user exists

    const {email, password} = req.body;
    const user = await User.findOne({
        email: email.toLowerCase()

    });

    if(!user){
        return res.status(400).json({message: "Invalid email or password"});
    }

//compare password
    const isMatch = await user.comparePassword(password);
    if(!isMatch) return res.status(400).json({
        message: "Invalid email or password"
    });

    //generate tokens
   const accessToken = generateAccessToken(user);
   const refreshToken = generateRefreshToken(user);

   user.refreshToken=refreshToken;
   await user.save();


    res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
        
        user: {
            id:user._id, 
            email:user.email,
            username:user.username
            
        }

    });

     } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
     }
}

const logoutUser = async (req, res) =>{
    try {
        const {email} = req.body;
        const user = await User.findOne({
            email
        })

        if(!user) return res.status(400).json({
             message: "User not found"
        });

        res.status(200).json({
            message: "Logout successful"
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
}
export {
    registerUser,
    loginUser,
    logoutUser

}