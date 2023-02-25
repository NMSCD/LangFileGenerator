## Summary

This script can generate combined and simplified language files for No Man's
Sky.

## How to use

1. [Install Deno](https://deno.land/manual@v1.31.0/getting_started/installation)
2. Put your EXML files into the "EXML" folder (create it if it doesn't exist
   yet)
3. Execute the script in the directory by using this command:

```bat
deno run --allow-read --allow-write .\main.js
```

## Command Line Arguments

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