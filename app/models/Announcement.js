import mongoose from "mongoose";

const AnnouncementSchema =
  new mongoose.Schema({
    text: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

export default mongoose.models.Announcement ||
  mongoose.model(
    "Announcement",
    AnnouncementSchema
  );