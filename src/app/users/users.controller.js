import apiResponse from "../../util/apiResponse.js";
import Joi from "joi";
import userService from "./users.service.js";

class UserController {//Register and save a new User
  async register(req, res, next){
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      locations,
      interest,
      image
    } = req.body;
    try {
      const user = await userService.checkIfExist(email);
  
      if (user) {
        const message = "User already exist";
        return apiResponse.notFoundResponse(res, message);
      }
  
      let response = await userService.createUser(
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        locations,
        interest,
        image
      );
      
      //Generate Token to sent to User's email
      let token = Math.floor(100000 + Math.random() * 900000);
      await userService.saveResetPasswordDetails(response, token);
      await pointServices.createBusiness(response._id)
      let message = {
        msg: "User Created successfully",
        activationCode: `This is the activation code,${token}`,
        response: response,
      };
      return apiResponse.successResponseWithData(res, message);
    } catch (error) {
      return apiResponse.errorResponse(res, error.errors);
    }
  };
  
  async activate(req,res){
    try {
      const token = req.params.token;
      const user = await userService.checkForResetToken(token);
      if (!user) {
        const message = "Token is invalid or has expird";
        return apiResponse.notFoundResponse(res, message);
      }
      // console.log(token)
      let accessToken = await userService.signAccessToken(user._id, user.email,user.organizationOwner);
      userService.signRefreshToken(user._id, user.email,user.organizationOwner)
        .then(async (refresh) => {
          await userService.saveRefreshToken(user, refresh);
          user.isActive = true;
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;
          await user.save();
          let message = {
            message: "User Account Activated",
            id: `${user._id}`,
            firstName: `${user.firstName}`,
            accessToken: accessToken,
            refreshToken: refresh,
          };
          return apiResponse.successResponseWithData(res, message);
        })
        .catch((err) => {
          console.log(err);
          return apiResponse.errorResponse(res, err.errors);
        });
    } catch (error) {
      console.log(error);
      return apiResponse.errorResponse(res, error.errors);
    }
  }
  
  // Resend Activation
  async resendCode(req, res, next)  {
    try {
      const userID = req.params.userID;
      const user = await userService.viewOneUserById(userID);
    //Generate Token to sent to User's email
    let token = Math.floor(100000 + Math.random() * 900000);
      await userService.saveResetPasswordDetails(user, token);
      const activate = `Hello ${user.firstName}, Welcome to SUMA. "\n" Your Activation Code is: ${token}`;
      await SMS.send(user.phoneNumber, activate);
      let message = {
        msg: "Code Sent Successfully",
        activationCode: `This is the activation code,${token}`,
      };
      return apiResponse.successResponse(res, message);
    } catch (error) {
      return apiResponse.errorResponse(res, error.errors);
    }
  };
  
  //Login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await userService.checkIfExist(email);
      const isUserActive = await userService.checkIfIsNotActive(email)
  
      // console.log(user);
      if (!user) {
        const message = "No record found";
        return apiResponse.notFoundResponse(res, message);
      }
      else  if (isUserActive) {
        const message = "Account not Active";
        return apiResponse.notFoundResponse(res, message);
      } else{ 
        await userService.decryptPassword(password, user.password)
        .then(async (result) => {
          // console.log(result);
          if (result === false) {
            const message = "No record found";
            return apiResponse.notFoundResponse(res, message);
          }
  
          let accessToken = await userService.signAccessToken(user._id, user.email,user.organizationOwner);
          userService.signRefreshToken(user._id, user.email,user.organizationOwner)
            .then(async (refresh) => {
              await userService.saveRefreshToken(user, refresh);
              let message = {
                message: "User logged in successfully",
                id: `${user._id}`,
                firstName: `${user.firstName}`,
                accessToken: accessToken,
                refreshToken: refresh,
              };
              return apiResponse.successResponseWithData(res, message);
            })
            .catch((err) => {
              console.log(err);
              return apiResponse.errorResponse(res, err.errors);
            });
        })
        .catch((err) => {
          console.log(err);
          return apiResponse.errorResponse(res, err.errors);
        });}
  
     
    } catch (error) {
      return apiResponse.errorResponse(res, error.errors);
    }
  };
  
  // Forgot Password Route
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await userService.checkIfExist(email);
  
      if (!user) {
        const message = "This User does not exist";
        return apiResponse.notFoundResponse(res, message);
      }
  
      //Generate Token to sent to User's email
      let token = Math.floor(100000 + Math.random() * 900000);
  
      const reset = `Hello ${user.firstName}, Welcome to SUMA. "\n" Your Reset Code is: ${token}`;
      await SMS.send(user.phoneNumber,reset)
      //input the token into the db for the password to be changed
  
      await userService.saveResetPasswordDetails(user, token);
      let message = {
        message: "Reset code Sent",
        token: token,
      };
      // console.log(response);
      return apiResponse.successResponseWithData(res, message);
    } catch (error) {
      return apiResponse.errorResponse(res, error.errors);
    }
  };
  
  // Reset the Password
  async resetPassword(req, res, next) {
    try {
      const { token, password } = req.body;
  
      const user = await userService.checkForResetToken(token);
      if (!user) {
        const message = "Token is invalid or has expird";
        return apiResponse.notFoundResponse(res, message);
      }
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      const message = "Password reset successfull";
      return apiResponse.successResponse(res, message);
    } catch (error) {
      return apiResponse.errorResponse(res, error.errors);
    }
  };
  
  // Get All Users by Admin
  async getAll(req, res, next) {
    try {
      
      const limit = req.query.limit || 100;
      const page = req.query.page || 10;
      const users = await userService.viewAllUsersByAdmin(limit,page);
      return apiResponse.successResponseWithData(res, users);
    } catch (error) {
      return apiResponse.errorResponse(res, error.errors);
    }
  };
  
  // Get one user with an Email
  async getUserByEmail(req, res, next)  {
    try {
      const speakerEmail = req.params.email;
      const user = await userService.viewOneUserByEmail(speakerEmail);
      if (!user) {
        const message = "User not found";
        return apiResponse.notFoundResponse(res, message);
      }
      return apiResponse.successResponseWithData(res, user);
    } catch (error) {
      return apiResponse.errorResponse(res, error.errors);
    }
  };
  
  // Get user by userID
  async getUserById(req, res, next)  {
    try {
      const userID = req.params.userID;
  
      const user = await userService.viewOneUserById(userID);
      if (!user) {
        const message = "User not found";
        return apiResponse.notFoundResponse(res, message);
      }
  
      return apiResponse.successResponseWithData(res, user);
    } catch (error) {
      return apiResponse.errorResponse(res, error.errors);
    }
  };
  
  //Update a user details with userID
  async update(req, res, next)  {
    try {
      const userID = req.params.userID;
      const user = await userService.viewOneUserById(userID);
      if (!user) {
        const message = "User not found";
        return apiResponse.notFoundResponse(res, message);
      }
      const userData = req.body;
  
      const updateUserData = await userService.updateUser(userID, userData);
      return apiResponse.successResponseWithData(res, "Update Successfull");
    } catch (error) {
      return apiResponse.errorResponse(res, error.message);
    }
  };
  
  // Delete a user with userID
  
  async deleteUser(req, res, next)  {
    try {
      const user = await userService.viewOneUserById(req.params.userID);
      if (!user) {
        const message = "User not found";
        return apiResponse.notFoundResponse(res, message);
      }
      await userService.removeUser(req.params.id)
        .then((result) => {
          const message = "User Deleted";
          return apiResponse.successResponse(res, message);
        })
        .catch((err) => {
          return apiResponse.errorResponse(res, err.errors);
        });
    } catch (error) {
      return apiResponse.errorResponse(res, error.errors);
    }
  
   
  };
  async refresh(req, res, next) {
      try {
        // const {refreshToken} = req.body;
        const refreshToken =  req.params.refreshToken;
        if (!refreshToken) {
          const message = "Invalid refresh token";
          return apiResponse.notFoundResponse(res, message);
        }
        const userId = await userService.verifyRefreshToken(refreshToken);
        const accessToken = await userService.signAccessToken(userId.userID, userId.userEmail);
        const refToken = await userService.signRefreshToken(userId.userID, userId.userEmail);
      await userService.updateRefreshToken(userId.userID,refToken)
      let message = {
        newAccessToken: accessToken,
        refreshToken: refToken
      }
      return apiResponse.successResponse(res, message);
      } catch (error) {
        next(error);
      }
    };
  }

  export default new UserController();