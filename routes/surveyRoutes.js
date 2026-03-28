const express = require("express");
const Survey = require("../models/Survey");

const router = express.Router();

const FREQUENCY_ORDER = [
  "Rarely",
  "Once a year",
  "2–3 times per year",
  "2-3 times per year",
  "More than 3 times per year"
];

const BUDGET_ORDER = [
  "Under $1000",
  "$1000–$3000",
  "$1000-$3000",
  "$3000–$5000",
  "$3000-$5000",
  "Over $5000"
];

async function groupCount(fieldName) {
  const results = await Survey.aggregate([
    {
      $group: {
        _id: `$${fieldName}`,
        value: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        value: 1
      }
    }
  ]);

  return results.filter((item) => item.category);
}

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/api/submit", async (req, res) => {
  try {
    const {
      travelStyle,
      travelFrequency,
      dreamContinent,
      budgetRange
    } = req.body;

    if (!travelStyle || !travelFrequency || !dreamContinent || !budgetRange) {
      return res.status(400).json({
        success: false,
        message: "All fields are required."
      });
    }

    await Survey.create({
      travelStyle,
      travelFrequency,
      dreamContinent,
      budgetRange
    });

    return res.json({
      success: true,
      message: "Survey submitted successfully."
    });
  } catch (error) {
    console.error("Submit error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit survey."
    });
  }
});

router.get("/api/results", async (req, res) => {
  try {
    const pie = await groupCount("travelStyle");

    const bar = await groupCount("travelFrequency");
    bar.sort((a, b) => {
      return FREQUENCY_ORDER.indexOf(a.category) - FREQUENCY_ORDER.indexOf(b.category);
    });

    const budget = await groupCount("budgetRange");
    budget.sort((a, b) => {
      return BUDGET_ORDER.indexOf(a.category) - BUDGET_ORDER.indexOf(b.category);
    });

    const map = await groupCount("dreamContinent");

    return res.json({
      success: true,
      pie,
      bar,
      budget,
      map
    });
  } catch (error) {
    console.error("Results error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load chart data."
    });
  }
});

router.get("/api/responses", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const perPage = Math.min(Math.max(parseInt(req.query.perPage, 10) || 8, 1), 50);

    let query = {};

    if (q) {
      query = {
        $or: [
          { travelStyle: { $regex: q, $options: "i" } },
          { travelFrequency: { $regex: q, $options: "i" } },
          { dreamContinent: { $regex: q, $options: "i" } },
          { budgetRange: { $regex: q, $options: "i" } }
        ]
      };
    }

    const total = await Survey.countDocuments(query);

    const responses = await Survey.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .lean();

    return res.json({
      success: true,
      rows: responses,
      total,
      page,
      perPage
    });
  } catch (error) {
    console.error("Responses error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load responses."
    });
  }
});

module.exports = router;