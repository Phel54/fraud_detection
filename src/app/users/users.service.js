/**
 * Contains module(notes) services. 
 * A service object implements the user’s interactions with the application. 
 * It contains business logic that describe the connections with your domain objects.
 */
 import User from './users.model.js';
 import bcrypt from 'bcryptjs';
 import jwt from 'jsonwebtoken';
 
 class UserServices {
     //Create user
 async createUser(firstName, lastName, email, password, phoneNumber)  {
 
     //create an user object
     let user = new User({
         firstName: firstName,
         lastName: lastName,
         email: email,
         password: password,
         phoneNumber: phoneNumber,
     
     })
     return await user.save()
 
 }
 async checkIfExist(email)  {
     const emailData = await User.findOne({ email: email })
     return emailData
 }
 
 async checkIfExistAndIsActive(email)  {
     const emailData = await User.findOne({ email: email, isActive:true })
     return emailData
 }
 async checkIfIsNotActive(email)  {
     const emailData = await User.findOne({ email: email, isActive:false })
     return emailData
 }
 
 async decryptPassword(password, dbpassword)  {
     // console.log('password...: ',password);
     return await bcrypt.compare(password, dbpassword)
 
 }
 
 
 
 async encryptPassword(password){
     const salt = await bcrypt.genSalt(12);
 const hashedPassword =	password = await bcrypt.hash(password, salt);
     // console.log('encrypted...pass:',hashedPassword);
     return hashedPassword;
 }
 
 async signAccessToken(_id, email,organizationOwner)  {
     const payload = {
         memberID: _id,
         memberEmail: email,       
         role: 'User',
         isAnOrganizationOwner:organizationOwner
     }
         const options = {
            expiresIn: process.env.JWT_EXPIRES_IN,
            issuer: process.env.JWT_ISSUER,
            subject: process.env.JWT_SUBJECT,
            audience: process.env.JWT_AUDIENCE,
        };
    
        const secret = process.env.ACCESS_TOKEN_SECRET;
        const token = jwt.sign(payload, secret, options);
        return token;
 
 }
 
 async signRefreshToken (_id, email,organizationOwner)  {
     const payload = {
         memberID: _id,
         memberEmail: email,       
         role: 'User',
         isAnOrganizationOwner:organizationOwner
     };
     const options = {
        expiresIn: process.env.JWT_EXPIRES_IN,
        issuer: process.env.JWT_ISSUER,
        subject: process.env.JWT_SUBJECT,
        audience: process.env.JWT_AUDIENCE,
    };

    const secret = process.env.REFRESH_TOKEN_SECRET;
    const token = jwt.sign(payload, secret, options);
    return token;
 }
 async saveResetPasswordDetails (memberData,token) {
     memberData.resetPasswordToken = token;
     memberData.resetPasswordExpires = Date.now() + 60000 * 20; //20 mins
     // console.log(emailData);
     return await memberData.save();
 
 }
 async saveRefreshToken(memberData,token) {
     memberData.refreshToken = token;   
     return await memberData.save();
 
 }
 
 async checkForResetToken(token) {
     const itExist = await User.findOne({resetPasswordToken: token,
         resetPasswordExpires: {
             $gt: Date.now(),
         },}).select('-password')
         return itExist
 }
 async viewAllUsersByAdmin(limit,page){
     const options = {
         page: page,
         limit: limit,
         sort:'-createdAt'
       };
     const memberData = await User.paginate({},options,(err,result)=>{
         if (err){
             throw new Error(err)
         }
         return result
     })
     
     return memberData
 
 
 }
 
 
  async viewOneUserById(id) {    
     const memberData = await User.findById(id.toString()).select('-password') 
     return memberData
 }
 
 async viewOneUserByEmail(email){
     const memberData = await User.findOne({email:email}).select('-password')
     return memberData
 }
 
 
 //Update
 async updateUser(id,memberData){
     return await User.findByIdAndUpdate(id,{$set:memberData}).select('-password')
 }
 
  // Delete
  async removeUser(id) {
     return await User.updateOne(id,{$set:{isActive:false}}).select('-password')
 }
 
 async  verifyRefreshToken(refreshToken) {
   const token = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
 //   console.log(token);
   return token;
 }
 
  async updateRefreshToken(memberID,refreshToken){
     return await User.updateOne({_id:memberID},{$set:{refreshToken:refreshToken}})
 }
 }
 export default new UserServices();
 
 
 
 
 