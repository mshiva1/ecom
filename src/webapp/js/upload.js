var totalAmount, total_quantity;
function addNewOrderItem(id, imgsrc, name, price, quantity) {
  var newItem = $("#order-item-0").clone();
  newItem.prop("id", "order-item-" + id);
  newItem.prop("hidden", false);
  newItem.find("#order-item-name-0").html('<a id="link-0" href="product.html?id=' + id + '">' + name + '</a>');
  newItem.find("#order-item-name-0").prop("id", "order-item-name-" + id);
  newItem.find("#img-0").prop("src", imgsrc);
  newItem.find("#order-item-price-0").html(price);
  newItem.find("#order-item-price-0").prop("id", "order-item-price-" + id);
  newItem.find("#link-0").prop("href", "product.html?id=" + id);
  newItem.find("#link-0").prop("id", "link-" + id);
  newItem.find("#increment-0").attr("onclick", "incrementItem(" + id + ")");
  newItem.find("#increment-0").prop("id", "increment-" + id);
  newItem.find("#quantity-0").html(quantity);
  newItem.find("#quantity-0").prop("id", "quantity-" + id);
  newItem.appendTo("#order-items-shown");
  total_quantity += quantity;
  totalAmount += quantity * price;
}
function getProduct(id, products) {
  return products.find(o => o.id == id)
}
function clearDisplay() {
  $("#order-items-shown").empty()
}
function getOrderItems() {
  var file = $('#order-file')[0].files[0];
  readFileData(file, readFileDataCallback);
}
function readFileDataCallback(results) {
  fileData = results.data;
  loadData(fileData)
}
function loadData(fileData) {
  console.log(fileData)
  clearDisplay();
  var temp = fileData
  totalAmount = 0;
  total_quantity = 0;
  products = JSON.parse(localStorage.getItem("products"))
  for (const item in temp) {
    console.log(item);
    if (temp[item] != 0) {
      var obj = getProduct(temp[item]["ID"], products);
      addNewOrderItem(temp[item]["ID"], obj["img"], temp[item]["Name"], parseInt(temp[item]["Price"]), parseInt(temp[item]["Quantity"]))
    }
  }
  $("#order-details").css("display", "block")
  $("#total-quantity").html(total_quantity);
  $("#total-price").html(totalAmount);
  $("#cart-items").append(getClearString);
  resetUploadDialog()
}
function resetUploadDialog() {
  //Reset file name
  var $file = $('#order-file');
  $file.val('');
  $('#order-file-name').html("Choose File");
}
function updateFileName() {
  var $file = $('#order-file');
  var str = $file.val();
  str = str.substring(str.lastIndexOf('\\') + 1)
  $('#order-file-name').html(str);
}
function init() {
  $('#order-file-button').click(getOrderItems);
  $("#order-file").on("change", updateFileName)
}
$(document).ready(init)