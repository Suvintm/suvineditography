import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected successfully");
  });

  await mongoose.connect(`${process.env.MONGODB_URI}/suvinproject`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export default connectDB;
