import { parse } from "https://deno.land/x/xml@2.1.0/mod.ts"

const exmlDir = './EXML/';
const outputDir = './output/';
const outputFileName = 'Lenni.txt';
const files = Deno.readDirSync(exmlDir);
const langData = new Object;

for (const file of files) {
	const fullFileName = file.name;
	const fileType = fullFileName.split('.').at(-1);
	if (!file.isFile || fileType?.toLowerCase() != 'exml') continue;
	const fileData = Deno.readTextFileSync(exmlDir + fullFileName);
	const document = parse(fileData);
	const langElements = document.Data.Property.Property;
	for (const locEntry of langElements) {
		const locEntryData = locEntry.Property;
		let langKey;
		for (let i = 0; i < locEntryData.length; i++) {
			const entry = locEntryData[i];
			if (i == 0) {
				langKey = entry['@value'];
				langData[langKey] ??= new Object;
				continue;
			}
			const langValue = entry.Property['@value'];
			if (langValue == null) continue;
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