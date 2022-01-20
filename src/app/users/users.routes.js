
import userControllers from './users.controller.js';



// Specify the Routes
export default router =>{

    router
		.route('/users/register')
		// Register User
		.post(userControllers.register);

	router.route('/user/activate/token/:token').post(userControllers.activate)

	router
		.route('/user/userID/:userID/resendCode')
		.post(userControllers.resendCode); // Resend Activation code
	router
		.route('/users/login')
		//Login User
		.post(userControllers.login);

	router
		.route('/users/forgotpassword')
		.post(userControllers.forgotPassword); // Forgot Password

	router
		.route('/users/resetpassword')
		.post(userControllers.resetPassword); // Get Token and Reset Password

	router
		.route('/users')
		.get(userControllers.getAll);

	router
		.route('/users/userID/:userID')
		.get(userControllers.getUserById) // Get An User by ID
		.patch(userControllers.update) // Update An User
		.put(userControllers.update) // Update An User
		.delete(userControllers.deleteUser); // Delete An User

	router
		.route('/users/email/:email')
		.get(userControllers.getUserByEmail); // Get n User by Email

	router
		.route('/user/refreshToken/:refreshToken')
		.post(userControllers.refresh)
}
