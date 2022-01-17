enum Gender{
    Male,Female,Transgender,Other
}

export default interface IUsers {
    name:{
        first:string,
        last:string
    },
    email:string,
    phoneNumber:string,
    gender:Gender,
    isActive:boolean,
    resetPasswordToken: String,
    resetPasswordExpires: String,
    password:string,

}
