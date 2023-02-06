const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("build"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + `\\newsletter.html`);
})

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  }

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/1482f419a1";
  const options = {
    method: "POST",
    auth: "astroAPI:dfb5efcedda7166b10feba355cec832a-us21"
  }

  const request = https.request(url, options, (response) => {
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    })

    if (response.statusCode == 200) {
      res.sendFile(__dirname + `\\success.html`);
    } else {
      res.sendFile(__dirname + `\\failure.html`);
    }
  })

  request.write(jsonData);
  request.end();
})

app.post("/failure", (req, res) => {
  res.redirect("/");
})

app.listen(3000, () => {
  console.log("Server has started on port 3000.")
}) // This listens to a specific port for any HTTP request that gets sent to our server.

// Audience ID / Lists ID
// 1482f419a1

// API key
// dfb5efcedda7166b10feba355cec832a-us21