import User from "./users.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import IUsers from "./user.interface";

class UserServices {

    async createUser(userData:IUsers){
        let user = new User(userData);
        return await user.save();
    }
    async checkIfExist(email:IUsers)  {
        const emailData = await User.findOne({ email: email })
        return emailData
    } 

    async checkIfExistAndIsActive(email:IUsers)  {
        const emailData = await User.findOne({ email: email, isActive:true })
        return emailData
    }
    async checkIfIsNotActive(email:IUsers)  {
        const emailData = await User.findOne({ email: email, isActive:false })
        return emailData
    }
    async decryptPassword(password:string, dbpassword:string)  {
        // console.log('password...: ',password);
        return await bcrypt.compare(password, dbpassword)
    
    }
    
    
    
    async encryptPassword(password:string){
        const salt = await bcrypt.genSalt(12);
    const hashedPassword =	password = await bcrypt.hash(password, salt);
        // console.log('encrypted...pass:',hashedPassword);
        return hashedPassword;
    }

    async signAccessToken(_id:string, email:string)  {
        const payload = {
            id: _id,
            email: email,       
            role: 'User',
        }
            const options = {
               expiresIn: process.env.JWT_EXPIRES_IN,
               issuer: process.env.JWT_ISSUER,
           };
       
           const secret:string = `${process.env.JWT_SECRET}`;
           const token = jwt.sign(payload, secret, options);
           return token;
    
    }

    async saveResetPasswordDetails (userData:any,token:Number) {
        userData.resetPasswordToken = `${token}`;
        userData.resetPasswordExpires =`${Date.now() + 60000 * 20}`; //20 mins
        // console.log(emailData);
        return await userData.save();
    
    }
    async saveRefreshToken(userData:any,token:Number) {
        userData.refreshToken = token;   
        return await userData.save();
    
    }

    async checkForResetToken(token:Number) {
        const itExist = await User.findOne({resetPasswordToken: token,
            resetPasswordExpires: {
                $gt: Date.now(),
            },}).select('-password')
            return itExist
    }


async viewAllMembersByAdmin(){
   let userData = User.find();    
    return userData;


}


 async viewOneMemberById(id:string) {    
    const userData = await User.findById(id.toString()).select('-password') 
    return userData
}

async viewOneMemberByEmail(email:IUsers){
    const userData = await User.findOne({email:email}).select('-password')
    return userData
}


//Update
async updateMember(id:string,userData:IUsers){
    return await User.findByIdAndUpdate(id,{$set:userData}).select('-password')
}

 // Delete
 async removeMember(id:IUsers) {
    return await User.updateOne(id,{$set:{isActive:false}}).select('-password')
}


}


export default new UserServices();