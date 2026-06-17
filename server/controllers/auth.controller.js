import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from "../utils/genToken.js";

const Signup = async (req, res) => {
	try {
		const { name, email, password } = req.body || {};
		if (!name || !email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const emailExist = await User.findOne({ email });
        console.log("emailExist🟡-->>",emailExist);
        
		if (emailExist) {
			return res
				.status(409)
				.json({ success: false, message: "Email already registered" });
		}

		const hashedPassword = await bcrypt.hash(password, 12);
		console.log("hashedPassword🟡-->>", hashedPassword);

		await User.create({ name, email, password: hashedPassword });
		res.status(201).json({
			success: true,
			message: "User created successfully",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const Login = async (req, res) => {
	try {
		const { email, password } = req.body || {};
		if (!email || !password) {
			return res
				.status(400)
				.json({ success: false, message: "All fields are required" });
		}
		const user = await User.findOne({ email });
        console.log("user🟡-->>", user);
		if (!user) {
			return res
				.status(401)
				.json({ success: false, message: "Wrong credentials" });
		}

		const verifyPassword = await bcrypt.compare(password, user.password);
		console.log("verifyPassword🟡-->>", verifyPassword);

		if (!verifyPassword) {
			return res
				.status(401)
				.json({ success: false, message: "Wrong credentials" });
		}

		//generating jwt refresh token
        const generatedRefreshToken =  generateRefreshToken(user._id)
        await User.updateOne({_id: user._id}, {$set: {refreshToken: generatedRefreshToken}})

        //generating access token.
        const generatedAccessToken =  generateAccessToken(user._id)
        

        res.cookie('refreshToken', generatedRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', //changed it to none, because will be deploying on render or vercel.
            maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
        })
		res.status(200).json({
			success: true,
			message: "User loggedin successfully",
			user: {name: user.name, email: user.email},
            accessToken: generatedAccessToken
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};

const Logout = async (req, res) => {
	try {
        const {refreshToken} = req.cookies
        
        if(!refreshToken){
            return res.status(200).json({success: true, message: 'Logged out successfully'})
        }

        await User.updateOne({refreshToken}, {$set: {refreshToken: null}})
        res.clearCookie('refreshToken')
        res.status(200).json({success: true, message: 'Logged out successfully'})

	} catch (error) {
		console.log(error);
		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
	}
};
const Refresh = async (req, res) => {
    try {
        const { refreshToken } = req.cookies

        if(!refreshToken){
            return res.status(401).json({success: false, message: "No refresh token found"})
        }

        const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
        const user = await User.findById(decodedRefreshToken.userId)

        //if user is not found in DB.
        if(!user){
            return res.status(401).json({success: false, message: "Invalid token"})
        }

        //For refresh token theft security,token revocation.
        if(user.refreshToken !== refreshToken){
            await User.updateOne({_id: user._id}, {$set: {refreshToken: null}})
            res.clearCookie('refreshToken')
            return res.status(401).json({success: false, message: "Token invalid/expired"})
        }

        const generatedRefreshToken =  generateRefreshToken(user._id)
        const generatedAccessToken =  generateAccessToken(user._id)

        //saving new refresh token to DB, token rotation.
        await User.updateOne({_id: user._id}, {$set: {refreshToken: generatedRefreshToken}})

        res.cookie("refreshToken", generatedRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7 //7 days
        })
        res.status(200).json({
			success: true,
			message: "Token refreshed successfully",
			user: {name: user.name, email: user.email},
            accessToken: generatedAccessToken
		});

    } catch (error) {
        console.log("Error in refresh controller",error);

		if(error.name === "TokenExpiredError"){
			return res.status(401).json({success: false, message: "Token expired"})
		}
		if(error.name === "JsonWebTokenError"){
			return res.status(401).json({success: false, message: "Invalid token"})
		}

		res.status(500).json({
			success: false,
			message: "Internal server error",
		});
    }
}

export {Signup, Login, Logout, Refresh}