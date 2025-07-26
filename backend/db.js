import mongoose, { Mongoose } from "mongoose";
import dotenv from 'dotenv';

// Load environment variables from .env.local file
dotenv.config({ path: './.env.local' });
const dbUserName = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

// Replace the placeholder with your Atlas connection string
// const uri = "mongodb://localhost:27017/uNoteBook?directConnection=true&tls=false";
const uri = `mongodb+srv://${dbUserName}:${dbPassword}@unotebook.gpk4de1.mongodb.net/uNoteBook?retryWrites=true&w=majority&appName=uNoteBook`;


const connectToMongoDB = async () => {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri);
    console.log("Connected to MongoDB using Mongoose");
}

export { connectToMongoDB }