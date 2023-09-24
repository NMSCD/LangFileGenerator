// import packages
import { XMLParser } from "npm:fast-xml-parser";
import { decode } from "npm:html-entities";
import { parse } from "flags";

// get CLI args
const args = parse(Deno.args);
const exmlDir: string = args['input-path'] || './EXML/';			// --input-path="path/to/file"		default: "./EXML/"
const outputDir: string = args['output-path'] || './output/';		// --output-path="path/to/file"		default: "./output/"
const outputFileName: string = args.filename || 'translation.txt';	// --filename=Lenni.txt				default: "translation.txt"
const languageArgs = args['_'].map(language => language.toString().toLowerCase());		// english german -- this needs the .toString() method because TS would complain
const timer: boolean = args.timer;

// create directories if they don't exist yet
Deno.mkdirSync(exmlDir, { recursive: true });
Deno.mkdirSync(outputDir, { recursive: true });

// set up interfaces
interface Xml {
	'@version': string;
	'@encoding': string;
}

interface LangObj {
	"@name": string;
	"@value": string;
	Property?: {
		"@name": string;
		"@value": string;
	};
}

interface TkLocalisationEntry {
	Property: Array<LangObj>;
	"@value": string;
}

interface Data {
	Property: {
		Property: TkLocalisationEntry[];
		"@name": string;
	}
	"@template": string;
}

interface RootObject {
	'?xml': Xml;
	Data: Data;
}

interface LangData {
	[key: string]: Partial<{
		[key: string]: string;
	}>;
}

// initialise global variables
const files = Array.from(Deno.readDirSync(exmlDir)).filter(file => file.isFile && file.name.toLowerCase().endsWith('.exml'));
const langData: LangData = {};

// set up XML parser
const options = {
	ignoreAttributes: false,
	attributeNamePrefix: "@",
}
const parser = new XMLParser(options);

if (timer) console.time('Total time');
console.log('Starting');

// loop through EXML files
for (let i = 0; i < files.length; i++) {
	const file = files[i];
	const fullFileName = file.name;
	const fileData = Deno.readTextFileSync(exmlDir + fullFileName);
	const document: RootObject = parser.parse(fileData);
	const langElements = document.Data.Property.Property;

	// loop over TkLocalisationData sections
	for (const locEntry of langElements) {
		const locEntryData = locEntry.Property;
		let langKey: string;

		// loop over individual lang keys and their assigned values
		for (let k = 0; k < locEntryData.length; k++) {
			const entry = locEntryData[k];
			if (k == 0) {
				langKey = entry['@value'];
				langData[langKey] ??= {};
				continue;
			}
			if (!entry?.Property) continue;
			const langValue = entry.Property['@value'];
			if (!langValue) continue;
			const language = entry['@name'];
			if (languageArgs.length && !languageArgs.includes(language.toLowerCase())) continue;
			langData[langKey!][language] = decode(langValue, { level: 'xml' });	// NoSonar this is necessary, for some reason TS complains here :shrug:
		}
	}
	console.log(`${i + 1} / ${files.length} (${Math.round(((i + 1) / files.length) * 100)}%) - Processed ${fullFileName}`);	// NoSonar this is just percentage calculation
}
const textContent = [];
for (const key in langData) {
	textContent.push(key + '\n');
	Object.values(langData[key]).forEach(item => textContent.push(item + '\n'));
	textContent.push('\n');
}
Deno.writeTextFileSync(outputDir + outputFileName, textContent.join('').trim());
console.log("done!");
if (timer) console.timeEnd('Total time');
