const mongoose = require("mongoose");

const SurveySchema = new mongoose.Schema(
  {
    travelStyle: {
      type: String,
      required: true,
      trim: true
    },
    travelFrequency: {
      type: String,
      required: true,
      trim: true
    },
    dreamContinent: {
      type: String,
      required: true,
      trim: true
    },
    budgetRange: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Survey", SurveySchema);