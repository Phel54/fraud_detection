import usersServices from './users.services';
import IUsers from './user.interface';
import { Request, Response } from 'express';
import apiResponse from '../util/apiResponse';
import { AnyArray } from 'mongoose';

class UsersController {
  async createUser(req: Request, res: Response) {
    const userData: IUsers = req.body;
    try {
      const user = await usersServices.checkIfExist(req.body.email);
      if (user) {
        const message = 'user already exist';
        return apiResponse.notFoundResponse(res, message);
      }

      let response = await usersServices.createUser(userData);
         let message = {
        response: response,
      };
      return apiResponse.successResponseWithData(res,'user Created successfully', message);
    } catch (error: any) {
      console.log(error);
      return apiResponse.errorResponse(res, error);
    }
  }

   //Login
   async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await usersServices.checkIfExist(email);
      const isUserActive = await usersServices.checkIfIsNotActive(email)
  
      // console.log(user);
      if (!user) {
        const message = "No record found";
        return apiResponse.notFoundResponse(res, message);
      }
      else  if (isUserActive) {
        const message = "Account not Active";
        return apiResponse.notFoundResponse(res, message);
      } else{ 
        await usersServices.decryptPassword(password, user.password)
        .then(async (result:any) => {
          // console.log(result);
          if (result === false) {
            const message = "No record found";
            return apiResponse.notFoundResponse(res, message);
          }

         const accessToken:any = usersServices.signAccessToken(user._id, user.email)
            .then(async (refresh) => {             
              let message = {
              id: `${user._id}`,
                firstName: `${user.name.first}`,
                accessToken: accessToken,
              };
              return apiResponse.successResponseWithData(res,"user logged in successfully", message);
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
  
     
    } catch (error: any) {
        console.log(error);
        return apiResponse.errorResponse(res, error);
      }
    }
























    
  };


export default new UsersController();
