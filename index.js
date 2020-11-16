const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const FormData = require("form-data");
const token = require("./token");

var app = express();
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Started on port 3000");
});

app.get("/getall", function (req, res) {
  let data = new FormData();
  RequestToRedcapApi(req, res, data);
});

app.post("/create", function (req, res) {
  let record_id = req.body.record_id;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let age = req.body.age;
  let status = req.body.status;
  const record = [
    {
      record_id: record_id,
      firstname: firstname,
      lastname: lastname,
      age: age,
      my_first_instrument_complete: status,
    },
  ];

  let data = new FormData();
  data.append("forceAutoNumber", "true");
  data.append("returnContent", "auto_ids");
  data.append("data", JSON.stringify(record));

  RequestToRedcapApi(req, res, data);
});

app.post("/update", function (req, res) {
  let record_id = req.body.record_id;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  let age = req.body.age;
  let status = req.body.status;
  const record = [
    {
      record_id: record_id,
      firstname: firstname,
      lastname: lastname,
      age: age,
      my_first_instrument_complete: status,
    },
  ];

  let data = new FormData();
  data.append("data", JSON.stringify(record));

  RequestToRedcapApi(req, res, data);
});

function RequestToRedcapApi(req, res, data) {
  const url = "https://open.rsyd.dk/redcap_uddannelse/api/";
  data.append("token", token);
  data.append("content", "record");
  data.append("format", "json");

  axios
    .post(url, data, { headers: data.getHeaders() })
    .then(function (response) {
      console.log(
        "REQUEST - " +
          req.route.path +
          " - RESPONSE - " +
          response.status +
          " - " +
          response.statusText
      );
      res.json({ responseData: response.data });
    })
    .catch(function (error) {
      console.log(
        "REQUEST - " +
          req.route.path +
          " - ERROR - " +
          error.response.status +
          " - " +
          error.response.statusText
      );
      console.log(error.response.data);
      res.json({ errorData: error.response.data });
    });
}

app.get("*", function (req, res) {
  res.send("This is the default GET route");
});

app.post("*", function (req, res) {
  res.send("This is the default POST route");
});
