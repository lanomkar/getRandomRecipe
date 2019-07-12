const express = require("express");
const axios = require("axios");
const path = require("path");
var bodyParser = require("body-parser");
const app = express();
var unirest = require("unirest");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

var data;
function getData() {
  unirest
    .get(
      "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random"
    )
    .header(
      "X-RapidAPI-Host",
      "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com"
    )
    .header(
      "X-RapidAPI-Key",
      "ENTEE_YOUR_RAPID_API_KEY"
    )
    .end(function(result) {
      //console.log(result.body);
      data = result.body;
    });
  return data;
}
var problem = getData();
app.get("/", (req, res) => {
  res.render("index", { data: getData() });
});

const accountSid = "ENTER_YOUR_OWN_TWILIO_ACCOUNT_SID";
const authToken = "ENTER_YOUR_OWN_TWILIO_AUTH_TOKEN";
const client = require("twilio")(accountSid, authToken);
app.post("/getRecipe", (req, res) => {
  console.log(req.body);
  const number = `+91${req.body.number}`;
  client.messages
    .create(
      {
        body: `Title: ${data.recipes[0].title} Instructions${
          data.recipes[0].instructions
        }`,
        from: "+12029155806",
        to: number
      },
      function(err, data) {
        if (err) {
          console.log(err);
        }
      }
    )
    .then(message => console.log(message.sid));
});
app.listen(5000, () => {
  console.log("Server started on port 5000");
});
