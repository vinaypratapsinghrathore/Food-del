import userModel from '../models/userModel.js'; // Fixed typo in import
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';



///login user
const loginUser = async (req,res)=>{
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if (!user){
            return res.json({success:false,message:"User Doesn't exist"})
        }
        
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials "})
        }
        const token = createToken(user._id);
        res.json({success:true,token})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
        
    }
}
// Function to create a JWT token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Function to handle user registration
const registerUser = async (req, res) => {
    const { name, password, email } = req.body;
    try {
        // Check if the user already exists
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Validate email format & strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email' });
        }
        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Please enter a strong password with at least 8 characters' });
        }

        // Hash the user's password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        const user = await newUser.save();

        // Generate a token for the new user
        const token = createToken(user._id);

        res.status(201).json({ success: true, token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Function to handle user login


export { registerUser, loginUser };
