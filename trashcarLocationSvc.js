var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var url = require('url');

module.exports = function(onsuccess, onerror){
    request({
            url: "http://skgps.com.tw/hcctt/HCCTTVehiclePerformsDuties.aspx?District=%E9%A0%AD%E9%87%8D%E9%87%8C",
            method: "GET"
        }, function(error, response, body) {
          	if (!error && response.statusCode != 200){
          		console.log(body);
                onerror(error);
          		return;
            }

            var $ = cheerio.load(body);

            
            var trList = $("#GridView1 > tr");
            //console.log(data);

            var results = [];
            trList.each(function(i, row){    	
            	var tdList = $(row).children("td");
            	if(typeof(tdList) !== 'undefined' && tdList != null & tdList.length > 0){
            		var data = {};    		
            		data.vehicalNumbrPlate = $(tdList[0]).text().trim();
            		data.carId = $(tdList[1]).text().trim();
            		data.type = $(tdList[2]).text().trim();
            		data.range = $(tdList[3]).text().trim();
            		data.location = $(tdList[4]).text().trim();
            		data.time = $(tdList[5]).text().trim();
            		var geoUrl = $(tdList[6]).find("a").first().attr('href');
            		data.geolocation = url.parse(geoUrl, true).query.q;

            		results.push(data);            		
            	}
            });    

            console.log(results);

            onsuccess(results);
            //fs.writeFileSync("result.json", JSON.stringify(result));
        }
    );
};