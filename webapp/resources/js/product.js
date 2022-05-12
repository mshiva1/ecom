//gets data from json and returns data of specific item
async function getData(id) {
    await fetch('../resources/json/products.json')
        .then(response => response.json())
        .then(jsonResponse => temp = jsonResponse)
    var retval = await temp.find(o => o.id == id);
    if (retval == undefined) {
        productNotFound();
        return undefined;
    }
    var cart = JSON.parse(localStorage.getItem("cart"))
    var currentUser = localStorage.getItem("currentUser")
    retval.quantity = cart[currentUser][id]
    return retval;
}

//load the data of productId into page
async function load(id) {
    var currentItem = await getData(id)
    if (currentItem == undefined) return;
    $("#title").html(currentItem.name)
    $("#product-img").prop("src", currentItem.img);
    $("#product-name").html(currentItem.name)
    $("#product-price").html(currentItem.price)
    $("#product-description").html(currentItem.description)
    $("#product-rating").html(getHtmlForRating(currentItem.rating));
    $("#increment-0").attr("onclick", `incrementItemProduct(${id})`);
    $("#increment-0").prop("id", "increment-" + id);
    $("#addcart-0").attr("onclick", `incrementItemProduct(${id})`);
    $("#addcart-0").prop("id", "addcart-" + id);
    $("#quantity-0").html(currentItem.quantity);
    $("#quantity-0-edit").prop("id", "quantity-" + id + "-edit");
    $("#quantity-0").prop("id", "quantity-" + id);
    $("#quantity-" + id).click(function () { startEdit(id) });
    $("#quantity-" + id + "-edit").blur(function () { endEdit(id) });
    $("#decrement-0").attr("onclick", `decrement(${id},"","removeItemProduct")`);
    $("#decrement-0").prop("id", "decrement-" + id);
    $("#delete-0").attr("onclick", `askConfirmRemove(${id},"","removeItemProduct")`);
    $("#delete-0").prop("id", "delete-" + id);
    updateDisabled(id)
}
function updateDisabled(id) {
    console.log(parseInt($("#quantity-" + id).html()))
    if (parseInt($("#quantity-" + id).html()) == 0) {
        $("#one-button").css("display", "block")
        $("#three-button").css("display", "none")
    }
    else {
        $("#one-button").css("display", "none")
        $("#three-button").css("display", "block")
    }
}
async function removeItemProduct(id) {
    await remove(id)
    updateDisabled(id)
}
async function incrementItemProduct(id) {
    await increment(id)
    updateDisabled(id)
}

//called when specific product not found
function productNotFound() {
    $("#product-not-found").css("display", "block")
    $("#product-found").css("display", "none")
}

function init() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id)
        load(id);
    else productNotFound()
}
$(document).ready(init)

