let request=require("request");
let cheerio=require("cheerio");
const fs = require("fs");
let $;
//intialise empty object
let data={}
function linkGenerator(error,response,body){
    if(!error){
        $=cheerio.load(body);
        //loading all the records
        let allInfo=$(".movies__main.latest-center.mClearfix .card .text--bold.palewhite.title");
        for(let i=0;i<allInfo.length;i++){
            let name=$(allInfo[i]).text().trim();
            let link="https://yts.rs"+$(allInfo[i]).attr("href");
            movieinfo(name,link)
        }
    }
}
//getting movie info
function movieinfo(name,url){
    request(url,function(error,response,body){
        if(!error){
            $=cheerio.load(body);
            let movieInfo=$(".col-xs-10.col-sm-14.col-md-7.col-lg-8.col-lg-offset-1.movie-info.text--white");
            let heading=movieInfo.find("div");
            let topinfo=heading[0].children;
            let moviename=$(topinfo[0]).text();
            let year=$(topinfo[1]).text();
            let Genre=$(topinfo[2]).text();
            let bottominfo=$(".bottom-info .rating-row");
            let imbd=(bottominfo[1]).children;
            let imbdlink=$(imbd).attr("href");
            let imbdrating=$(imbd).text().trim();
            //setting it in the object
            if(!data[name]){
                data[name]=[{
                    name:moviename,
                    year:year,
                    Genre:Genre,
                    Link:imbdlink,
                    Rating:imbdrating
                }]
            }
            else{
                data[name].push({
                    name:moviename,
                    year:year,
                    Genre:Genre,
                    Link:imbdlink,
                    Rating:imbdrating
                })
            }
            fs.writeFileSync("data.json",JSON.stringify(data));
        }
    })
}
request("https://yts.rs/",linkGenerator)
