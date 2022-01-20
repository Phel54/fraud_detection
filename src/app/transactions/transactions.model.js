import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    accountId: { type: String },
    accountType: { type: String },
    transactionData: {
      transactionDate: { type: String },
      transactionType: { type: String },
      settlementDate: { type: String },
      transactionCode: { type: String },
      transactionSign: { type: String },
      referenceNumber: { type: String },
      sequenceNumber: { type: String },
      authorizationCode: { type: String },
      transactionAmount: { type: String },
      transactionCurrency: { type: String },
      billingAmount: { type: String },
      billingCurrency: { type: String },
      conversionRate: { type: String },
      cardAcceptorActivity: { type: String },
      cardAccNameAddress: { type: String },
      acquirerCountryCode: { type: String },
      cardAcceptorId: { type: String },
      cardAcceptorTerminalId: { type: String },
      reversalFlag: { type: String },
      posData: { type: String },
      actionCode: { type: String },
      internalStan: { type: String },
      externalStan: { type: String },
      routingCode: { type: String },
      captureCode: { type: String },
      aquirerId: { type: String },
      feeType: { type: String },
      verificationResult3DS: { type: String },
      deditAmount: { type: String },
      cardNumber: { type: String },
      responseCodeDescription: { type: String },
      merchantName: { type: String },
      merchantId: { type: String },
      terminalId: { type: String },
      location: { type: String },
      transactionDevice: { type: String },
      messageType: { type: String },
    },
    country:{type:Schema.Types.Mixed},
    ip_address: { type: String },
  },
  { timestamps: true }
);

const Transaction = mongoose.model(
  "Transaction",
  transactionSchema,
  "Transactions"
);

export default Transaction;
