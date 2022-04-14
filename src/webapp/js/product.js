async function getData(id) {
    await fetch('../resources/products.json')
        .then(response => response.json())
        .then(jsonResponse => temp = jsonResponse)
    var retval = await temp.find(o => o.id == id);
    if (retval == undefined) redirectToPageNotFound()
    cart = JSON.parse(localStorage.getItem("cart"))
    current = localStorage.getItem("current")
    retval.quantity = cart[current][id]
    return retval;
}
async function load(id) {
    var current = await getData(id)

    $("#title").html(current.name)
    $("#product-img").prop("src", current.img);
    $("#product-name").html(current.name)
    $("#product-price").html(current.price)
    $("#product-description").html(current.description)
    $("#increment-0").attr("onclick", "increment(" + id + ")");
    $("#increment-0").prop("id", "increment-" + id);
    $("#quantity-0").html(current.quantity);
    $("#quantity-0-edit").prop("id", "quantity-" + id + "-edit");
    $("#quantity-0").prop("id", "quantity-" + id);
    $("#quantity-" + id).click(function () { startEdit(id) });
    $("#quantity-" + id + "-edit").blur(function () { endEdit(id) });
    $("#decrement-0").attr("onclick", "decrement(" + id + ")");
    $("#decrement-0").prop("id", "decrement-" + id);
    $("#delete-0").attr("onclick", "askConfirmRemove(" + id + ")");
    $("#delete-0").prop("id", "delete-" + id);
}
function startEdit(id) {
    initial = $("#quantity-" + id).html()
    $("#quantity-" + id + "-edit").css("display", "inline-block")
    $("#quantity-" + id + "-edit").focus()
    $("#quantity-" + id + "-edit").val(initial)
    $("#quantity-" + id).css("display", "none")
}
function endEdit(id) {
    initial = $("#quantity-" + id).val()
    input = initial;
    input = parseInt($("#quantity-" + id + "-edit").val())
    if (isNaN(input)) {
        notify("Error", "edit-error", 0, "Please enter only an Integer", "red")
    }
    else if (input == 0)
        askConfirmRemove(id, "removePlusDisplay")
    else {
        let item = $("#quantity-" + id);
        username = localStorage.getItem("current")
        cart = JSON.parse(localStorage.getItem("cart"))
        cart[username][id.toString()] = input
        localStorage.setItem("cart", JSON.stringify(cart))
        item.html(input)
        checkUserLogStatus()
        $("#quantity-" + id + "-edit").css("display", "none")
        $("#quantity-" + id).css("display", "inline-block")
    }
}
function removePlusDisplay(id) {
    remove(id)
    $("#quantity-" + id + "-edit").css("display", "none")
    $("#quantity-" + id).css("display", "inline-block")
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

