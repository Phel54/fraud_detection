import transactionsController from "./transactions.controller.js";

export default router =>{
    router.route('/transactions/create').post(transactionsController.create);
}