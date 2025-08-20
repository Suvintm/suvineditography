import axios from "axios";
import fs from "fs";
import FormData from "form-data";
import userModel from "../model/userModel.js";

const removeBgImage = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    // Find user
    const user = await userModel.findById(userId);
    if (!user) {
      fs.unlinkSync(req.file.path);
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check credits
    if (user.creditBalance <= 0) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({
        success: false,
        message: "No credits remaining",
        creditBalance: user.creditBalance,
      });
    }

    // Prepare file for ClipDrop API
    const formData = new FormData();
    formData.append("image_file", fs.createReadStream(req.file.path));

    // Call ClipDrop API
    const { data } = await axios.post(
      "https://clipdrop-api.co/remove-background/v1",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          "x-api-key": process.env.CLIPDROP_API,
        },
        responseType: "arraybuffer",
      }
    );

    // Convert to Base64
    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;

    // Deduct 1 credit
    user.creditBalance -= 1;
    await user.save();

    // Delete temp file
    fs.unlinkSync(req.file.path);

    return res.status(200).json({
      success: true,
      message: "Background removed successfully",
      creditBalance: user.creditBalance,
      data: resultImage,
    });
  } catch (error) {
    console.error("Remove BG error:", error.message);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res
      .status(500)
      .json({ success: false, message: "Background removal failed" });
  }
};

export { removeBgImage };
