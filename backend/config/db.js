import mongoose from 'mongoose';

const connectDB = async () => {
    await mongoose.connect('mongodb+srv://stsionastw_db_user:Mindmatrics123@cluster0.b9pr2ni.mongodb.net/MindMatrics')
        .then(() => {console.log('DB CONNECTED');})
}

export { connectDB };