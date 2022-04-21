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
//get HTML string for display of stars
function getHtmlForRating(rating) {
  var str = '';
  for (i = 1; i <= rating; i++)
    str += getDark(i)
  for (; i <= 5; i++)
    str += getLight(i)
  return str;
}
//get light star
function getLight(star) {
  return '<span class="material-icons-outlined icon-normal" style="color:#cccc00">star_border</span>';
  return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16"><path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z"/></svg>'
}

//get dark star
function getDark(star) {
  return '<span class="material-icons-outlined icon-normal" style="color:#cccc00">star</span>';
  return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16"><path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/></svg>'
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
}

$(document).ready(init)



















