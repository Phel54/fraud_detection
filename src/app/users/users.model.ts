import mongoose from 'mongoose';
import IUsers from './user.interface';
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
        name:{
            first:{
                type:String,
                required:true,
                trim:true
            },
            last:{
                type:String,
                required:true,
                trim:true
            }
        },
        email:{
            type:String,
            required:true,
            unique:true,
            lowercase:true,
            trim:true
        },

        phoneNumber: {
            type:String,
            required:true,
        },
        gender: {
			type: String,
			enum: ['Male', 'Female', 'LGBTQ', 'Others'],
		},
        isActive: {
			type: Boolean,
			default: true,
		},
		resetPasswordToken: String,
		resetPasswordExpires: String,
    },
	{ timestamps: true }
);

const User = mongoose.model<IUsers>('Users',userSchema,'Users');
export default User;