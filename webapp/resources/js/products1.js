var itemsArray = []
var maximum = 0, minimum = 0;
var filterMax = 0, filterMin = 0;
var brandsSet = new Set();
var filterBrandSet;
var sortBy = "default";
var minRatingDisplayed = 1;
var cart;

//load specific item
function loadItem(value, index, array) {
  var obj = value
  addNewProduct(obj["id"], obj["img"], obj["brand"], obj["name"], obj["price"], obj["rating"], cart[currentUser][obj["id"]],)
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
  newItem.find("#link-0").prop("href", `product.html?id=${id}`);
  newItem.find("#link-0").prop("id", "link-" + id);
  newItem.find("#link-price-0").prop("href", `product.html?id=${id}`);
  newItem.find("#link-price-0").prop("id", "link-price-" + id);
  newItem.find("#increment-0").attr("onclick", `increment(${id})`);
  newItem.find("#increment-0").prop("id", "increment-" + id);
  newItem.find("#quantity-0").html(quantity);
  newItem.find("#quantity-0").prop("id", "quantity-" + id);
  newItem.find("#decrement-0").attr("onclick", `decrement(${id},'removeAtProducts')`);
  newItem.find("#decrement-0").prop("id", "decrement-" + id);
  newItem.find("#addcart-0").attr("onclick", `addcart(${id})`);
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
function initiateSlider(maximum, minimum, filterMax, filterMin) {
  $("#slider-range").slider({
    range: true,
    min: minimum,
    max: maximum,
    values: [filterMin, filterMax],
    slide: async function (event, ui) {
      await $("#prices").val("Rs " + ui.values[0] + " - Rs " + ui.values[1]);
      loadAllItems()
    }
  });
  $("#prices").val("Rs " + $("#slider-range").slider("values", 0) +
    " - Rs " + $("#slider-range").slider("values", 1));
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

async function setCheckedToCurrentBrands() {
  var brands = $(".filter-brand-names")
  //remove all checkboxes
  brands.each(function (index, element) { $(this).prop("checked", false) });
  if (filterBrandSet.size == 0)
    filterBrandSet = getAllBrandsFromForm();
  else
    brands.each(function (index, element) {
      if (filterBrandSet.has($(this).prop("id"))) $(this).prop("checked", true);
    });
  await console.log($("#Lays").prop("checked"))
}
function loadFiltersIntoGlobalVariables() {
  sortBy = new URLSearchParams(window.location.search).get('sortby')
  var minURL = new URLSearchParams(window.location.search).get('min')
  var maxURL = new URLSearchParams(window.location.search).get('max')
  var ratingURL = new URLSearchParams(window.location.search).get('minRating')
  var brandsArray = new URLSearchParams(window.location.search).get('brandsSet')

  if (minURL != null) filterMin = parseInt(minURL);
  else filterMin = 0;
  if (maxURL != null) filterMax = parseInt(maxURL);
  else filterMax = maximum
  if (ratingURL != null) minRatingDisplayed = parseInt(ratingURL);
  if (brandsArray != null) filterBrandSet = new Set(JSON.parse(brandsArray))
  else filterBrandSet = new Set()
}

//load Page on init
async function loadPage() {
  cart = JSON.parse(localStorage.getItem("cart"))
  var currentUser = localStorage.getItem("currentUser")

  await fetch('../resources/products.json')
    .then(response => response.json())
    .then(jsonResponse => temp = jsonResponse)


  //empty itemsArray at initial
  itemsArray = []

  await temp.forEach(loadItem)

  //loads the variables from URL
  await loadFiltersIntoGlobalVariables()
  //loads slider based on maximum and minimum
  initiateSlider(maximum, minimum, filterMax, filterMin)
  //loads min rating
  filterMinRate(minRatingDisplayed)
  //loads unique brandNames in filter brands
  loadBrandsInFilter()
  //load with this filters
  setCheckedToCurrentBrands()

  console.log($("#Lays").prop("checked"))
  loadAllItems()

  await console.log($("#Lays").prop("checked"))
}

//called when sort or filters are changed
function loadAllItems(event) {
  var filterObject = {};
  filterObject["min"] = filterMin;
  filterObject["max"] = filterMax;
  filterObject["rating"] = minRatingDisplayed;
  filterObject["brand-set"] = filterBrandSet
  sortFilterDisplay(filterObject, sortBy)
  /*
    if (minRatingDisplayed != 1) {
      $("#rating-display").html(minRatingDisplayed)
      $("#filter-rating-display").css("display", "block")
    }
    else {
      $("#filter-rating-display").css("display", "none")
    }
    if (filterObject["min"] != 0 || filterObject["max"] != maximum) {
      $('#price-display').html(filterObject["min"] + "to" + filterObject["max"])
      $("#filter-price-display").css("display", "block")
    }
    else {
      $("#filter-price-display").css("display", "none")
    }
    if (!eqSet(filterObject["brand-set"], getAllBrandsFromForm())) {
      var str = ''
      filterObject["brand-set"].forEach(function (value) { if (value != "brand0") str = str + value + ", " })
      $("#brands-display").html(str.substr(0, str.length - 2))
      $("#filter-brands-display").css("display", "block")
    }
    else {
      $("#filter-brands-display").css("display", "none")
    }*/
}
//compare sets
function eqSet(as, bs) {
  if (as.size !== bs.size) return false;
  for (var a of as) if (!bs.has(a)) return false;
  return true;
}
//get brands from Form that are checked //used for filters
function getBrandsFromForm() {
  var brands = $(".filter-brand-names")
  var checked = []
  console.log(brands)
  brands.each(function (index, element) { if ($(this).prop("checked") == true) checked.push($(this)); });

  var retval = new Set()
  brands.each(function (index, element) { if ($(this).prop("checked")) retval.add($(this).prop("id")); });

  if (retval.size == 1 && retval.has("brand0")) return new Set();
  return retval;
}
//get all brands from form
function getAllBrandsFromForm() {
  var brands = $(".filter-brand-names")
  var retval = new Set()
  brands.each(function (index, element) { retval.add($(this).prop("id")); });
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
  if (sortMethod == "low-to-high") {
    $("#sort-by").val(sortMethod)
    newItemsArray.sort(function (a, b) { return a.prop("price") - b.prop("price"); })
  }

  else if (sortMethod == "high-to-low") {
    $("#sort-by").val(sortMethod)
    newItemsArray.sort(function (a, b) { return b.prop("price") - a.prop("price"); })
  }
  else if (sortMethod == "rating-low-to-high") {
    $("#sort-by").val(sortMethod)
    newItemsArray.sort(function (a, b) { return a.prop("rating") - b.prop("rating"); })
  }

  else if (sortMethod == "rating-high-to-low") {
    $("#sort-by").val(sortMethod)
    newItemsArray.sort(function (a, b) { return b.prop("rating") - a.prop("rating"); })
  }

  else {
    newItemsArray.sort(function (a, b) { return a.prop("item-id") - b.prop("item-id"); })
  }


  //load after filter and sort
  itemsArray.forEach(function (value, index, array) { value.remove() })
  newItemsArray.forEach(function (value, index, array) { value.appendTo("#products") })
  $("#display-item-count").html(newItemsArray.length)
}


//removes all filters
async function removeFilters() {
  str = window.location.pathname;
  window.location.replace(str.substring(str.lastIndexOf('/') + 1))
}
function removeFiltersDisplay() {
  $(".filter-brand-names").each(function (index, element) { $(this).prop("checked", false); })
}
//invoked when min-rating in filter is changed
function filterMinRate(minRating) {
  for (i = 1; i <= minRating; i++)
    $("#rating-" + i).html(getDark(i))
  for (; i <= 5; i++)
    $("#rating-" + i).html(getLight(i))
}
//

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

//remove specific filter for buttons of showing in smaller displays
async function removeSpecificFilter(filter) {
  if (filter == 'brands') {
    removeFiltersDisplay()
    loadAllItems()
  }
  else if (filter == 'rating') {
    filterMinRate(1)
  }
  else if (filter == 'price') {
    $("#slider-range").slider("values", 0, 0);
    await $("#slider-range").slider("values", 1, maximum);
    $("#prices").val("Rs " + $("#slider-range").slider("values", 0) +
      " - Rs " + $("#slider-range").slider("values", 1));
    loadAllItems()
  }
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

function setMinRating(minRatingInput) {
  minRatingDisplayed = minRatingInput;
  newPageWithCurrentSort()
}

function newPageWithCurrentSort() {
  console.log("hello")
  var str = window.location.pathname;
  sortMethod = $("#sort-by").val();
  var newBrandsSet = getBrandsFromForm()
  var newBrandsArray = Array.from(newBrandsSet)
  var newMinimum = $("#slider-range").slider("values", 0)
  var newMaximum = $("#slider-range").slider("values", 1)
  var minRating = minRatingDisplayed;
  window.location.replace(str.substring(str.lastIndexOf('/') + 1) + `?sortby=${sortMethod}&min=${newMinimum}&max=${newMaximum}&minRating=${minRating}&brandsSet=${JSON.stringify(newBrandsArray)}`)
}

async function init() {
  await loadPage()
  $("#sort-by").on("change", newPageWithCurrentSort)
  $(".filter-brand-names").on("change", newPageWithCurrentSort)
  $("#slider-range").focusout(newPageWithCurrentSort)
  $("#remove-filters").on("click", removeFilters)
}

$(document).ready(init)
