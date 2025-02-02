// import packages
import { XMLParser } from "npm:fast-xml-parser";
import { decode } from "npm:html-entities";
import { parseArgs as parse } from "@std/cli/parse-args";
// get CLI args
const args = parse(Deno.args);
const mxmlDir: string = args["input-path"] || "./MXML/"; // --input-path="path/to/file"		default: "./MXML/"
const outputDir: string = args["output-path"] || "./output/"; // --output-path="path/to/file"		default: "./output/"
const outputFileName: string = args.filename || "translation.txt"; // --filename=Lenni.txt				default: "translation.txt"
const languageArgs = args["_"].map((language) =>
  language.toString().toLowerCase()
); // english german -- this needs the .toString() method because TS would complain
const timer: boolean = args.timer;

// create directories if they don't exist yet
Deno.mkdirSync(mxmlDir, { recursive: true });
Deno.mkdirSync(outputDir, { recursive: true });

// set up interfaces
interface Xml {
  "@version": string;
  "@encoding": string;
}

// newer MBINCompiler versions (> 4.70) do not have the additional "Property"
interface LocEntry {
  "@name": string;
  "@value": string;
  Property?: {
    "@name": string;
    "@value": string;
  };
}

interface TkLocalisationEntry {
  Property: Array<LocEntry>;
  "@value": string;
}

interface Data {
  Property: {
    Property: TkLocalisationEntry[];
    "@name": string;
  };
  "@template": string;
}

interface RootObject {
  "?xml": Xml;
  Data: Data;
}

interface LangData {
  [key: string]: {
    [key: string]: string;
  };
}

// initialise global variables
const files = Array.from(Deno.readDirSync(mxmlDir)).filter(
  (file) => file.isFile && file.name.toLowerCase().endsWith(".mxml")
);
const langData: LangData = {};

// set up XML parser
const options = {
  ignoreAttributes: false,
  attributeNamePrefix: "@",
};
const parser = new XMLParser(options);

if (timer) console.time("Total time");
console.log("Starting");

// loop through MXML files
for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const fullFileName = file.name;
  const fileData = Deno.readTextFileSync(mxmlDir + fullFileName);
  const document: RootObject = parser.parse(fileData);
  const langElements = document.Data.Property.Property;

  // loop over TkLocalisationData sections
  for (const locEntry of langElements) {
    const locEntryData = locEntry.Property;
    const langKey = locEntryData[0]["@value"];
    langData[langKey] ??= {};

    // loop over individual lang keys and their assigned values
    // we're skipping index 0 since that's the langkey and already covered above
    for (let j = 1; j < locEntryData.length; j++) {
      const entry = locEntryData[j];
      const language = entry["@name"];
      if (languageArgs.length && !languageArgs.includes(language.toLowerCase()))
        continue;
      const langValue = entry.Property
        ? entry.Property["@value"]
        : entry["@value"];
      if (!langValue) continue;
      langData[langKey][language] = decode(langValue, { level: "xml" });
    }
  }
  console.log(
    `${i + 1} / ${files.length} (${Math.round(
      ((i + 1) / files.length) * 100
    )}%) - Processed ${fullFileName}`
  );
}
const textContent = [];
for (const key in langData) {
  textContent.push(key + "\n");
  Object.values(langData[key]).forEach((item) => textContent.push(item + "\n"));
  textContent.push("\n");
}
Deno.writeTextFileSync(outputDir + outputFileName, textContent.join("").trim());
console.log("done!");
if (timer) console.timeEnd("Total time");
