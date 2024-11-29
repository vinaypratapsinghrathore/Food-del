// models/userModel.js

import mongoose from 'mongoose';

// Define the schema for the user
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} }
}, { minimize: false });

// Create or get the user model
const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;
