import fraudServices from "./fraud.services.js";
import apiResponse from "../../util/apiResponse.js";

class FraudDetectionControllers {
    async test(req, res) {
        try {
            const lastTransaction = await fraudServices.previousOneTransaction();
            return apiResponse.successResponseWithData(res, "Transaction",lastTransaction);
         } catch (error) {
        console.log(error)
        return apiResponse.errorResponse(res, error.errors)
         }
    }
}

export default new FraudDetectionControllers()