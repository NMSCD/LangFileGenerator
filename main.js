import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.36-alpha/deno-dom-wasm.ts";

const exmlDir = './EXML/';
const files = Deno.readDirSync(exmlDir);

const langData = new Object;

for (const file of files) {
	if (!file.isFile) continue;
	const fullFileName = file.name;
	const fileData = Deno.readTextFileSync(exmlDir + fullFileName);
	const document = new DOMParser().parseFromString(fileData, 'text/html');
	const keyElements = document.querySelectorAll('[name="Id"]');
	for (const keyElement of keyElements) {
		const langKey = keyElement.getAttribute('value');
		const langElements = keyElement.parentElement.querySelectorAll('[name="Value"]');
		langData[langKey] = new Object;
		console.log(langElements.length)
		const languages = new Set();
		for (const element of langElements) {
			const language = element.parentElement.getAttribute('name');
			if (languages.has(language)) break;
			languages.add(language);
			const langValue = element.getAttribute('value');
			if (!langValue) continue;
			langData[langKey][language] = langValue;
		}
	}
}
console.log(langData)