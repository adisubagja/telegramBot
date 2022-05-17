const getBranchName = (string) =>{
    return string.replace("refs/heads/","");
}
module.exports = {
    getBranchName
}