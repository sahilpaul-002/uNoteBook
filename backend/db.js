import mongoose, { Mongoose } from "mongoose";
// Replace the placeholder with your Atlas connection string
const uri = "mongodb://localhost:27017/uNoteBook?directConnection=true&tls=false";

const connectToMongoDB = async () => {
    // Create a MongoClient with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri);
    console.log("Connected to MongoDB using Mongoose");
}

export { connectToMongoDB }