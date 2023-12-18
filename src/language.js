function GetString(name){
    const strings = require("./strings.json");
    return strings[name][localStorage.getItem('lang')]
}
export default GetString;