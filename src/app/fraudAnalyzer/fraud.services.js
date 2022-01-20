import Transaction from "../transactions/transactions.model.js";
import moment from "moment";

class FraudDetectionServices {
  async previousOneTransaction(transactionData) {
    const previousTransaction = await Transaction.find()
      .sort({ _id: -1 })
      .limit(1);

    return previousTransaction[0].country;
  }
  async checkChangeInCountry(transactionData) {
    const previousTransaction = await Transaction.find()
      .sort({ _id: -1 })
      .limit(2);
    // console.log(transactionData);
    if (
      previousTransaction[1].country.country === transactionData.country.country
    ) {
      console.log(
        ":::::::::Safe Transaction, same country::::::::",
        previousTransaction[1].country.country,
        "<->",
        transactionData.country.country
      );
      return this.normalAlert() + ` ::::Transaction happened in Same country,  ${previousTransaction[1].country.country} <-> ${transactionData.country.country}`;
    } else {
      console.log(
        ":::::::::Red Flag.. Transaction ddnt happen in the same country::::::::",
        previousTransaction[1].country.country,
        "<->",
        transactionData.country.country
      );
      return this.redAlert() + `Transaction ddnt happen in the same country ${previousTransaction[1].country.country} <-> ${transactionData.country.country}`;
    }
  }

  async checkChangeInStates(transactionData) {
    const previousTransactions = await Transaction.find()
      .sort({ _id: -1 })
      .limit(20);

   const newTransactionRegion = transactionData.country.regionName;
   var array1 = [];
   for (var i=0; i<previousTransactions.length; i++) {
     array1.push(previousTransactions[i].country.regionName)
   }
   var array2 = Array.from(new Set(array1));
   var placeHolder = [];

   for (var i=0; i<array2.length; i++){
       var hold = previousTransactions.filter(element => element.country.regionName == array2[i])
       placeHolder.push({state:array2[i],numberOfOccurrence:hold.length})
    //    console.log(hold);
   }
  
   var value = Math.max.apply(Math, placeHolder.map(function(o) { return o.numberOfOccurrence; }))
   console.log(value);
   console.log(placeHolder);
   var check = placeHolder.find(element=>element.state == newTransactionRegion)
   console.log(check);
   
    if (
        previousTransactions[1].country.regionName ===
      transactionData.country.regionName
    ) {
      console.log(
        ":::::::::Normal Transaction, same state::::::::",
        previousTransactions[1].country.regionName,
        "<->",
        transactionData.country.regionName
      );

      return this.normalAlert() + `:::::::::Normal Transaction, Same state/region:::::::: ${ previousTransactions[1].country.regionName} <-> ${transactionData.country.regionName}`;
    } else {
        if (check.numberOfOccurrence < value) {
            console.log(
                ":::::::::Orange Flag.. Transaction ddnt happen in the same state::::::::"
              );
              return this.orangeAlert() + `:::::::::Transaction ddnt happen in the same state:::::::: Transactions has hanppened in ${ previousTransactions[1].country.regionName}  ${value} times <-> and in  ${transactionData.country.regionName} ${check.numberOfOccurrence} times`;
        }
      console.log(
        ":::::::::Orange Flag.. Transaction ddnt happen in the same state::::::::"
      );
      return this.orangeAlert() + `:::::::::Transaction ddnt happen in the same state:::::::: ${ previousTransactions[1].country.regionName} <-> ${transactionData.country.regionName}`;
    }
  }

  async checkTransactionAmountWithTime(transactionData) {
    const previousTransaction = await Transaction.find({
      billingAmount: transactionData.transactionData.billingAmount,
    })
      .sort({ _id: -1 })
      .limit(6);
    // console.log(previousTransaction);
    var aary = previousTransaction;
    var a = aary.filter(
      (element) =>
        new Date(element.transactionData.transactionDate) >=
        new Date(transactionData.transactionData.transactionDate) - 1800 * 1000
    );
    a.shift();
    console.log(a.length);

    if (a.length > 0 && a.length < 1) {
      console.log(
        `:::::::::Yellow Flag.. Transaction happend ${a.length} times within an hour::::::::`
      );
      return this.yellowAlert() + `:::::::::Yellow Flag.. Transaction happend ${a.length} times within 30mins::::::::`;
    } else if (a.length > 1 && a.length < 3) {
      console.log(
        `:::::::::Orange Flag.. Transaction happend ${a.length} times within an hour::::::::`
      );
      return this.orangeAlert() +  `:::::::::Orange Flag.. Transaction happend ${a.length} times within 30mins::::::::`;
    } else {
      console.log(
        `:::::::::Red Flag.. Transaction happend ${a.length} times within an hour::::::::`
      );
      return this.redAlert() +  `:::::::::Red Flag.. Transaction happend ${a.length} times within an 30 mins::::::::`;
    }
  }

  orangeAlert() {
    return "Orange Flag Alert";
  }

  normalAlert() {
    return "Normal Flag Alert";
  }

  redAlert() {
    return "Red Flag Alert";
  }

  yellowAlert() {
    return "Yellow Flag Alert";
  }
}

export default new FraudDetectionServices();
