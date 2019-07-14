//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.sendFile(__dirname + "/signup.html"));
app.post("/", (req, res) => {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;

    let data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };

    let jsonData = JSON.stringify(data);

    let options = {
        url: "https://us3.api.mailchimp.com/3.0/lists/f8985ed941",
        method: "POST",
        headers: {
            "Authorization": "Ren cc4d921c83823486324b618e0431edc3-us3"
        },
        body: jsonData
    };

    request(options, (error, response, body) => {
        if (error) {
            res.sendFile(__dirname + "/failure.html");
        } else {
            res.sendFile(__dirname + "/success.html");
        }
    });
});

app.post("/failure", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || "3000", _ => console.log("server 3000 running"));