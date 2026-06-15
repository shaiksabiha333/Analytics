const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Analytics API
app.get("/api/analytics", (req, res) => {
  res.json({
    kpis: {
     totalEmailsSent: 3333333,
      openRate: 78.2,
      ctr: 31.7,
      bounceRate: 3.3,
      conversionRate: 15.8,
      revenue: 456,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});