## Summary

This script can generate combined and simplified language files for No Man's Sky.

Resulting files can be seen in the [language archive](https://github.com/NMSCD/de-en-lang-archive).

## How to use

1. [Install Deno](https://deno.land/manual@v1.31.0/getting_started/installation)
2. Put your EXML files into the "EXML" folder (create it if it doesn't exist
   yet)
3. Execute the script in the directory by using this command:

```bat
deno run --allow-read --allow-write .\main.js
```

### Command Line Arguments

`--input-path`: Specifies the path to the folder with the EXML files. Default: "./EXML/"

`--output-path`: Specifies the path to the folder with the resulting combined file. Default: "./output/"

`--filename`: Specifies the filename of the resulting combined file. Default: "translation.txt"

Specific languages: Write languages that you want to have listed in your combined file. No prefix required. Case insensitive.  
Valid values:
- English
- French
- Italian
- German
- Spanish
- Russian
- Polish
- Dutch
- Portuguese
- LatinAmericanSpanish
- BrazilianPortuguese
- SimplifiedChinese
- TraditionalChinese
- TencentChinese
- Korean
- Japanese
- USEnglish

For example, this would give the English and German translations in all files in the "input directory" folder next to the main.js file. It would then generate the resulting "Lenni.txt" in the "output directory" folder:
```bat
deno run --allow-read --allow-write .\main.js --input-path="./input directory/" --output-path="./output directory/" --filename="Lenni.txt" english german
```

Note that you must have the necessary language files decompiled in order to use this script. You can't get a German translation without the German files.
