// adds new message to user
function notify(type, toastId, timer, message, color) {
  toast = '<div class="toast" data-autohide="false" style="color:white;background-color:' + color + '" id="' + toastId + '"><div class="toast-header"><strong class="mr-auto">' + type + '</strong><button type="button" class="ml-2 mb-1 close" onclick=removeToast("' + toastId + '") aria-label="Close"><span aria-hidden="true">&times;</span></button></div><div class="toast-body">' + message + '</div></div>'
  $("#toast-body").append(toast)
  $(".toast").toast("show")
  if (timer != 0)
    setTimeout(function () { removeToast(toastId); }, timer)
}

//invoked when message has to be removed
function removeToast(toastId) {
  $("#" + toastId).remove()
}

//this invokes the confirmation modal for removing an item from cart
function askConfirmRemove(id, nextFun = "remove") {
  $("#remove-item-name").html(name)
  $("#confirm-remove-button").attr("onclick", nextFun + "(" + id + ")")
  $("#confirm-remove").modal("toggle");
}

//inserts NavBar and Footer
function setNavAndFooter() {
  var navstr = ''
  var navstr = '<header><nav class="navbar navbar-expand navbar-light fixed-top"><a class="navbar-brand" href="products.html"><img alt="Increff" class="d-inline-block align-top"  data-toggle="tooltip" data-placement="top" title="All Products" id="logo" src="../resources/logo.png"></a><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="d-flex collapse navbar-collapse" id="navbarCollapse"><ul class="col-12 px-0 navbar-nav justify-content-end"><li class="nav-item active"  data-toggle="tooltip" data-placement="top" title="Upload CSV"><a class="nav-link" href="upload.html"><span class="material-icons-outlined m-1 icon-large">file_upload</span></a></li><li class="nav-item active"  data-toggle="tooltip" data-placement="top" title="Current Cart"><a class="nav-link" href="cart.html"><span class="material-icons-outlined m-1 icon-large">shopping_cart</span><sub><span class="badge badge-pill" id="cart-count">0</span></sub></a></li><li class="nav-item active"><a class="nav-link" href="login.html"  data-toggle="tooltip" data-placement="top" title="Logout"><span class="material-icons-outlined icon-large m-1">logout</span></a></li></ul></div></nav></header>'
  var footerstr = '<footer class="footer d-flex justify-content-between px-3">    <span>&copy; Increff  </span><span id="date-time"></span></footer>'

  $("#navbar-stub").html(navstr)
  $("#footer-stub").html(footerstr)
  currentTimeAndDate()
  //setInterval(currentTimeAndDate, 1000)
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
  let item = $("#quantity-" + id);
  initial = parseInt(item.html())
  username = localStorage.getItem("current")
  cart = JSON.parse(localStorage.getItem("cart"))
  cart[username][id.toString()] = initial + 1
  localStorage.setItem("cart", JSON.stringify(cart))
  item.html(initial + 1)
  checkUserLogStatus()
}

//decrement a quantity for product with id:id
function decrement(id, nextFun = "remove") {
  let item = $("#quantity-" + id);
  initial = parseInt(item.html())
  if (initial == 0) return;
  if (initial == 1) {
    askConfirmRemove(id, nextFun)
    return;
  }
  username = localStorage.getItem("current")
  cart = JSON.parse(localStorage.getItem("cart"))
  cart[username][id.toString()] = initial - 1
  localStorage.setItem("cart", JSON.stringify(cart))
  item.html(initial - 1)
  checkUserLogStatus()
}

//remove the product with id:id
function remove(id) {
  let item = $("#quantity-" + id);
  initial = parseInt(item.html())
  if (initial == 0) return;
  username = localStorage.getItem("current")
  cart = JSON.parse(localStorage.getItem("cart"))
  delete cart[username][id.toString()]
  localStorage.setItem("cart", JSON.stringify(cart))
  item.html(0)
  checkUserLogStatus()
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
  current = localStorage.getItem("current")
  await fetch('../resources/passwords.json')
    .then(response => response.json())
    .then(jsonResponse => passwords = jsonResponse)
  if (current == undefined || passwords[current] == undefined)
    window.location.replace("login.html?redirect=" + window.location.href + "")
  else {
    cart = JSON.parse(localStorage.getItem("cart"))
    cartCurrent = cart[current]
    let count = 0
    for (const item in cartCurrent) {
      count += cartCurrent[item]
    }
    $("#cart-count").html(count);
  }
}

//invoked when logout is clicked
function logOut() {
  localStorage.removeItem("current")
  window.location.replace("login.html")
}

//for enabling tooltips
function enableTooltip() {
  $('[data-toggle="tooltip"]').tooltip()
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

function init() {
  setNavAndFooter();
  checkUserLogStatus();
}
$(document).ready(init)