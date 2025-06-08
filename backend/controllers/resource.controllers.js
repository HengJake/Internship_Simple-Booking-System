import mongoose from "mongoose";
import Resource from "../models/resource.model.js"; // adjust the path if needed

function convertAvailabilityToUTC(dayOfWeek, timeStr) {
  // Malaysia timezone offset in minutes (+8 hours = 480 minutes)
  const MALAYSIA_OFFSET = 8 * 60;

  // Get today's date in UTC
  const now = new Date();

  // Get current day of week (0=Sun ... 6=Sat)
  const todayDay = now.getUTCDay();

  // Calculate how many days ahead is the desired dayOfWeek
  let dayDiff = dayOfWeek - todayDay;
  if (dayDiff < 0) dayDiff += 7; // next week if already passed

  // Reference date in UTC for the target day (00:00 UTC of that day)
  const refDate = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + dayDiff
    )
  );

  // Parse timeStr "HH:mm"
  const [hoursStr, minutesStr] = timeStr.split(":");
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);

  // Malaysia is UTC+8, so convert local time to UTC by subtracting 8 hours
  // So to get UTC time, subtract Malaysia offset from local hours/minutes
  let utcHours = hours - 8;
  let utcDate = new Date(refDate); // start of day UTC for target day

  // Handle negative hour (previous day)
  if (utcHours < 0) {
    utcDate.setUTCDate(utcDate.getUTCDate() - 1);
    utcHours += 24;
  }

  utcDate.setUTCHours(utcHours);
  utcDate.setUTCMinutes(minutes);
  utcDate.setUTCSeconds(0);
  utcDate.setUTCMilliseconds(0);

  return utcDate;
}

// Get all resources
export const readResource = async (req, res) => {
  try {
    const resources = await Resource.find({});
    res.status(200).json({ success: true, data: resources });
  } catch (error) {
    console.error("Error in fetching resources:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Create a new resource
export const createResource = async (req, res) => {
  const resource = req.body;

  // Validate required fields
  if (!resource.name || !resource.type || !resource.location) {
    return res
      .status(404)
      .json({ success: false, message: "Please provide all required fields" });
  }

  try {
    const name = resource.name;
    const type = resource.type;

    // Check if resource with same name and type exists
    const existingResource = await Resource.findOne({
      name,
      type,
    });

    if (existingResource) {
      return res.status(409).json({
        success: false,
        message: "Resource with this name and type already exists",
      });
    }

    // map through each timeslot
    resource.availability.map((slot) => {
      console.log(slot.startTime);

      slot.startTime = convertAvailabilityToUTC(
        slot.dayOfWeek,
        slot.startTime
      );
      slot.endTime = convertAvailabilityToUTC(
        slot.dayOfWeek,
        slot.endTime
      );

      console.log(slot.startTime);
    });


    const newResource = new Resource(resource);
    await newResource.save();
    res.status(201).json({ success: true, data: newResource });
  } catch (error) {
    console.error("Error in creating resource:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update a resource
export const updateResource = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Resource ID" });
  }

  try {
    const name = updatedData.name;
    const type = updatedData.type;

    // Check if resource with same name and type exists
    const existingResource = await Resource.findOne({
      name,
      type,
    });

    if (existingResource) {
      return res.status(409).json({
        success: false,
        message: "Resource with this name and type already exists",
      });
    }

    // validation!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // change timezone

    const updatedResource = await Resource.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.status(200).json({ success: true, data: updatedResource });
  } catch (error) {
    console.error("Error in updating resource:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a resource
export const deleteResource = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Resource ID" });
  }

  try {
    await Resource.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Resource deleted" });
  } catch (error) {
    console.error("Error in deleting resource:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// ================= Utility =======================
export const fetchResourceById = async (id) => {
  try {
    const resource = await Resource.findById(id);
    return { success: true, data: resource };
  } catch (error) {
    console.error("Error in fetching resource:", error.message);
    return { success: false, message: "Error fetching resource" };
  }
};