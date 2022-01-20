/**
 * The Models files contains all of your schema.
 * Each database table has a corresponding "Model" which is used to interact with that table.
 * Models allow you to query for data in your tables, as well as insert new records into the table.
 */

 import mongoose from "mongoose";
 import bcrypt from "bcryptjs";
 import mongoosePaginate from "mongoose-paginate-v2";
 const Schema = mongoose.Schema;
 
 const userSchema = new Schema(
   {
     firstName: {
       type: String,
       required: [true, "Please Enter Your First Name"],
       trim: true,
       maxlength: [50, "Name cannot be more than 50 characters"],
       minlength: [2, "Name cannot be less than 2 characters"],
     },
     lastName: {
       type: String,
       required: [true, "Please Enter Your Last Name"],
       trim: true,
       maxlength: [50, "Name cannot be more than 50 characters"],
       minlength: [2, "Name cannot be less than 2 characters"],
     },
 
     email: {
       type: String,
       lowercase: true,
       email: true,
       required: [true, "Please enter your Email"],
     },
     password: {
       type: String,
       required: [true, "Please Enter your password"],
       trim: true,
     },
     phoneNumber:{
       type: String,
       required: [true, "Please Enter your phone number"],
       trim: true,
     },
     refreshToken:{
       type:String,     
     },
     isActive: {
       type: Boolean,
       default: false,
     },
     resetPasswordToken: String,
     resetPasswordExpires: String,
   },
   { timestamps: true }
 );
 
 //
 userSchema.pre("save", async function (next) {
   // check if password is present and is modified.
   if (this.password && this.isModified("password")) {
     // call your hashPassword method here which will return the hashed password.
     const salt = await bcrypt.genSalt(12);
 
     // student.password = await bcrypt.hash(req.body.password, salt);
     this.password = await bcrypt.hash(this.password, salt);
   }
 
   // everything is done, so let's call the next callback.
   next();
 });
 
 userSchema.plugin(mongoosePaginate);
 const User = mongoose.model("User", userSchema, "User");
 
 export default User;
 