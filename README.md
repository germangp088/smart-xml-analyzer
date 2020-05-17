# Smart-Xml-Analyzer

This crawler allows you to find an website element to compare changes about an especific HTML element.

### Installation

```sh
$ npm install
```
### Run
There are 3 parameter to run this project:
 - INPUT_ORIGIN_FILE (optional): Origin file name, if it's not provided default will be sample-0-origin
 - INPUT_OTHER_FILE: Name of the file to compare.
 - SELECTOR (optional): Selector to find HTML tag element, if it's not provided default will be #make-everything-ok-button
 
Serve static files to a simple http serve
```sh
$ npm run serve
```
Run the crawler
```sh
$ INPUT_OTHER_FILE=sample-1-evil-gemini npm run start
```