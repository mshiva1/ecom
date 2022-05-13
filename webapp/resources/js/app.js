// adds new message to user
function notify(type, toastId, timer, message) {
  var color;
  if (type == "Success") color = 'green';
  else if (type == "Warning") color = 'yellow';
  else if (type == "Error") color = 'red';

  toast = `<div class="toast" data-autohide="false" style="color:white;background-color:${color};border:black" id="${toastId}"><div class="toast-header"><strong class="mr-auto">${type}</strong><button type="button" class="ml-2 mb-1 close" onclick=removeToast("${toastId}") aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="toast-body">${message}</div></div>`
  $("#toast-body").append(toast)
  $(".toast").toast("show")
  if (timer)
    setTimeout(function () { removeToast(toastId); }, timer)
}

//invoked when message has to be removed
function removeToast(toastId) {
  $(`#${toastId}`).remove()
}

//this invokes the confirmation modal for removing an item from cart
function askConfirmRemove(id, name, nextFun = "remove") {
  $("#confirm-remove-button").attr("onclick", `${nextFun}(${id})`)
  if (name != "")
    $("#name-in-modal").html(name)
  $("#confirm-remove").modal("toggle");
}

//inserts NavBar and Footer
function setNavAndFooter() {
  var navstr = '<nav class="navbar navbar-expand navbar-light container-fluid-sm p-2"><a class="navbar-brand" href="products.html"><img alt="Increff" class="d-inline-block align-top"  data-toggle="tooltip" data-placement="top" title="All Products" id="logo" src="../resources/images/logo.png"></a><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="d-flex collapse navbar-collapse" id="navbarCollapse"><ul class="col-12 px-0 navbar-nav justify-content-end"><li class="nav-item active"  data-toggle="tooltip" data-placement="top" title="Upload Order"><a class="nav-link" href="upload.html"><span class="material-icons-outlined m-1 icon-large">file_upload</span></a></li><li class="nav-item active"  data-toggle="tooltip" data-placement="top" title="Cart"><a class="nav-link" href="cart.html"><span class="material-icons-outlined m-1 icon-large">shopping_cart</span><sub><span class="badge badge-warning" id="cart-count">0</span></sub></a></li><li class="nav-item active"><a class="nav-link pr-0" href="login.html"  data-toggle="tooltip" data-placement="top" title="Logout"><span class="material-icons-outlined icon-large m-1">logout</span></a></li></ul></div></nav>'
  var footerstr = '<footer class="footer d-flex justify-content-between px-1 container-fluid-sm">    <span>&copy;INCREFF 2022 </span><span id="date-time"></span></footer>'

  $("#navbar-stub").html(navstr)
  $("#footer-stub").html(footerstr)
  currentTimeAndDate()
  setInterval(currentTimeAndDate, 1000)
}

//current time and date is updated
function currentTimeAndDate() {
  const d = new Date()
  var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" +
    d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
  $("#date-time").html(datestring)
}

//increment a quantity for product with id:id
function increment(id) {
  let item = $(`#quantity-${id}`);
  initial = parseInt(item.html())
  checkUserLogStatus()
  username = localStorage.getItem("currentUser")
  cart = JSON.parse(localStorage.getItem("cart"))
  cart[username][id.toString()] = initial + 1
  localStorage.setItem("cart", JSON.stringify(cart))
  item.html(initial + 1)
  updateCartCount()
}

//decrement a quantity for product with id:id
function decrement(id, name, nextFun = "remove") {
  let item = $(`#quantity-${id}`);
  initial = parseInt(item.html())
  if (initial == 0) return;
  if (initial == 1) {
    askConfirmRemove(id, name, nextFun)
    return;
  }
  checkUserLogStatus()
  username = localStorage.getItem("currentUser")
  cart = JSON.parse(localStorage.getItem("cart"))
  cart[username][id.toString()] = initial - 1
  localStorage.setItem("cart", JSON.stringify(cart))
  item.html(initial - 1)
  updateCartCount()
}

//remove the product with id:id
function remove(id) {
  let item = $(`#quantity-${id}`);
  initial = parseInt(item.html())
  if (initial == 0) return;
  checkUserLogStatus()
  username = localStorage.getItem("currentUser")
  cart = JSON.parse(localStorage.getItem("cart"))
  delete cart[username][id.toString()]
  localStorage.setItem("cart", JSON.stringify(cart))
  item.html(0)
  updateCartCount()
}

//reading data from file
function readFileData(file, callback) {
  var config = {
    header: true,
    delimiter: ",",
    skipEmptyLines: "greedy",
    complete: function (results) {
      callback(results);
    }
  }
  Papa.parse(file, config);
}

//check if user is logged in or not
//if not logged in redirected to login.html
async function checkUserLogStatus() {
  if (window.location.href.includes("login.html")) return;
  currentUser = localStorage.getItem("currentUser")
  const passwordsJson = await fetch('../resources/json/passwords.json')
      passwords= await passwordsJson.json()
  var currentUserObject = passwords.find(o => o.username == currentUser)
  if (currentUser == undefined || currentUserObject == undefined)
    window.location.replace(`login.html?redirect=${window.location.href}`)

}
function updateCartCount() {

  if (window.location.href.includes("login.html")) return;
  cart = JSON.parse(localStorage.getItem("cart"))
  cartcurrent = cart[currentUser]
  let count = 0
  for (const item in cartcurrent) {
    count += cartcurrent[item]
  }
  $("#cart-count").html(count);
}
//invoked when logout is clicked
function logOut() {
  localStorage.removeItem("currentUser")
  window.location.replace("login.html")
}

//for enabling tooltips
function enableTooltip() {
  $('[data-toggle="tooltip"]').tooltip()
}

//get HTML string for display of stars
function getHtmlForRating(rating) {
  var str = '<span class="no-break">';
  for (i = 1; i <= rating; i++)
    str += getDark(i)
  for (; i <= 5; i++)
    str += getLight(i)
  return str + "</span>";
}
//get light star
function getLight(star) {
  return '<span class="material-icons-outlined icon-normal" style="color:#cccc00">star_border</span>';
}

//get dark star
function getDark(star) {
  return '<span class="material-icons-outlined icon-normal" style="color:#cccc00">star</span>';
}

function init() {
  setNavAndFooter();
  checkUserLogStatus();
  updateCartCount();
  enableTooltip();
}
$(document).ready(init)