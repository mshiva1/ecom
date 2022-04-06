function addNewProduct(id, imgsrc, name, price, quantity) {
  var newItem = $("#product-0").clone();
  newItem.prop("id", "product-" + id);
  newItem.prop("hidden", false);
  newItem.find("#name-0").html(name);
  newItem.find("#img-0").prop("src", imgsrc);
  newItem.find("#name-0").prop("id", "name-" + id);
  newItem.find("#price-0").html(price);
  newItem.find("#price-0").prop("id", "price-" + id);
  newItem.find("#link-0").prop("href", "product.html?id=" + id);
  newItem.find("#link-0").prop("id", "link-" + id);
  newItem.find("#increment-0").attr("onclick", "increment(" + id + ")");
  newItem.find("#increment-0").prop("id", "increment-" + id);
  newItem.find("#quantity-0").html(quantity);
  newItem.find("#quantity-0").prop("id", "quantity-" + id);
  newItem.find("#decrement-0").attr("onclick", "decrement(" + id + ")");
  newItem.find("#decrement-0").prop("id", "decrement-" + id);
  newItem.appendTo("#products");
}
function loadItem(value, index, array) {
  var obj = value
  addNewProduct(obj["id"], obj["img"], obj["name"], obj["price"], cart[current][obj["id"]])
}
async function loadPage() {
  cart = JSON.parse(localStorage.getItem("cart"))
  current = localStorage.getItem("current")

	await fetch('../resources/products.json')
	    .then(response => response.json())
	    .then(jsonResponse => temp=jsonResponse)

  temp.forEach(loadItem)
  $("#products").append(getClearString);
}
function init() {
  loadPage()
}
$(document).ready(init)