const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axiosBase = require("axios");
const app = express();
const port = 8000;

app.use(cors());
app.use(bodyParser.json());
// app.use(express.static("kadai"));
app.post("/api", async (req, res) => {
  console.log(req.body.platform);
  const url = `https://public-api.tracker.gg/v2/apex/standard/profile/${req.body.platform}/${req.body.userName}`;
  const config = {
    headers: {
      "TRN-Api-Key": "2d565316-ddf9-4e2e-9842-5c6f92e0f84d",
      // "Content-Type": "application/x-www-form-urlencoded",
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin": "*",
    },
    // mode: "no-cors",
  };

  const axiosResponse = await axiosBase.get(url, config);
  console.log("axiosResponse", axiosResponse.data);
  res.json(axiosResponse.data,encoding="utf-8");

  // axiosBase
  //   .get(url, config)
  //   // .then((axiosResponse) => res.send(JSON.stringify(axiosResponse.data)))
  //   .then((axiosResponse) => {
  //     console.log("axiosResponse.data", axiosResponse.data);

  //     res.send(axiosResponse.data);
  //   })
  //   .catch((err) => console.log(err));
  // console.log("aaa", axiosResponse.data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
