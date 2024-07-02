const axios = require("axios");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.post("/translate", async (requ, resp) => {
  const { text, targetLang } = requ.body;

  const options = {
    method: "POST",
    url: process.env.url,
    headers: {
      "x-rapidapi-key": process.env.api_key,
      "x-rapidapi-host": process.env.api_host,
      "Content-Type": "application/json",
    },
    data: {
      from: "auto",
      to: targetLang,
      text: text,
    },
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);
    resp.send(response.data.trans);
  } catch (error) {
    console.error(error);
  }
});

app.listen(process.env.port, () => {
  console.log(`Server is running on port: ${process.env.port}`);
});
