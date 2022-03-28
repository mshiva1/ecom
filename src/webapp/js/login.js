function checkFor(username,password){
    //TODO check credentials
    console.log(username,password)
    var baseUrl = $("meta[name=baseUrl]").attr("content")
    window.location.replace('products.html')
}
function checkUser(){
    var username=$("#login-form [name=username]").val()
    var password=$("#login-form [name=password]").val()
    checkFor(username,password)
}
function init(){
    $("#login").click(checkUser)
}
$(document).ready(init)