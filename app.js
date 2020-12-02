const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  let firstName = req.body.fname;
  let lastName = req.body.lname;
  let email = req.body.email;

  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  let jsonData = JSON.stringify(data);

  const url = "https://us7.api.mailchimp.com/3.0/lists/fd4868450e";

  const options = {
    method: "POST",
    auth: "adi:645bec17b2a67fba43c663866124ed1d-us7",
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode == 200) res.sendFile(__dirname + "/success.html");
    else res.sendFile(__dirname + "/failure.html");

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.use("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running at port 3000");
});
