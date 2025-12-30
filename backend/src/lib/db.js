import e from 'express';
import mangoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mangoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB : ${conn.connection.host}`);
    }
    catch (error) {
        console.log("Error:", error);
    }
};
