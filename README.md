# sqlite-to-csv

An utility Node JS module which will convert the given sqlite3 database (.db file) into a set of csv files. For each table in a database, a csv file will be created with the name same as the table name.

# Installation
You can use `npm` to download and install:

> npm install sqlite3-to-csv

# API Documentation

This module built using Builder design pattern. For more information about the Builder design pattern, [click here](https://medium.com/@sararavi14/builder-design-pattern-in-node-js-c942ac7354a9)

    1) <ToCsv class instance>.setFilePath(<sqlite3 db file path>)
   This method **setFilePath()** will set the sqlite3 db file path which we are gonna convert to a set of csv files.

    2) <ToCsv class instance>.setOutputPath(<csv file output path>)
   This method **setOutputPath()** will set the output path. This module will store the converted csv files here. If the given path is not valid, the default **./csv** folder will be created in the current working directory.

 

    3) <ToCsv class instance>.setLogPath(<log directory>)

This method **setLogpath()** will set the log directory path where the sqliteToCsv.log file will be created. If the log directory path is not valid, error messages are logged in console.
    
    4) <ToCsv class instance>.convert()
This method **convert()** will convert the .db files into .csv files and return promise object.
    
# Example

Using Builder design pattern,

    const ToCsv  =  require("sqlite-to-csv");
    let filePath  =  "./mydata.db";
    let outputPath  =  "./output_csv";
    let logPath  =  ".";
    let sqliteToCsv  =  new ToCsv()
			    .setFilePath(filePath)
			    .setOutputPath(outputPath)
			    .setLogPath(logPath);
	sqliteToCsv.convert().then( (result) => {
		//Converted successfully
	}).catch((err) => {
		//Failed to convert
	});

Without using Builder design pattern,
     
    const ToCsv  =  require("sqlite-to-csv");
    let filePath  =  "./mydata.db";
    let outputPath  =  "./output_csv";
    let logPath  =  ".";
	let sqliteToCsv  =  new ToCsv(filePath, outputPath, logPath);
	sqliteToCsv.convert().then( (result) => {
		//Converted successfully
	}).catch((err) => {
		//Failed to convert
	});
   
 



# Error handling
| Error code | Reason |
|--|--|
| ERR100 | Input database file not found |
| ERR101 | Failed to open given database with read only mode |
| ERR102 | filePath params missing in the first argument of toCsv() |
| ERR103 | outputPath params missing in the first argument of toCsv() |
| ERR104 | failed to write to CSV file |
| WRN200 | Warning: Output path directory not found. Default folder named "csv" is created in the current working directory |

# Testing

This module require mocha, chai and sinon for testing,

> npm install mocha chai sinon

Then, run mocha,

> npm test

