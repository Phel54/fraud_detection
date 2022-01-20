import Transaction from "./transactions.model.js";


class TransactionServices {
    async create(transactionData,country) {
        const trasactionsDetails = transactionData;
        trasactionsDetails.country = country
        let transaction = new Transaction(trasactionsDetails);
        // console.log(trasactionsDetails);
        // console.log(country);

        return await transaction.save();
      }

       
      
    
      

      async getTransactions(){
        return await Transaction.find()
      }
}

export default new TransactionServices();