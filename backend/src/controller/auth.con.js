import { generateToken } from "../lib/util.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { email, fullname, password } = req.body;
    try {

        if (!email || !fullname || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({
            email,
            fullname,
            password: hashedPassword,
        });
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                fullname: newUser.fullname,
                profilepic: newUser.profilepic,
            });
        }
        else {
            return res.status(400).json({ message: "Invalid user data." });
        }
    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ message: "Server error." });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const ispasswordcorrect = await bcrypt.compare(password, user.password);
        if (!ispasswordcorrect) {
            return res.status(400).json({ message: "Invalid email or password." });
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            email: user.email,
            fullname: user.fullname,
            profilepic: user.profilepic,
        });
    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(500).json({ message: "Server error." });
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully." });

    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({ message: "Server error." });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilepic } = req.body;
        const userId = req.user._id

        if (!profilepic) {
            return res.status(400).json({ message: "Profile picture is required." });
        }
        const uploadResponse = await cloudinary.uploader.upload(profilepic)
        const updateuser = await User.findByIdAndUpdate(userId, {
            profilepic: uploadResponse.secure_url,
        }, { new: true });

        res.status(200).json(updateuser);
    } catch (error) {
        console.log("Error in updateProfile controller:", error.message);
        res.status(500).json({ message: "Server error." });
    }
};

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller:", error.message);
        res.status(500).json({ message: "Server error." });
    }
}