#sqlite3-to-csv

###### - This will export the given sqlite3 database into a set of csv files.
###### - A separate csv file will be created for the every table.

# Installation
You can use `npm` to download and install:
- `npm install sqlite3-to-csv`

#API
> ###  toCSV(argsObj, errCallback)

###### - argsObj : 
```
{
		filePath : <file path of your sqlite3 database which you want to export as csv>,
		outputPath : <file path where your exported csv files will store>
}```

###### - errCallback function: This function will invoke with "error" status as its first parameter incase of error occur while converting sqlite3 db into csv files.

# Usage
```
const sqliteToCsv = require("sqlite3-to-csv");
var args = {
    filePath : "mysqlite3.db",
    outputPath : "filepath/mycsv"
};

sqliteToCsv.toCSV(args, (err) => {
	/* This function will invoke incase of error occurred with error status.
	Please refer below mentioned error code */
    console.log(err);
});
```

# Error handling
| Error code  |  Reason |
| ------------ | ------------ |
|  ERR100 | Input database file not found |
|  ERR101 | Failed to open given database with read only mode |
| ERR102  | filePath params missing in first argument of toCSV() |
| ERR103  | outputPath params missing in first argument of toCSV()  |
| ERR104  | Failed to write to csv file |
| WRN200  | Warning :Output path director not found. Default folder named "csv" is created in current working directory |