
const Crawler = require("crawler");

const selector = process.env.SELECTOR || "#make-everything-ok-button";
 
const c = new Crawler({
    maxConnections : 10,
    // This will be called for each crawled page
    callback : function (error, res, done) {
        if(error){
            console.log(error);
        }else{
            const $ = res.$;
            console.log($(selector).text());
        }
        done();
    }
});

// Queue just one URL, with default callback
c.queue(`http://localhost:8080/${process.env.INPUT_ORIGIN_FILE || 'sample-0-origin'}.html`);