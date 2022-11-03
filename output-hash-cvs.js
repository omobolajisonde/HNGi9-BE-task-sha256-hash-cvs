const fs = require("fs");
const crypto = require("crypto");

const inputCSVFile = `${__dirname}/HNGi9 CSV FILE - Sheet1.csv`;
const outputCSVFile = `${__dirname}/HNGi9 CSV FILE - Sheet1.output.csv`;

const genAttrObj = (str) => {
  const obj = {};
  const attributes = str.split(", ");
  attributes.forEach((attr) => {
    attr_kv = attr.split(": ");
    obj[attr_kv[0]] = attr_kv[1];
  });
  return obj;
};

const getSeriesTotal = (arr) => {
  let total = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].includes(",,,,,,")) continue;
    total += 1;
  }
  return total;
};

fs.readFile(inputCSVFile, "utf8", (err, data) => {
  if (err) return err;
  const array = data.split("\r"); // splits the data by carriage return
  const series_total = getSeriesTotal(array); // gets the series total
  array[0] = array[0] + ",Hash"; // Adds the Hash column
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
    obj.format = "CHIP-0007";
    obj.name = properties[1];
    obj.description = properties[3];
    obj.minting_tool = properties[-1] || "";
    obj.sensitive_content = properties[-1] || false;
    obj.series_number = properties[0].slice(1);
    obj.series_total = series_total;
    obj.attributes = genAttrObj(properties[5]);
    obj.collection = {
      name: properties[1],
      id: properties[6],
      attributes: [],
    };
    obj.data = { example_data: properties[-1] || "" };
    const hash = crypto
      .createHash("sha256")
      .update(JSON.stringify(obj))
      .digest("hex"); // generates the sha256 of the json file
    array[i] = rowStr + `,${hash}`; // appends it to each line in the csv
  }
  const outputData = array.join("\r");
  fs.writeFileSync(outputCSVFile, outputData, "utf8");
});
