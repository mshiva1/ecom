var totalAmount, total_quantity;

//new order-item is added
function addNewOrderItem(id, imgsrc, name, price, quantity) {
  var newItem = $("#order-item-0").clone();
  newItem.prop("id", "order-item-" + id);
  newItem.prop("hidden", false);
  newItem.find("#order-item-name-0").html('<a id="link-0" href="product.html?id=' + id + '">' + name + '</a>');
  newItem.find("#order-item-name-0").prop("id", "order-item-name-" + id);
  newItem.find("#img-0").prop("src", imgsrc);
  newItem.find("#order-item-price-0").html(price);
  newItem.find("#order-item-price-0").prop("id", "order-item-price-" + id);
  newItem.find("#quantity-0").html(quantity);
  newItem.find("#quantity-0").prop("id", "quantity-" + id);
  total_quantity += quantity;
  totalAmount += quantity * price;
  return newItem;
}

//get product with id:id
function getProduct(id, products) {
  return products.find(o => o.id == id)
}

//clears the display
function clearDisplay() {
  var items = $(".item")
  for (var i in items)
    if (items[i].id != undefined && items[i].id != "order-item-0") {
      items[i].remove()
    }
}

//read file
function getOrderItems() {
  var file = $('#order-file')[0].files[0];
  readFileData(file, readFileDataCallback);
}

//read file data
function readFileDataCallback(results) {
  fileData = results.data;
  loadData(fileData)
}

//load Data into html
async function loadData(fileData) {
  clearDisplay();
  var temp = fileData
  totalAmount = 0;
  total_quantity = 0;
  await fetch('../resources/products.json')
    .then(response => response.json())
    .then(jsonResponse => products = jsonResponse)
  itemsArray = []
  errorsArray = []
  errorsCount = 0
  for (const item in temp) {
    if (temp[item] != 0) {
      var error = "no error"


      var obj = getProduct(temp[item]["ID"], products);
      if (Number.isInteger(parseInt((temp[item]["Quantity"]))) == false)
        error = "Quantity should be an Integer"
      //error in quantity
      else if (obj == undefined)
        error = "Product ID:" + temp[item]["ID"] + " doesnt exist"
      //error in product id


      var newError = []
      newError.push(temp[item]["ID"])
      newError.push(temp[item]["Name"])
      newError.push(temp[item]["Price"])
      newError.push(temp[item]["Quantity"])
      newError.push(error)
      errorsArray.push(newError)

      if (error == "no error") {
        //TODO  checkDuplicate
        itemsArray.push(addNewOrderItem(temp[item]["ID"], obj["img"], obj["name"], parseInt(obj["price"]), parseInt(temp[item]["Quantity"])))
      }
      else {
        errorsCount++;
      }
    }
  }
  if (errorsCount == 0) {
    $("tbody").append(itemsArray)
    $("#order-details").css("display", "flex")
    $("#total-quantity").html(total_quantity);
    $("#total-price").html(totalAmount);
    $("#display-error").css("display", "none")
    resetUploadDialog()
  }
  else {
    var csv = Papa.unparse({
      "fields": ["ID", "Name", "Price", "Quantity", "Error"],
      "data": errorsArray
    });
    resetUploadDialog()
    downloadCsvFile(csv)
    showUploadError()
  }
}
//for showing that error occured while parsing
function showUploadError() {
  notify("Error", "upload-error", 0, "Some error occured while parsing the CSV file . Check Downloaded File for more details", "Red")
  $("#display-error").css("display", "block")
  $("#order-details").css("display", "none")
}
//for downloading csv file of error items
function downloadCsvFile(csvData) {
  CSVFile = new Blob([csvData], {
    type: "text/csv"
  });
  var tempLink = document.createElement('a');
  tempLink.download = "Errors.csv";
  var url = window.URL.createObjectURL(CSVFile);
  tempLink.href = url;
  tempLink.style.display = "none";
  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
}

//Reset file name
function resetUploadDialog() {
  var $file = $('#order-file');
  $file.val('');
  $('#order-file-name').html("Choose File");
}

//update file name
function updateFileName() {
  var $file = $('#order-file');
  var str = $file.val();
  str = str.substring(str.lastIndexOf('\\') + 1)
  $('#order-file-name').html(str);
}

function init() {
  $('#order-file-button').click(getOrderItems);
  $("#order-file").on("change", updateFileName)
  $("#display-error").css("display", "none")
}
$(document).ready(init)