const cheerio = require('cheerio');
const fs = require('fs');
const request = require('request');



request('https://senati.blackboard.com/',(err, res, body)=>{
    if(!err && res.statusCode == 200){
        console.log(body);
    }
})

