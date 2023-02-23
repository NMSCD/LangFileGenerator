const fs = require('fs');
//const jsdom = require("jsdom");
//const { JSDOM } = jsdom;
const XmlReader = require('xml-reader');
const xmlQuery = require('xml-query');

const exmlDir = './exml/';

// const templateDataStr = fs.readFileSync('./file.json', 'utf8');



fs.readdir(exmlDir, (err, files) => {
	for (const file of files) {
		const fileData = fs.readFileSync(exmlDir + file, 'utf8');
		const dom = XmlReader.parseSync(fileData);
//		const dom = new JSDOM(fileData, { contentType: "text/xml", });
	//	const document = dom.window.document
//		console.log(dom.window.XMLDocument.querySelector('[value="SCAN_NO_TECH"] [name="German"] [name="Value"]'))
		console.log(dom)
	}

});