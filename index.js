//jshint esversion: 6
const express = require("express");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const config = require("./config.js");

mailchimp.setConfig({
    apiKey: "266202acef5223981206d03b336ffe10-us21",
    server: "us21",
  });

const app = express();

app.use(express.urlencoded({extended: true}));

app.use("/public",express.static(__dirname+"/public"))

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});


app.post("/", async function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    
    const response = await mailchimp.lists.batchListMembers("baad25f1ce", {
      members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }],
    });
    if(response.error_count === 0){
        res.sendFile(__dirname + "/failure.html");
    }
    else{
        res.sendFile(__dirname + "/success.html")
    }
})

app.listen(process.env.PORT || 3000, function() {
    console.log("server running on port 3000");
});

// ListID
// baad25f1ce