# SHA256 HASH TO CVS ROWS ⚙

## Description
Takes the CSV provided by the teams, and generates a CHIP-0007 compatible json, calculates the sha256 of the json file and append it to each line in the csv (as `HNGi9 CSV FILE - Sheet1.output.cvs`)

## Usage
- Paste the CSV file in the root directory.
- Replace `HNGi9 CSV FILE - Sheet1.cvs` on *line 4* of `output-hash-cvs.js` with the name of the CSV file (don't forget the .csv extension).
![usage](usage.png)
- With reasonably latest version of [Node](https://nodejs.org/en/download/) installed, run 
```bash
node .\output-hash-cvs.js
```
- A CSV file, `HNGi9 CSV FILE - Sheet1.output.cvs` will be generated or updated with the sha256 hash at the end of each row. 

An [HNGi9](https://internship.zuri.team/hngi9) backend task.

Built using Node.js

## Deployment N/A