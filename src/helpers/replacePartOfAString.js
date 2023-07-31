export default function replaceSymbol(str, symbol, newSymbol) {
    return str.split(symbol).join(newSymbol);
}
