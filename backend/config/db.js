import mongoose from "mongoose";

export const  connectDB =  async()=>{
    (await mongoose.connect('mongodb+srv://vinaypratap:vinay1234@cluster0.cfgaife.mongodb.net/food-del').then(()=>console.log("DB Connected")))
 }