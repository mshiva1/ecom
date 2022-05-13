var totalAmount, total_quantity;

//new order-item is added
function addNewOrderItem(id, imgsrc, name, price, quantity) {
  var newItem = $("#order-item-0").clone();
  newItem.prop("id_no", id);
  newItem.prop("id", `order-item-${id}`);
  newItem.prop("hidden", false);
  newItem.find("#order-item-name-0").html(`<a id="link-${id}" href="product.html?id=${id}">${name}</a>`)
    .prop("id", `order-item-name-${id}`);
  newItem.find("#img-0").prop("src", imgsrc);
  newItem.find("#order-item-price-0").html(price)
    .prop("id", `order-item-price-${id}`);
  newItem.find("#quantity-0").html(quantity)
    .prop("id", `quantity-${id}`);
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
  if (file.type != "text/csv") {
    notify("Error", "upload-error", 0, "Please Select a CSV file. Only CSV files cab be read")
    $("#order-details").css("display", "none")
  }
  else
    readFileData(file, readFileDataCallback);
}
//check Headers
function checkHeaders(filedata) {
  console.log(filedata)
  const item = filedata[0]
  var setOfHeaders = new Set(["ID", "Quantity"])
  for (const header in item)
    setOfHeaders.delete(header)
  if (setOfHeaders.size == 0)
    return true;
  else
    return false;
}
//read file data
function readFileDataCallback(results) {
  var fileData = results.data;
  if (checkHeaders(fileData))
    loadData(fileData)
  else {
    notify("Error", "upload-error", 0, "There are some problems with the File Headers. Download the CSV again ")
    $("#order-details").css("display", "none")
  }
}

//load Data into html
async function loadData(fileData) {
  clearDisplay();
  var temp = fileData
  totalAmount = 0;
  total_quantity = 0;
  const productsJson = await fetch('../resources/json/products.json')
  products = await productsJson.json()

  itemsArray = []
  errorsArray = []
  errorsCount = 0
  for (const item in temp) {
    if (temp[item]) {
      var error = "No error"

      var obj = getProduct(temp[item]["ID"], products);
      if (temp[item]["Quantity"] == '')
        error = "Quantity is required"
      else if (Number.isInteger(parseInt((temp[item]["Quantity"]))) == false)
        error = "Quantity should be an Integer"
      //error in quantity
      else if (parseInt(temp[item]["Quantity"]) <= 0)
        error = "Quantity should be Positive"
      else if (obj == undefined)
        error = "Product ID:" + temp[item]["ID"] + " doesn't exist"
      //error in product id

      //adds in error list to show up on csv on error
      var newError = []
      newError.push(temp[item]["ID"])
      newError.push(temp[item]["Name"])
      newError.push(temp[item]["Price"])
      newError.push(temp[item]["Quantity"])
      newError.push(error)
      errorsArray.push(newError)

      //only add if no error
      if (error == "No error") {
        //find if previous element present with same ID
        var prev = await itemsArray.find(o => o.prop("id_no") == temp[item]["ID"]);

        //if undefined means no item exist previously
        if (prev == undefined)
          itemsArray.push(addNewOrderItem(temp[item]["ID"], obj["img"], obj["name"], parseInt(obj["price"]), parseInt(temp[item]["Quantity"])));
        else {
          // in this case previous element exists
          var x = parseInt(prev.find("#quantity-" + temp[item]["ID"]).html())
          x = x + parseInt(temp[item]["Quantity"])
          prev.find("#quantity-" + temp[item]["ID"]).html(x)
          total_quantity += parseInt(temp[item]["Quantity"])
          totalAmount += parseInt(temp[item]["Quantity"]) * obj["price"]
        }
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
//for showing that error occurred while parsing
function showUploadError() {
  notify("Error", "upload-error", 0, "Error in uploading file")
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
function downloadSample() {
  window.location.href = '../resources/csv/sample.csv';
}
function init() {
  $('#order-file-button').click(getOrderItems);
  $("#order-file").on("change", updateFileName)
  $("#display-error").css("display", "none")
}
$(document).ready(init)