// @deno-types="npm:@types/express@4.17.15"
import express from "npm:express@4.18.2";
import data from "./data.json" with { type: "json" };

const app = express();

// ------------- ENDPOINTS -------------
app.get("/", (_req, res) => {
  res.send("Welcome to the Dinosaur API!");
});

// TEST
app.get("/api", (_req, res) => {
  res.send(data);
});

app.get("/api/:dinosaur", (req, res) => {
  if (req?.params?.dinosaur) {
    const found = data.find((item) =>
      item.name.toLowerCase() === req.params.dinosaur.toLowerCase()
    );
    if (found) {
      res.send(found);
    } else {
      res.send("No dinosaurs found.");
    }
  }
});

app.listen(8000);
