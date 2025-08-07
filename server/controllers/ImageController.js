import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import userModel from "../model/userModel.js";

const removeBgImage = async (req, res) => {
  try {
    const {} = req.body;

    const user = await userModel.findOne({});

    if (!user) {
      return res.json({ success: false, message: "user Not Found" });
    }

    if (user.creditBalance === 0) {
      return res.json({
        success: true,
        message: "No Credit Balance",
        creditBalance: user.creditBalance,
      });
    }

    const imagePath = req.file.path;

    const imageFile = fs.createReadStream(imagePath);

    const formdata = new FormData();
    formdata.append("image_file", imageFile);

    const { data } = await axios.post(
      "https://clipdrop-api.co/remove-background/v1.",
      formdata,
      {
        headers: {
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    const base64Image = Buffer.from(data, "binary").toString("base64");

    const resultImage = `dat:${req.file.mimetype};base64,${base64Image}`;

    await userModel.findOneAndUpdate(user._id, {
      creditBalance: user.creditBalance - 1,
    });

    res.json({
      success: true,
      resultImage,
      creditBalance: user.creditBalance - 1,
      message: "background-removed",
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export { removeBgImage };
