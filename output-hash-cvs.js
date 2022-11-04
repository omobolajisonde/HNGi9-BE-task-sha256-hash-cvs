const fs = require("fs"); // imports the built in file system module
const crypto = require("crypto"); // imports the built in crypto module

const inputCSVFile = `${__dirname}/HNGi9 CSV FILE - Sheet1.csv`; // the CSV file provided by the teams
const outputCSVFile = `${__dirname}/HNGi9 CSV FILE - Sheet1.output.csv`; // the CSV file to be generated or updated with the sha256 hashes

// A function that parses the attributes string and returns an array of objects (the attributes)
const genAttrArr = (str) => {
  const attributes = str.split("; ");
  const arr = attributes.map((attr) => {
    attr_kv = attr.split(": ");
    const obj = {};
    obj.trait_type = attr_kv[0];
    obj.value = attr_kv[1];
    return obj;
  });
  return arr;
};

// const getSeriesTotal = (arr) => {
//   let total = 0;
//   for (let i = 1; i < arr.length; i++) {
//     if (arr[i].includes(",,,,,,")) continue;
//     total += 1;
//   }
//   return total;
// };

fs.readFile(inputCSVFile, "utf8", (err, data) => {
  if (err) return err;
  const array = data.split("\r"); // splits the data by carriage return
  const series_total = array.length - 1; // gets the series total from the length of the array minus the headers row
  array[0] = array[0] + ",Hash"; // Adds the Hash column
  let TEAM_NAME = "";
  for (let i = 1; i < array.length; i++) {
    // loops over the remaining rows (basically excluding the headers)
    const obj = {};
    const rowStr = array[i];
    if (rowStr.includes(",,,,,,")) {
      array[i] = rowStr + ","; // adds an empty cell to demarcating rows or rows with title
      continue;
    }
    let formattedRowStr = "";
    let flag = 0;
    // Replacing , with |. But only for commas btw cells not those in quotes (cells with comma separated values)
    for (let char of rowStr) {
      if (char === '"' && flag === 0) {
        flag = 1;
      } else if (char === '"' && flag === 1) {
        flag = 0;
      }
      if (char === "," && flag === 0) char = "|";
      if (char !== '"') formattedRowStr += char;
    }
    const properties = formattedRowStr.split("|"); // spliting row string by |
    TEAM_NAME = properties[0].slice(1) || TEAM_NAME; // Setting the current team name
    obj.format = "CHIP-0007";
    obj.name = properties[2];
    obj.description = properties[4];
    obj.minting_tool = TEAM_NAME;
    obj.sensitive_content = false;
    obj.series_number = properties[1];
    obj.series_total = series_total;
    obj.attributes = genAttrArr(properties[6]);
    obj.collection = {
      name: "Zuri NFT Tickets for Free Lunch",
      id: "b774f676-c1d5-422e-beed-00ef5510c64d",
      attributes: [
        {
          type: "description",
          value: "Rewards for accomplishments during HNGi9.",
        },
      ],
    };
    // if (i === 1) console.log(JSON.stringify(obj)); // prints the CHIP-0007 JSON format of the first row
    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(obj))
      .digest("hex"); // generates the sha256 of the json file
    array[i] = rowStr + `,${hash}`; // appends it to each line in the csv
  }
  const outputData = array.join("\r");
  fs.writeFileSync(outputCSVFile, outputData, "utf8");
});
