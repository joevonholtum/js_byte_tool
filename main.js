const fs = require("fs");
const parser = require("./utilities/parser");

const program = fs.readFileSync("example.jj");
const programString = program.toString();

console.log("Parsing");
const outputString = parser.parseProgramString(programString);
console.log("Done");

console.log("Saving...");
fs.writeFile("out.js", outputString, (err) => {
    if(err){
        throw err;
    }
    console.log("File saved!");
});