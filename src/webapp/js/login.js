//access file and check for username and password
async function checkFor(username, password) {
    await fetch('../resources/passwords.json')
        .then(response => response.json())
        .then(jsonResponse => passwords = jsonResponse)
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
    }
}

//validation function
function checkUser() {
    var username = $("#login-form [name=username]").val()
    var password = $("#login-form [name=password]").val()
    checkFor(username, password)
}

//if page is accessed with user logged in Logout happens automatically
function logOutIfRequired() {
    if (localStorage.getItem("current") != undefined) {
        localStorage.removeItem("current")
        notify("Logout Success", "logout-success", 5000, "User Logged out Sucessfully. Login Again", "green")
    }
}

function init() {
    logOutIfRequired()
    $("#login").click(checkUser);
}
$(document).ready(init)