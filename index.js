const ToCsv = require("./sqlite-to-csv");

let filePath = "/Users/saravana-4455/Library/Application Support/Notebook/allResources.db";
let outputPath = "csv";
let sqliteToCsv = new ToCsv()
                    .setFilePath(filePath)
                    .setOutputPath(outputPath);

sqliteToCsv.convert().then( (result) => {
    debugger;
}).catch((err) => {
    debugger;
});

