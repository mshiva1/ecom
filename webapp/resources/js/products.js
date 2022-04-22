var itemsArray = []
var maximum = 0, minimum = 0;
var brandsSet = new Set()
var minRatingDisplayed = 1;
var cart;

//load specific item 
function loadItem(value, index, array) {
  var obj = value
  addNewProduct(obj["id"], obj["img"], obj["brand"], obj["name"], obj["price"], obj["rating"], cart[current][obj["id"]],)
}

//add new Product to itemsArray 
function addNewProduct(id, imgsrc, brand, name, price, rating, quantity) {
  var newItem = $("#product-0").clone();
  newItem.prop("item-id", id);
  newItem.prop("brand", brand);
  brandsSet.add(brand)
  newItem.prop("price", price);
  newItem.prop("rating", rating);
  newItem.prop("id", "product-" + id);
  newItem.prop("hidden", false);
  newItem.find("#name-0").html(name);
  newItem.find("#img-0").prop("src", imgsrc);
  newItem.find("#name-0").prop("id", "name-" + id);
  newItem.find("#price-0").html(price);
  newItem.find("#price-0").prop("id", "price-" + id);
  newItem.find("#rating-0").html(getHtmlForRating(rating));
  newItem.find("#rating-0").prop("id", "rating-" + id);
  newItem.find("#link-0").prop("href", "product.html?id=" + id);
  newItem.find("#link-0").prop("id", "link-" + id);
  newItem.find("#increment-0").attr("onclick", "increment(" + id + ")");
  newItem.find("#increment-0").prop("id", "increment-" + id);
  newItem.find("#quantity-0").html(quantity);
  newItem.find("#quantity-0").prop("id", "quantity-" + id);
  newItem.find("#decrement-0").attr("onclick", "decrement(" + id + ",'removeAtProducts')");
  newItem.find("#decrement-0").prop("id", "decrement-" + id);
  newItem.find("#addcart-0").attr("onclick", "addcart(" + id + ")");
  newItem.find("#addcart-0").prop("id", "addcart-" + id);
  newItem.find("#one-button-0").prop("id", "one-button-" + id);
  newItem.find("#three-button-0").prop("id", "three-button-" + id);
  if (quantity > 0)
    newItem.find("#one-button-" + id).css("display", "none");
  else
    newItem.find("#three-button-" + id).css("display", "none");
  itemsArray.push(newItem)

  if (maximum < price) maximum = price;
  if (minimum > price) minimum = price;
}

//initiate slider for price range
function initiateSlider(maximum, minimum = 0) {
  $("#slider-range").slider({
    range: true,
    min: minimum,
    max: maximum,
    values: [minimum, maximum],
    slide: function (event, ui) {
      $("#prices").val("Rs" + ui.values[0] + " - Rs" + ui.values[1]);
    }
  });
  $("#prices").val("Rs" + $("#slider-range").slider("values", 0) +
    " - Rs" + $("#slider-range").slider("values", 1));
}

//loading all brands into checkbox in filters div
function loadBrandsInFilter() {
  brandsSet.forEach(function (value, index, array) { addNewBrand(value) })
}

//clone ,modify,display  new object 
function addNewBrand(brandName) {
  var newBrand = $("#brand-0").clone();
  newBrand.prop("hidden", false);
  newBrand.prop("id", "brand-" + brandName);
  newBrand.find('#brand0').prop("name", brandName)
  newBrand.find('#brand0').prop("id", brandName)
  newBrand.find('#brand0').prop("value", brandName)
  newBrand.find('#label-0').html(brandName)
  newBrand.appendTo("#brands-list")
}

//load Page on init
async function loadPage() {
  cart = JSON.parse(localStorage.getItem("cart"))
  var current = localStorage.getItem("current")

  await fetch('../resources/products.json')
    .then(response => response.json())
    .then(jsonResponse => temp = jsonResponse)

  itemsArray = []
  //empty itemsArray at initial
  await temp.forEach(loadItem)
  //loads slider based on maximum and minimum
  initiateSlider(maximum, minimum)
  //loads min rating
  filterMinRate(1)
  //loads unique brandNames in filter brands
  loadBrandsInFilter()
  //load with this filters
  loadAllItems()
}

//called when sort or filters are changed
function loadAllItems() {
  var filterObject = {};
  var sortMethod = $("#sort-by").val();
  filterObject["min"] = $("#slider-range").slider("values", 0);
  filterObject["max"] = $("#slider-range").slider("values", 1);
  filterObject["rating"] = minRatingDisplayed;
  filterObject["brand-set"] = getBrandsFromForm()
  sortFilterDisplay(filterObject, sortMethod)
}

//get brands from Form that are checked //used for filters 
function getBrandsFromForm() {
  var brands = $(".filter-brand-names")
  var retval = new Set()
  brands.each(function (index, element) { if ($(this).prop("checked")) retval.add($(this).prop("id")); });
  return retval;
}
//get all brands from form
function getAllBrandsFromForm() {
  var brands = $(".filter-brand-names")
  var retval = new Set()
  brands.each(function (index, element) {retval.add($(this).prop("id")); });
  return retval;
}

//check if specific item (value) fits into filter (filterObject)
function checkFilter(value, filterObject) {
  if (value.prop("price") >= filterObject["min"] && value.prop("price") <= filterObject["max"] && value.prop("rating") >= filterObject["rating"] && filterObject["brand-set"].has(value.prop("brand")))
    newItemsArray.push(value)
}

//sorts ,filters and changes the current display
function sortFilterDisplay(filterObject, sortMethod) {
  newItemsArray = []
  //filter
  itemsArray.forEach(function (value, index, array) { checkFilter(value, filterObject); })

  //sort
  if (sortMethod == "low-to-high")
    newItemsArray.sort(function (a, b) { return a.prop("price") - b.prop("price"); })
  else if (sortMethod == "high-to-low")
    newItemsArray.sort(function (a, b) { return b.prop("price") - a.prop("price"); })
  else if (sortMethod == "rating-low-to-high")
    newItemsArray.sort(function (a, b) { return a.prop("rating") - b.prop("rating"); })
  else if (sortMethod == "rating-high-to-low")
    newItemsArray.sort(function (a, b) { return b.prop("rating") - a.prop("rating"); })
  else
    newItemsArray.sort(function (a, b) { return a.prop("item-id") - b.prop("item-id"); })

  //load after filter and sort
  itemsArray.forEach(function (value, index, array) { value.remove() })
  newItemsArray.forEach(function (value, index, array) { value.appendTo("#products") })
}
//set specific filters
async function setFilters(filterObject,sortMethod= null){
	if(sortMethod)
	$("#sort-by").val(sortMethod);
  $("#slider-range").slider("values", 0,filterObject["min"]);
  $("#slider-range").slider("values", 1,filterObject["max"]);
	$(".filter-brand-names").each(function (index, element) {$(this).prop("checked",false); })
  filterObject["brand-set"].forEach(function(value){$("#"+value).prop("checked",true)})
  await filterMinRate(filterObject["rating"])
}

//removes all filters
function removeFilters(){
var filterObject={}
	filterObject.min=0;
	filterObject.max=maximum;
	filterObject.rating=1;
	filterObject["brand-set"]=getAllBrandsFromForm()
	setFilters(filterObject)
}

//invoked when min-rating in filter is changed
function filterMinRate(minRating) {
  for (i = 1; i <= minRating; i++)
    $("#rating-" + i).html(getDark(i))
  for (; i <= 5; i++)
    $("#rating-" + i).html(getLight(i))

  $("#current-min-rating").html(minRating)
  minRatingDisplayed = minRating;
  loadAllItems()
}


//item removed i.e. quantity is 0
function removeAtProducts(id) {
  remove(id);
  $("#one-button-" + id).css("display", "block")
  $("#three-button-" + id).css("display", "none")
}

//new item added
function addcart(id) {
  $("#one-button-" + id).css("display", "none")
  $("#three-button-" + id).css("display", "block")
  increment(id)
}

//toggle
function toggleFilter() {
  if ($("#filters").css("display") == "none") {
    $("#filters").removeClass("d-none")
    $("#filters").addClass("d-flex")
    $("#overlay").css("display", "block")
  }
  else {
    $("#filters").removeClass("d-flex")
    $("#filters").addClass("d-none")
    $("#overlay").css("display", "none")
  }
}
async function init() {
  await loadPage()
  $("#sort-by").on("change", loadAllItems)
  $("#filter-price").focusout(loadAllItems)
  $(".filter-brand-names").on("change", loadAllItems)
  $("#remove-filters").on("click",removeFilters)
}

$(document).ready(init)


















