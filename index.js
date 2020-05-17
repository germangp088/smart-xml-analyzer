const Crawler = require("crawler");

const selector = process.env.SELECTOR || "#make-everything-ok-button";

let stop = false;

const execCrawler = (findOrigin, originXPath) => {

    const crawler = new Crawler({
        maxConnections : 10,
        callback : (error, res, done) => {
            if(error) {
                console.log(error);
            } else {
                let xPath
                const $ = res.$;
                let xPathTags = [];
                const element = originXPath ? $(originXPath)['0'] : $(selector)['0']
                if(element) {
                    xPathTags.push(`${element.name} > `);
                    let parent = element.parent
                    while (parent) {
                        xPathTags.push(`${parent.name} > `);
                        parent = parent.parent;
                    }
                    xPath = xPathTags.reverse().join("").trim();
                    xPath = xPath.substring(0, xPath.length - 1).trim();
                    // Print xPath when the element is allocated.
                    console.log(xPath);
                    // Print element attributes to compare changes.
                    console.log(`Element attributes: ${JSON.stringify(element.attribs)}`)
                } else {
                    console.log("Tag was not found");
                }
                if(!stop) {
                    stop = true;
                    // Call function recursivelly to reuse code.
                    execCrawler(false, xPath)
                }
            }
            done();
        }
    });

    if(findOrigin){
        // Queue input origin file, if filename is not provided it will take sample-0-origin as default.
        crawler.queue(`http://localhost:8080/${process.env.INPUT_ORIGIN_FILE || 'sample-0-origin'}.html`);
    } else {
        crawler.queue(`http://localhost:8080/${process.env.INPUT_OTHER_FILE}.html`);
    }
}

execCrawler(true);