// import XML parser
import { XMLParser } from "npm:fast-xml-parser"

// define paths
const exmlDir = './EXML/';
const outputDir = './output/';
const outputFileName = 'translation.txt';

// create directories if they don't exist yet
Deno.mkdirSync(exmlDir, { recursive: true });
Deno.mkdirSync(outputDir, { recursive: true });

// initialise global variables
const files = Deno.readDirSync(exmlDir);
const langData = new Object;

// set up XML parser
const options = {
	ignoreAttributes: false,
	attributeNamePrefix: "@",
}
const parser = new XMLParser(options);

// loop through EXML files
for (const file of files) {
	const fullFileName = file.name;
	const fileType = fullFileName.split('.').at(-1);
	if (!file.isFile || fileType?.toLowerCase() != 'exml') continue;
	const fileData = Deno.readTextFileSync(exmlDir + fullFileName);
	const document = parser.parse(fileData);
	const langElements = document.Data.Property.Property;

	// loop over TkLocalisationData sections
	for (let i = 0; i < langElements.length; i++) {
		const locEntryData = langElements[i].Property;
		let langKey;

		// loop over individual lang keys and their assigned values
		for (let j = 0; j < locEntryData.length; j++) {
			const entry = locEntryData[j];
			if (j == 0) {
				langKey = entry['@value'];
				langData[langKey] ??= new Object;
				continue;
			}
			const langValue = entry.Property['@value'];
			if (!langValue) continue;
			const language = entry['@name'];
			langData[langKey][language] = langValue.replaceAll('&#xA;', '\n');
		}
	}
	console.log(`Processed ${fullFileName}`);
}
const textContent = [];
for (const key in langData) {
	textContent.push(key + '\n')
	Object.values(langData[key]).forEach(item => textContent.push(item + '\n'));
	textContent.push('\n')
}
Deno.writeTextFileSync(outputDir + outputFileName, textContent.join(''))
console.log("done!");