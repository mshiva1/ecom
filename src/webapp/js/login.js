async function checkFor(username, password) {
    await fetch('../resources/passwords.json')
                           	    .then(response => response.json())
                           	    .then(jsonResponse => passwords=jsonResponse)
    if (passwords[username] == password) {
        await localStorage.setItem("current", username)

        const redirect = new URLSearchParams(window.location.search).get('redirect');
        if (redirect == undefined)
            window.location.replace('products.html')
        else
            window.location.replace(redirect)
    }
    else {
        $("#wrong-cred-message").html("Wrong Credentials");
        //TODO show wrong credentials
    }
}
function checkUser() {
    console.log("user")
    var username = $("#login-form [name=username]").val()
    var password = $("#login-form [name=password]").val()
    checkFor(username, password)
}
function getObject(id, name, img, price, description) {
    var retval = {};
    retval["id"] = id;
    retval["name"] = name;
    retval["img"] = img;
    retval["price"] = price;
    retval["description"] = description;
    retval["quantity"] = 0;
    return retval;
}
function logOutIfRequired() {
    if (localStorage.getItem("current") != undefined)
        logOut()
    //TODO show successful logout message
}
function init() {
    logOutIfRequired()
    $("#login").click(checkUser);
}
$(document).ready(init)