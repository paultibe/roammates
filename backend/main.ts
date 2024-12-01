// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";
import data from "./data.json" with { type: "json" };
import "jsr:@std/dotenv/load";

const app = express();

// ------------- ENDPOINTS -------------
app.get("/", (_req, res) => {
  res.send("Welcome!");
});

// TEST
app.get("/api", (_req, res) => {
  res.send(data);
});

// google places API
app.get("/api/places", async (req, res) => {

  const city = req.query.city;

  const API_KEY = "AIzaSyBSyARxOEGMLQdB9okwNxIEe1L-2Gz6N7E"; // TODO move LOL

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=attractions+in+${city}&key=${API_KEY}`
    );
    const data = await response.json();
    res.send(data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.listen(8000);
