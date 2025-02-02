## Summary

This script can generate combined and simplified language files for No Man's Sky.

Resulting files can be seen in the [language archive](https://github.com/NMSCD/de-en-lang-archive).

## How to use
1. Put your MXML files into the "MXML" folder (create it if it doesn't exist yet)
2. Double click the exe file

### Command Line Arguments

You can optionally run it from the command line and specify additional arguments:

`--input-path`: Specifies the path to the folder with the MXML files. Default: "./MXML/"

`--output-path`: Specifies the path to the folder with the resulting combined file. Default: "./output/"

`--filename`: Specifies the filename of the resulting combined file. Default: "translation.txt"

`--timer`: Tells you how much time the script execution took when finished.

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

For example, this would give the English and German translations in all files in the "input directory" folder next to the LangFileGenerator.exe file. It would then generate the resulting "Lenni.txt" in the "output directory" folder:

```bat
LangFileGenerator.exe --input-path="./input directory/" --output-path="./output directory/" --filename="Lenni.txt" english german
```

Note that you must have the necessary language files decompiled in order to use this script. You can't get a German translation without the German files.

## How to build from source

[Install Deno](https://deno.land/manual@v1.31.0/getting_started/installation)

Run this command:

```bat
deno task build
```
