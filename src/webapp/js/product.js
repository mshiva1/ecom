function getData(id) {
    var temp = JSON.parse(localStorage.getItem("products"));
    var retval = temp.find(o => o.id == id);
    if (retval == undefined) redirectToPageNotFound()
    cart = JSON.parse(localStorage.getItem("cart"))
    current = localStorage.getItem("current")
    retval.quantity = cart[current][id]
    return retval;
}
function load(id) {
    var current = getData(id)

    $("#title").html(current.name)
    $("#product-img").prop("src", current.img);
    $("#product-name").html(current.name)
    $("#product-price").html(current.price)
    $("#product-description").html(current.description)

    $("#increment-0").attr("onclick", "increment(" + id + ")");
    $("#increment-0").prop("id", "increment-" + id);
    $("#quantity-0").html(current.quantity);
    $("#quantity-0").prop("id", "quantity-" + id);
    $("#decrement-0").attr("onclick", "decrement(" + id + ")");
    $("#decrement-0").prop("id", "decrement-" + id);
    $("#delete-0").attr("onclick", "remove(" + id + ")");
    $("#delete-0").prop("id", "delete-" + id);
}
function redirectToPageNotFound() {
    window.location.replace("pageNotFound.html")
}
function init() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id != undefined)
        load(id);
    else redirectToPageNotFound();
}

$(document).ready(init)

