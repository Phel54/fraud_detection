import express from 'express';
import usersController from './users.controller';
const userRouter = express.Router();

userRouter.route('/create').post(usersController.createUser);
userRouter.route('/login').post(usersController.login);

export default userRouter;