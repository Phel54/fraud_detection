import fraudController from "./fraud.controller.js";

export default router =>{
    router.route('/fraud/detaction').post(fraudController.test);
}