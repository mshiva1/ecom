function checkFor(username, password) {
    console.log("checkFor")
    passwords = JSON.parse(localStorage.getItem("passwords"))
    if (passwords[username] == password) {
        localStorage.setItem("current", username)

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
function loadUsers() {
    passwords = {}
    passwords["user1"] = "password1";
    passwords["user2"] = "password2";
    passwords["user3"] = "password3";
    localStorage.setItem("passwords", JSON.stringify(passwords))

    cart = {}
    cart["user1"] = {};
    cart["user2"] = {};
    cart["user3"] = {};
    localStorage.setItem("cart", JSON.stringify(cart))

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
function loadProducts() {
    items = []
    items.push(getObject(1, "Lays", "https://m.media-amazon.com/images/I/71lMUEjjhcL._SX679_.jpg", 20, "\nWeight: 52g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :American Style Cream and Onion"))
    items.push(getObject(2, "Lays", "https://m.media-amazon.com/images/I/711xAt29aeL._SX679_.jpg", 20, "\nWeight: 52g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :Classic Salted"))
    items.push(getObject(3, "Lays", "https://m.media-amazon.com/images/I/71J93R3+TkL._SX679_.jpg", 20, "\nWeight: 52g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :India's Magic Masala"))
    items.push(getObject(4, "Lays", "https://m.media-amazon.com/images/I/71Af8qfZQUL._SX679_.jpg", 20, "\nWeight: 52g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :Spanish Tomato Tango"))
    items.push(getObject(5, "Kurkure", "https://m.media-amazon.com/images/I/710CqT5lNBL._SX679_.jpg", 20, "\nWeight: 90g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :Chilli Chatka"))
    items.push(getObject(6, "Kurkure", "https://m.media-amazon.com/images/I/71FLHWoSDWL._SX679_.jpg", 20, "\nWeight: 90g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :Masala Munch"))
    items.push(getObject(7, "Kurkure", "https://m.media-amazon.com/images/I/71TFvENBQML._SX679_.jpg", 20, "\nWeight: 90g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :Green Chutney Style"))
    items.push(getObject(8, "Kurkure", "https://m.media-amazon.com/images/I/91uisMtxriL._SY679_.jpg", 20, "\nWeight: 90g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :Solid Masti"))
    items.push(getObject(9, "Bingo Mad Angles", "https://m.media-amazon.com/images/I/81r0LYFC0HL._SX679_.jpg", 20, "\nWeight: 66g \nVegetarian Snacks \nManufactured: ITC Foods \nFlavour :Tomato Madness"))
    items.push(getObject(10, "Bingo Mad Angles", "https://m.media-amazon.com/images/I/61m4foyFSVL._SX679_.jpg", 20, "\nWeight: 66g \nVegetarian Snacks \nManufactured: ITC Foods \nFlavour :Pizza Aaah"))
    items.push(getObject(11, "Bingo Mad Angles", "https://m.media-amazon.com/images/I/814gWY+drSL._SX679_.jpg", 20, "\nWeight: 66g \nVegetarian Snacks \nManufactured: ITC Foods \nFlavour :Achaari Masti"))
    items.push(getObject(12, "Bingo Mad Angles", "https://m.media-amazon.com/images/I/81mK1JX+2yL._SX679_.jpg", 20, "\nWeight: 66g \nVegetarian Snacks \nManufactured: ITC Foods \nFlavour :Very Peri Peri"))
    localStorage.setItem("products", JSON.stringify(items))
}
function logOutIfRequired() {
    if (localStorage.getItem("current") != undefined)
        logOut()
    //TODO show successful logout message
}
function init() {
    logOutIfRequired()
    $("#login").click(checkUser);
    //loadProducts();
    //loadUsers();
}
$(document).ready(init)