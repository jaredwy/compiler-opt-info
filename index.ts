const fs = require("fs");
const path = require("path");
const OptTransform = require("./src/OptStreamTransformer.js");

const yamlStream = fs.createReadStream("test.yaml", {encoding: "utf-8" }).pipe(new OptTransform("")).on("data", (x:string) => console.log(x));

