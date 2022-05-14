//this js loads the filters without reloading but dont persist
var itemsArray = []
var maximum = 0, minimum = 0;
var brandsSet = new Set()
var minRatingDisplayed = 0;
var cart;
var save = 0;
//load specific item
function loadItem(value, index, array) {
    var obj = value
    addNewProduct(obj["id"], obj["img"], obj["brand"], obj["name"], obj["price"], obj["rating"], cart[currentUser][obj["id"]],)
}

//add new Product to itemsArray
function addNewProduct(id, imgsrc, brand, name, price, rating, quantity) {
    var newItem = $("#product-0").clone();
    brandsSet.add(brand)
    newItem.prop("item-id", id)
        .prop("brand", brand)
        .prop("price", price)
        .prop("rating", rating)
        .prop("id", "product-" + id)
        .prop("hidden", false);
    newItem.find("#name-0").html(name)
        .prop("id", "name-" + id);
    newItem.find("#img-0").prop("src", imgsrc);
    newItem.find("#price-0").html(price)
        .prop("id", "price-" + id);
    newItem.find("#rating-0").html(getHtmlForRating(rating))
        .prop("id", "rating-" + id);
    newItem.find("#link-0").prop("href", `product.html?id=${id}`)
        .prop("id", "link-" + id);
    newItem.find("#link-price-0").prop("href", `product.html?id=${id}`)
        .prop("id", "link-price-" + id);
    newItem.find("#increment-0").attr("onclick", `increment(${id})`)
        .prop("id", "increment-" + id);
    newItem.find("#quantity-0").html(quantity)
        .prop("id", "quantity-" + id);
    newItem.find("#decrement-0").attr("onclick", `decrement(${id},'${name}','removeAtProducts')`)
        .prop("id", "decrement-" + id);
    newItem.find("#addcart-0").attr("onclick", `addcart(${id})`)
        .prop("id", "addcart-" + id);
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
    brandsSet = new Set(Array.from(brandsSet).sort())
    brandsSet.forEach(function (value, index, array) { addNewBrand(value) })
}

//clone ,modify,display  new object
function addNewBrand(brandName) {
    var newBrand = $("#brand-0").clone();
    newBrand.prop("hidden", false);
    newBrand.prop("id", "brand-" + brandName);
    newBrand.find('#brand0').prop("name", brandName)
        .prop("id", brandName)
        .prop("value", brandName)
    newBrand.find('#label-0').html(brandName)
    newBrand.appendTo("#all-brands")
}

//load Page on init
async function loadPage() {
    cart = JSON.parse(localStorage.getItem("cart"))
    var currentUser = localStorage.getItem("currentUser")

    const productsJson = await fetch('../resources/json/products.json')
    temp = await productsJson.json()

    itemsArray = []
    //empty itemsArray at initial
    await temp.forEach(loadItem)
    //loads slider based on maximum and minimum
    initiateSlider(maximum, minimum)
    //loads min rating
    setMinRating(0)
    //loads unique brandNames in filter brands
    loadBrandsInFilter()
    //load with this filters
    loadAllItems()
    //remove display
    removeFiltersDisplay()
}

//called when sort or filters are changed
function loadAllItems() {
    var filterObject = {};
    var sortMethod = $("#sort-by").val();
    filterObject["min"] = $("#slider-range").slider("values", 0);
    filterObject["max"] = $("#slider-range").slider("values", 1);
    filterObject["rating"] = minRatingDisplayed;
    filterObject["brand-set"] = getCheckedBrandsFromForm()
    if (save)
        saveFiltersInSession(filterObject, sortMethod)
    sortFilterDisplay(filterObject, sortMethod)
    if (minRatingDisplayed != 0) {
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
    }
}
//compare sets
function eqSet(as, bs) {
    if (as.size !== bs.size) return false;
    for (var a of as) if (!bs.has(a)) return false;
    return true;
}
//get brands from Form that are checked //used for filters
function getCheckedBrandsFromForm() {
    var brands = $(".filter-brand-names")
    var checked = []
    brands.each(function (index, element) { if ($(this).prop("checked")) checked.push(this); });
    if (checked.length == 0 || checked.length == 1 && checked[0].getAttribute("id") == "brand0")
        return getAllBrandsFromForm()

    var retval = new Set()
    brands.each(function (index, element) { if ($(this).prop("checked")) retval.add($(this).prop("id")); });
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
    $("#display-item-count").html(newItemsArray.length)
}
//set specific filters
async function setFilters(filterObject, sortMethod = null) {
    if (sortMethod)
        $("#sort-by").val(sortMethod);
    $("#slider-range").slider("values", 0, filterObject["min"]);
    $("#slider-range").slider("values", 1, filterObject["max"]);
    if (eqSet(filterObject["brand-set"], brandsSet))
        $(".filter-brand-names").each(function (index, element) { $(this).prop("checked", false); })
    filterObject["brand-set"].forEach(function (value) { $("#" + value).prop("checked", true) })
    await setMinRating(filterObject["rating"])
}

//removes all filters
async function removeFilters() {

    var filterObject = {}
    filterObject.min = 0;
    filterObject.max = maximum;
    filterObject.rating = 0;
    filterObject["brand-set"] = getAllBrandsFromForm()
    await setFilters(filterObject)
    removeFiltersDisplay()
    sessionStorage.removeItem("filters")
}
function removeFiltersDisplay() {
    $(".filter-brand-names").each(function (index, element) { $(this).prop("checked", false); })
}
//invoked when min-rating in filter is changed
function setMinRating(minRating) {
    var i = 0;
    for (i = 1; i <= minRating; i++)
        $("#rating-" + i).html(getDark(i))
    for (; i <= 5; i++)
        $("#rating-" + i).html(getLight(i))

    $("#prices").val("Rs " + $("#slider-range").slider("values", 0) +
        " - Rs " + $("#slider-range").slider("values", 1));
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
//remove specific filter
async function removeSpecificFilter(filter) {
    if (filter == 'brands') {
        removeFiltersDisplay()
        loadAllItems()
    }
    else if (filter == 'rating') {
        setMinRating(0)
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
function saveFiltersInSession(filterObject, sortMethod) {
    var fo = {
        ...filterObject
    };
    fo["brand-set"] = Array.from(fo["brand-set"])
    fo = [JSON.stringify(fo), sortMethod]
    sessionStorage.setItem("filters", JSON.stringify(fo))
}
function checkForFiltersInSession() {
    save = 1;
    var prevFilters = sessionStorage.getItem("filters")
    if (prevFilters == null) return;
    var filterArray = JSON.parse(prevFilters)
    var fo = JSON.parse(filterArray[0])
    var sortMethod = filterArray[1]
    fo["brand-set"] = new Set(fo["brand-set"])
    setFilters(fo, sortMethod)
}
async function init() {
    await loadPage()
    $("#sort-by").on("change", function () { loadAllItems() })
    $(".filter-brand-names").on("change", function () { loadAllItems() })
    $("#remove-filters").on("click", removeFilters)
    checkForFiltersInSession()
}
$(document).ready(init)



















