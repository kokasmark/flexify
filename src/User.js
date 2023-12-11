var token = ''
var username = ''

function getUserToken(){
    return token;
}
function setUserToken(tokenToSet){
    token = tokenToSet;
}
export {getUserToken,setUserToken};