import CreditPack from "../model/CreditPack.js";

// ✅ Create a new credit pack
export const createPack = async (req, res) => {
  try {
    const { name, credits, price, description, bgColor } = req.body;
    if (!name || !credits || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const pack = await CreditPack.create({
      name,
      credits,
      price,
      description,
      bgColor,
    });

    res.status(201).json({ message: "Pack created successfully", pack });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all credit packs
export const getAllPacks = async (req, res) => {
  try {
    const packs = await CreditPack.find().sort({ price: 1 });
    res.json(packs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch packs", error: error.message });
  }
};

// ✅ Update an existing pack
export const updatePack = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedPack = await CreditPack.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedPack)
      return res.status(404).json({ message: "Pack not found" });
    res.json({ message: "Pack updated successfully", updatedPack });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// ✅ Delete a pack
export const deletePack = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPack = await CreditPack.findByIdAndDelete(id);
    if (!deletedPack)
      return res.status(404).json({ message: "Pack not found" });
    res.json({ message: "Pack deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Deletion failed", error: error.message });
  }
};
