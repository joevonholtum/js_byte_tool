const tokenize = (symbol, id) => {
    const token = symbol.toString();
    if(id === "byte"){
        return `0x${token}, `;
    }

    if(id === "lastByte"){
        return `0x${token}])`
    }

    if(id === "assign"){
        return " = Buffer.from([";
    }

    if(id === "identifier"){
        return token;
    }

    if(id === "terminator"){
        return token;
    }  
};

module.exports.tokenize = tokenize;