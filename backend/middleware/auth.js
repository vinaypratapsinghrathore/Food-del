// import jwt from "jsonwebtoken";

// const authMiddleware = async (req, res, next) => {
//   console.log("Tok back " +token)
//   const token = req.header('Authorization')?.replace('Bearer ', '');
//   // Check if token exists
//   if (!token) {
//     return res.status(401).json({ success: false, message: "Not Authorized. Please log in again." });
//   }

//   try {
//     // Verify the token
//     const token_decode = jwt.verify(token, process.env.JWT_SECRET);
//     req.body.userId = token_decode.id;
//     next();
//   } catch (error) {
//     console.error(error);

//     // Handle specific JWT errors
//     if (error.name === 'TokenExpiredError') {
//       return res.status(401).json({ success: false, message: "Token expired. Please log in again." });
//     } else if (error.name === 'JsonWebTokenError') {
//       return res.status(400).json({ success: false, message: "Invalid token." });
//     }

//     // Default error response
//     res.status(500).json({ success: false, message: "Server error during authentication." });
//   }
// };

// export default authMiddleware;

import jwt from "jsonwebtoken"
const authMiddleware = async (req,res,next)=>{
    const {token} =req.headers;
    if(!token){
        return res.json({success:false,message:"Not Authorized Login Again"})
    }
    try{
        const token_decode = jwt.verify(token,process.env.JWT_SECRET);
        req.body.userId=token_decode.id;
        next();
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})

    }

}
export default authMiddleware;
