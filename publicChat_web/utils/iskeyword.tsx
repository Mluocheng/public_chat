// 是否是关键字
export function isKeyword(word?: string) {
    if(!word) return false;
    var keywords = ["var", "function", "if", "else", "while", "return", "ALL"].map(i => i.toLocaleLowerCase());
    return keywords.includes(word.toLocaleLowerCase().trim());
}