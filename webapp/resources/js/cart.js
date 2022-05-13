var totalAmount, totalQuantity;

//remove item from cart
function removeItem(id, name) {
	askConfirmRemoveCart(id, name)
	return;
}

//ask for confirmation while removing
function askConfirmRemoveCart(id, name) {
	$("#name-in-modal").html(name)
	$("#confirm-remove-button").attr("onclick", `finalRemoveItem(${id})`)
	$("#confirm-remove").modal("toggle");
}

//invoked when confirmation is clicked
function finalRemoveItem(id) {
	let initial = parseInt($("#quantity-" + id).html())
	let price = parseInt($("#cart-item-price-" + id).html())
	remove(id)
	$("#cart-item-" + id).remove()
	totalQuantity -= initial
	totalAmount -= initial * price;
	if (totalQuantity == 0)
		emptyCartDisplay()
	$("#total-quantity").html(totalQuantity);
	$("#total-price").html(totalAmount);
}

//increment quantity of product with id:id
function incrementItem(id) {
	increment(id);
	totalQuantity += 1
	totalAmount += parseInt($("#cart-item-price-" + id).html())
	$("#total-quantity").html(totalQuantity);
	$("#total-price").html(totalAmount);
}

//decrement quantity of product with id:id
function decrementItem(id, name) {
	let initial = parseInt($("#quantity-" + id).html())
	if (initial == 1) {
		removeItem(id, name)
		return;
	}
	decrement(id);
	totalQuantity -= 1
	totalAmount -= parseInt($("#cart-item-price-" + id).html())
	if (totalQuantity == 0)
		emptyCartDisplay()
	$("#total-quantity").html(totalQuantity);
	$("#total-price").html(totalAmount);
}

//adds new item to the html page
function addNewCartItem(id, imgsrc, name, price, rating, quantity) {
	var newItem = $("#cart-item-0").clone();
	newItem.prop("id", "cart-item-" + id)
		.prop("hidden", false);
	newItem.find("#cart-item-name-0").html(`<a id="link-0" href="product.html?id="${id}">${name}</a> ${getHtmlForRating(rating)}`)
		.prop("id", "cart-item-name-" + id);
	newItem.find("#img-0").prop("src", imgsrc);
	newItem.find("#cart-item-price-0").html(price)
		.prop("id", "cart-item-price-" + id);
	newItem.find("#link-0").prop("href", "product.html?id=" + id)
		.prop("id", "link-" + id);
	newItem.find("#increment-0").attr("onclick", `incrementItem(${id})`)
		.prop("id", "increment-" + id);
	newItem.find("#quantity-0").html(quantity)
		.prop("id", "quantity-" + id);
	newItem.find("#decrement-0").attr("onclick", `decrementItem(${id},'${name}')`)
		.prop("id", "decrement-" + id);
	newItem.find("#remove-0").attr("onclick", `removeItem(${id},'${name}')`)
		.prop("id", "remove-" + id);
	newItem.appendTo("#cart-items");
	totalQuantity += quantity;
	totalAmount += quantity * price;
}

//return product with id:id
function getProduct(id, products) {
	return products.find(o => o.id == id)
}

//invoked when no items in cart
function emptyCartDisplay() {
	// show that no items in cart and Link products page
	$("#empty-cart").css("display", "block")
	$("#cart-header").css("display", "none")
	$("#cart-summary").css("display", "none")
	$("#cart-items").css("display", "none")
}

//loads the page initially
async function loadPage() {
	var cart = JSON.parse(localStorage.getItem("cart"))
	var currentUser = localStorage.getItem("currentUser")

	const productsJson = await fetch('../resources/json/products.json')
	products = await productsJson.json()
	var temp = cart[currentUser];
	totalAmount = 0;
	totalQuantity = 0;
	for (const item in temp) {
		if (item && temp[item]) {
			var obj = {};
			obj["id"] = item;
			obj["quantity"] = temp[item];
			var obj = getProduct(item, products);
			if (obj == undefined) {
				removeItem(item)
				notify("Error", "error-in-cart", 0, "Some Error occured, so some Items are removed");
			}
			else
				addNewCartItem(item, obj["img"], obj["name"], obj["price"], obj["rating"], temp[item])
		}
	}
	if (totalQuantity == 0)
		emptyCartDisplay()
	$("#total-quantity").html(totalQuantity);
	$("#total-price").html(totalAmount);
}

//runs when checkout is clicked
async function checkOut() {
	checkUserLogStatus()
	var cart = JSON.parse(localStorage.getItem("cart"))
	var currentUser = localStorage.getItem("currentUser")

	const productsJson = await fetch('../resources/json/products.json')
	products = await productsJson.json()
	var temp = cart[currentUser];
	var itemArray = []
	for (const item in temp) {
		if (item && temp[item]) {
			var obj = [];
			var prod = getProduct(item, products);
			obj.push(item);
			obj.push(prod["name"]);
			obj.push(prod["price"]);
			obj.push(temp[item]);
			itemArray.push(obj);
		}
	}
	var csv = Papa.unparse({
		"fields": ["ID", "Name", "Price", "Quantity"],
		"data": itemArray
	});
	downloadCsvFile(csv)
	emptyCart(currentUser)
	$("#pop-up").modal("show")
	emptyCartDisplay()
	updateCartCount()
}
//confirm clear cart
function confirmClearCart() {
	$("#confirm-clear").modal("toggle");
}

//clear cart
function clearCart() {
	emptyCart()
	emptyCartDisplay()
	checkUserLogStatus()
	updateCartCount()
}

//empties the cart
async function emptyCart() {
	var cart = JSON.parse(localStorage.getItem("cart"))
	delete cart[currentUser]
	cart[currentUser] = {}
	await localStorage.setItem("cart", JSON.stringify(cart))
}

//for downloading csv file of order items
function downloadCsvFile(csvData) {
	CSVFile = new Blob([csvData], {
		type: "text/csv"
	});
	var tempLink = document.createElement('a');
	tempLink.download = "Order.csv";
	var url = window.URL.createObjectURL(CSVFile);
	tempLink.href = url;
	tempLink.style.display = "none";
	document.body.appendChild(tempLink);
	tempLink.click();
	document.body.removeChild(tempLink);
}


function init() {
	$("#checkout").click(checkOut)
	loadPage()
}
$(document).ready(init)