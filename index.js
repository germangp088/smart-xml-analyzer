if(!process.env.INPUT_OTHER_FILE) {
    throw new Error("You must especify a INPUT_OTHER_FILE")
}

const Crawler = require("crawler");

// If a selector is not provided it will take a default.
const selector = process.env.SELECTOR || "#make-everything-ok-button";

//Flag to stop the recursive execution.
let stop = false;

let originalElement;

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

                if(findOrigin){
                    originalElement = element
                }

                if(element) {
                    xPathTags.push(`${element.name} > `);
                    let parent = element.parent
                    while (parent) {
                        xPathTags.push(`${parent.name} > `);
                        parent = parent.parent;
                    }
                    // Parse the output string as asked.
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
                } else {
                    const findDifferences = (originalElementStr, elementStr) =>{
                        const originalElement = JSON.parse(originalElementStr);
                        const element = JSON.parse(elementStr);

                        const differences = [];

                        const addDiff = (el1, el2, attr) => {
                            if(el1[attr] !== el2[attr]) {
                                differences.push(`Attibute: ${attr}, Value: ${el2[attr]}`);

                            }
                        }

                        addDiff(originalElement, element, "class");
                        addDiff(originalElement, element, "title");
                        addDiff(originalElement, element, "rel");
                        addDiff(originalElement, element, "href");
                        addDiff(originalElement, element, "onclick");

                        return differences;
                    }
                    
                    const differences = findDifferences(JSON.stringify(originalElement.attribs), JSON.stringify(element.attribs));
                    console.log(`Differences: ${differences}`)
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