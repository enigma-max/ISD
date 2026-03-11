const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// This variable lives in the server's memory
let serverCount = 0;

app.post("/api/test", (req, res) => {
  serverCount += 1; // Increase the count
  console.log(`Current count is: ${serverCount}`);
  
  // Send the updated count back to the frontend
  res.json({ count: serverCount });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));