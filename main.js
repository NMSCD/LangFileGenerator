import { parse } from "https://deno.land/x/xml@2.1.0/mod.ts"

const exmlDir = './EXML/';
const files = Deno.readDirSync(exmlDir);
const langData = new Object;

for (const file of files) {
	if (!file.isFile) continue;
	const fullFileName = file.name;
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
			langData[langKey][language] = langValue;
		}
	}
}
console.log(langData)