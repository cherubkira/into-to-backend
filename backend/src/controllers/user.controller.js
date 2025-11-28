import {User} from "../models/user.model.js";


const registerUser = async (req, res) =>{
    try {
        const {username, email, password} = req.body;

        //basic validation
        if(!username|| !email || !password){
            return res.status(400).json({message: "All field are important!"})

        }

        //check if user already exists

        const existing = await User.findOne({email:toLowerCase()});
        if(existing){
            return res.status(400).json({message: "User already exists!"});
        }


        //create user

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password,
            loggedIn: false,
        })
    } catch (error) {
        res.status(500).json({message: "Server error", error: error.message});
    }
}