const patterns = require("./patterns");
const tokenizer = require("./tokenizer");
const errorHandler = require("./errorHandler");

let outputString = "";

const makeSymbol = (chr) => ({
    chr,
    is(pattern){
        return pattern.test(this.chr);
    },
    toString(){
        return this.chr;
    }
});

const isBufferSign = (chr) => {
    return chr === "@";
};

const lookahead = (str, idx) => {
    return str.charAt(idx + 1);
};

const makeBufferInitialization = (bufStr) => {
    let currentLexeme = "";
    let interimString = "";
    let leftSide = false;
    for(let i = 0; i < bufStr.length; ++i){
        const symbol = makeSymbol(bufStr.charAt(i));
        const nextSymbol = makeSymbol(lookahead(bufStr, i));
        if(symbol.is(patterns.byte) && leftSide){
            currentLexeme += symbol.toString();
            if(!nextSymbol.is(patterns.byte) && !nextSymbol.is(patterns.whitespace) && !nextSymbol.is(patterns.terminator)){
                errorHandler.reportError(nextSymbol, i);
            }
            else if(nextSymbol.is(patterns.whitespace)){
                if(currentLexeme.length !== 2){
                    throw("Invalid byte declaration");
                }
                interimString += tokenizer.tokenize(currentLexeme, "byte");
                currentLexeme = "";
            }
            else if(nextSymbol.is(patterns.terminator)){
                if(currentLexeme.length !== 2){
                    throw("Invalid byte declaration");
                }
                interimString += tokenizer.tokenize(currentLexeme, "lastByte");
                currentLexeme = "";
            }
        }
        else if(symbol.is(patterns.bufferSign)){
            if(!nextSymbol.is(patterns.whitespace)){
                errorHandler.reportError(nextSymbol, i);
            }
            else{
                interimString += "const ";
            }

        }

        else if(symbol.is(patterns.letter)){
            currentLexeme += symbol.toString();
            if(!nextSymbol.is(patterns.whitespace) && !nextSymbol.is(patterns.letter)){
                errorHandler.reportError(nextSymbol, i);
            }
            else if(nextSymbol.is(patterns.whitespace)){
                interimString += tokenizer.tokenize(currentLexeme, "identifier");
                currentLexeme = "";
            }
        }

        else if(symbol.is(patterns.assignment)){
            if(!nextSymbol.is(patterns.whitespace)){
                errorHandler.reportError(nextSymbol, i);
            }
            else{
                interimString += tokenizer.tokenize(symbol, "assign");
                leftSide = true;
            }
        }

        else if(symbol.is(patterns.terminator)){
            interimString += tokenizer.tokenize(symbol, "terminator");
        }
    }
    return interimString;
};

const parseProgramString = (programString) => {
    console.log("Okay");
    console.log(programString.length);
    for(let i = 0; i < programString.length; ++i){
        if(isBufferSign(programString.charAt(i))){
            const endIdx = programString.indexOf(";", i);
            const bufferString = programString.substring(i, endIdx + 1);
            outputString += makeBufferInitialization(bufferString);
            //We want to advance to the end of this line so we don't process it twice
            i = endIdx;
        }
        else{
            outputString += programString.charAt(i);
        }
    }
    return outputString;
};

module.exports.parseProgramString = parseProgramString;