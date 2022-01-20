import transactionsServices from "./transactions.services.js";
import fraudServices from "../fraudAnalyzer/fraud.services.js";
import apiResponse from "../../util/apiResponse.js";
import ipfetch from "ip-fetch";

class TransactionControllers {
    async create(req, res) {
        try {
          let  transactionData = req.body;         
            const country = await ipfetch.getLocationNpm(transactionData.ip_address);
            // console.log(transactionData);
           
            const transaction = await transactionsServices.create(transactionData,country);
           let checkCountryChange = await fraudServices.checkChangeInCountry(transactionData);
           let amountWithTime = await fraudServices.checkTransactionAmountWithTime(transactionData);
           let changeInState =   await fraudServices.checkChangeInStates(transactionData);

           let message = {
             changeIncountryAlert : checkCountryChange,
             changeInStateAlert: changeInState,
             unusualWithdrawalAlert: amountWithTime
           }

            
            return apiResponse.successResponseWithData(res, "Transaction",message);
         } catch (error) {
        console.log(error)
        return apiResponse.errorResponse(res, error.errors)
         }}
}
export default new TransactionControllers();