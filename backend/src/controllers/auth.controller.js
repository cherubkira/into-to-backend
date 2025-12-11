    import jwt from 'jsonwebtoken';
    import {User} from "../models/user.model.js";
    import { generateAccessToken, generateRefreshToken } from "../utilits/token.js";


    export const refreshAccessToken = async (req,res)=>{
        try {
            const {refreshToken} = req.body;
            if(!refreshToken){
                return res.status(400).json({
                    message: "Refresh token is required"
                });
            }
            //verify refresh token

            const user = await User.findOne({
                refreshToken
            })
            if(!user){
                return res.status(400).json({
                    message: "Invalid refresh token"
                });
            }

            jwt.verify(refreshToken, process.env.JWT.REFRESH_SECRET);
            
            const accessToken = generateAccessToken(user);

            res.json({
                accessToken
            });
        } catch (error) {
            res.status(500).json({
                message: "invalid or expired refresh token"
            });
        }
    }