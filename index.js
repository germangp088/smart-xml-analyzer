const Crawler = require("crawler");

const selector = process.env.SELECTOR || "#make-everything-ok-button";
 
const c = new Crawler({
    maxConnections : 10,
    callback : (error, res, done) => {
        if(error){
            console.log(error);
        }else{
            const $ = res.$;
            let xPathTags = [];
            if($(selector)['0']) {
                xPathTags.push(`${$(selector)['0'].name} > `);
                let parent = $(selector)['0'].parent
                while (parent) {
                    xPathTags.push(`${parent.name} > `);
                    parent = parent.parent;
                }
                let xPath = xPathTags.reverse().join("").trim();
                xPath = xPath.substring(0, xPath.length - 1).trim();
                console.log(xPath);
            } else {
                console.log("Tag was not found");
            }
        }
        done();
    }
});

// Queue input origin file, if filename is not provided it will take sample-0-origin as default.
c.queue(`http://localhost:8080/${process.env.INPUT_ORIGIN_FILE || 'sample-0-origin'}.html`);

c.queue(`http://localhost:8080/${process.env.INPUT_OTHER_FILE}.html`);