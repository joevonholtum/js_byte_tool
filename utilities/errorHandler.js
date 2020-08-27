const reportError = (symbol, idx) => {
    throw new SyntaxError(`Unexpected symbol "${symbol.toString()}" at string position ${idx + 1}.`);
};

module.exports.reportError = reportError;