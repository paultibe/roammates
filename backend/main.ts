// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";
import data from "./data.json" with { type: "json" };
import "jsr:@std/dotenv/load";
import { writeJson } from "https://deno.land/std@0.66.0/fs/write_json.ts";

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
  const API_KEY = "AIzaSyBSyARxOEGMLQdB9okwNxIEe1L-2Gz6N7E";
 
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=attractions+in+${city}&key=${API_KEY}`
    );
    const data = await response.json();
    console.log(data.results.length)
 
    const places = await Promise.all(data.results.map(async place => {
      const detailsResponse = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&key=${API_KEY}`
      );
      const details = await detailsResponse.json();

      let photoUrl = '';
      if (place.photos && place.photos[0]) {
        photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`;
      }
 
      return {
        name: place.name,
        link: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        rating: place.rating,
        description: details.result?.editorial_summary?.overview || 'No description available',
        photo: photoUrl
      };
    }));
 
    res.send(places);
  } catch (error) {
    res.status(500).send(error.message);
  }
 });

 // parsing json
app.post("/api/parse", async (req, res) => {
  const { text } = req.body;
 
  if (!text) {
    return res.status(400).send("No text provided");
  }
 
  try {
    const parsed = { received: text };
    res.send(parsed);
  } catch (error) {
    res.status(500).send(error.message);
  }
 });

app.listen(8000);
