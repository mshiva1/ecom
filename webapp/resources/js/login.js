//access file and check for username and password
async function checkFor(username, password) {
    await fetch('../resources/passwords.json')
        .then(response => response.json())
        .then(jsonResponse => passwords = jsonResponse)
    var currentUserObject = passwords.find(o => o.username == username)
    if (currentUserObject != undefined && currentUserObject.password == password) {
        await localStorage.setItem("currentUser", username)

        const redirect = new URLSearchParams(window.location.search).get('redirect');
        if (redirect == undefined)
            window.location.replace('products.html')
        else
            window.location.replace(redirect)
    }
    else {
        $("#wrong-cred-message").html("Wrong Credentials");
    }
    return false
}

//validation function
function checkUser(event) {
    var username = $("#login-form [name=username]").val()
    var password = $("#login-form [name=password]").val()
    checkFor(username, password)
}

//if page is accessed with user logged in Logout happens automatically
function logOutIfRequired() {
    if (localStorage.getItem("currentUser") != null) {
        localStorage.removeItem("currentUser")
        notify("Success", "logout-success", 5000, "User Logged out Successfully")
    }
}

function init() {
    logOutIfRequired()
    $("#login-form").submit(function () { checkUser(); return false; });
}
$(document).ready(init)