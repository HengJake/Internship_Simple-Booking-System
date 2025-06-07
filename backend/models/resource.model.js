import mongoose from "mongoose";

const resourcesSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    type: {
      type: String,
      enum: ["meeting_room", "lab_equipment", "study_pod"],
      require: true,
    },
    description: { type: String, default: "Enter description here..." },
    location: { type: String, require: true },
    availability: [
      {
        dayOfWeek: { type: Number, min: 0, max: 6 },
        startTime: String, // e.g., "09:00"
        endTime: String, // e.g., "17:00"
      },
    ],
    default: [],
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourcesSchema);

export default Resource; 