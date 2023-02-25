// import packages
import { XMLParser } from "npm:fast-xml-parser";
import { decode } from "npm:html-entities";
import { parse } from "https://deno.land/std@0.178.0/flags/mod.ts";

// get CLI args
const args = parse(Deno.args);
const inputArg = args['input-path'];		// --input-path="path/to/file"		default: "./EXML/"
const outputArg = args['output-path'];		// --output-path="path/to/file"		default: "./output/"
const fileNameArg = args.filename;			// --filename=Lenni.txt				default: "translation.txt"
const languageArgs = args['_'].map(language => language.toLowerCase());				// english german

// define paths
const exmlDir = inputArg || './EXML/';
const outputDir = outputArg || './output/';
const outputFileName = fileNameArg || 'translation.txt';

// create directories if they don't exist yet
Deno.mkdirSync(exmlDir, { recursive: true });
Deno.mkdirSync(outputDir, { recursive: true });

// initialise global variables
const files = Array.from(Deno.readDirSync(exmlDir));
const langData = new Object;

// set up XML parser
const options = {
	ignoreAttributes: false,
	attributeNamePrefix: "@",
}
const parser = new XMLParser(options);

console.log('Starting')

// loop through EXML files
for (let i = 0; i < files.length; i++) {
	const file = files[i];
	const fullFileName = file.name;
	const fileType = fullFileName.split('.').at(-1);
	if (!file.isFile || fileType?.toLowerCase() != 'exml') continue;
	const fileData = Deno.readTextFileSync(exmlDir + fullFileName);
	const document = parser.parse(fileData);
	const langElements = document.Data.Property.Property;

	// loop over TkLocalisationData sections
	for (let j = 0; j < langElements.length; j++) {
		const locEntryData = langElements[j].Property;
		let langKey;

		// loop over individual lang keys and their assigned values
		for (let k = 0; k < locEntryData.length; k++) {
			const entry = locEntryData[k];
			if (k == 0) {
				langKey = entry['@value'];
				langData[langKey] ??= new Object;
				continue;
			}
			const langValue = entry.Property['@value'];
			if (!langValue) continue;
			const language = entry['@name'];
			if (languageArgs.length && !languageArgs.includes(language.toLowerCase())) continue;
			langData[langKey][language] = decode(langValue, { level: 'xml' });
		}
	}
	console.log(`${i + 1} / ${files.length} (${Math.round(((i + 1) / files.length) * 100)}%) - Processed ${fullFileName}`);
}
const textContent = [];
for (const key in langData) {
	textContent.push(key + '\n')
	Object.values(langData[key]).forEach(item => textContent.push(item + '\n'));
	textContent.push('\n')
}
Deno.writeTextFileSync(outputDir + outputFileName, textContent.join(''))
console.log("done!");