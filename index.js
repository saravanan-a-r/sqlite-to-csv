const ToCsv = require("./src/sqlite-to-csv");

let filePath = "/Users/saravana-4455/Library/Application Support/Notebook/allResources.db";
let outputPath = "csv";
let logPath  = ".";

let sqliteToCsv = new ToCsv()
                    .setFilePath(filePath)
                    .setOutputPath(outputPath)
                    .setLogPath(logPath);

sqliteToCsv.convert().then( (result) => {
    //Converted successfully
}).catch((err) => {
    //Failed to convert
});

