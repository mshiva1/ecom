//gets data from json and returns data of specific item
async function getData(id) {
    await fetch('../resources/products.json')
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
    $("#title").html(currentItem.name)
    $("#product-img").prop("src", currentItem.img);
    $("#product-name").html(currentItem.name)
    $("#product-price").html(currentItem.price)
    $("#product-description").html(currentItem.description)
    $("#product-rating").html(getHtmlForRating(currentItem.rating));
    $("#increment-0").attr("onclick", `increment${id}`);
    $("#increment-0").prop("id", "increment-" + id);
    $("#quantity-0").html(currentItem.quantity);
    $("#quantity-0-edit").prop("id", "quantity-" + id + "-edit");
    $("#quantity-0").prop("id", "quantity-" + id);
    $("#quantity-" + id).click(function () { startEdit(id) });
    $("#quantity-" + id + "-edit").blur(function () { endEdit(id) });
    $("#decrement-0").attr("onclick", `decrement{id}`;
    $("#decrement-0").prop("id", "decrement-" + id);
    $("#delete-0").attr("onclick",`askConfirmRemove{id}`;
    $("#delete-0").prop("id", "delete-" + id);
}

//invoked when quantity is clicked
function startEdit(id) {
    var initial = $("#quantity-" + id).html()
    $("#quantity-" + id + "-edit").css("display", "inline-block")
    $("#quantity-" + id + "-edit").focus()
    $("#quantity-" + id + "-edit").val(initial)
    $("#quantity-" + id).css("display", "none")
}

//invoked when focus is moved from quantity
function endEdit(id) {
    var initial = $("#quantity-" + id).val()
    var input = initial;
    input = parseInt($(`#quantity-${id}-edit`).val())
    if (isNaN(input)) {
        notify("Error", "edit-error", 0, "Please enter only an Integer", "red")
    }
    else if (input == 0)
        askConfirmRemove(id, "removePlusDisplay")
    else {
        let item = $("#quantity-" + id);
        username = localStorage.getItem("currentUser")
        var cart = JSON.parse(localStorage.getItem("cart"))
        cart[username][id.toString()] = input
        localStorage.setItem("cart", JSON.stringify(cart))
        item.html(input)
        checkUserLogStatus()
        $(`#quantity-${id}-edit`).css("display", "none")
        $("#quantity-" + id).css("display", "inline-block")
    }
}

//function called when item is removed from cart by typing quantity as 0
function removePlusDisplay(id) {
    remove(id)
    $("#quantity-" + id + "-edit").css("display", "none")
    $("#quantity-" + id).css("display", "inline-block")
}

//called when specific product not found
function productNotFound(){
    $("#product-not-found").css("display","block")
    $("#product-found").css("display","none")

}

function init() {
    const id = new URLSearchParams(window.location.search).get('id');
    if (id != undefined)
        load(id);
    else productNotFound()
}
$(document).ready(init)

