import mongoose from "mongoose";

const creditPackSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    credits: { type: Number, required: true },
    price: { type: Number, required: true }, // in INR
    description: { type: String },
    bgColor: {
      type: String,
      default: "bg-gradient-to-r from-gray-400 to-gray-600",
    },
  },
  { timestamps: true }
);

const CreditPack = mongoose.model("CreditPack", creditPackSchema);
export default CreditPack;
