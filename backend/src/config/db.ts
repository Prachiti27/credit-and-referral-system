import mongoose from "mongoose";

export const connectDB = async () => {
    const uri = process.env.MONGO_URI;
    if(!uri){
        throw new Error('Database URI not set');
    }
    try{
        await mongoose.connect(uri);
        console.log('MongoDB connected');
    }
    catch(err){
        console.error("MongoDB connection error",err);
    }
}