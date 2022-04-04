function setNavAndFooter(){
    var navstr=''
    var footerstr='<footer class="footer d-flex justify-content-between px-3">    <span>&copy; Increff  </span><span id="date-time"></span></footer>'
    var navstr='<header><nav class="navbar navbar-expand navbar-light fixed-top"><a class="navbar-brand" href="products.html"><img alt="Increff" class="d-inline-block align-top" id="logo" src="../resources/logo.png"></a><button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button><div class="d-flex collapse navbar-collapse" id="navbarCollapse"><ul class="col-4 navbar-nav "><li class="nav-item active"><a hidden class="nav-link" href="upload.html"><svg class="svg-lg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/></svg></a></li></ul><ul class="col-8 px-0 navbar-nav justify-content-end"><li class="nav-item active"><a class="nav-link" href="upload.html"><svg class="svg-lg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/></svg></a></li><li class="nav-item active" ><a class="nav-link" href="cart.html"><svg class="svg-lg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart2" viewBox="0 0 16 16"><path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5H3.14zM5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0zm9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0z"/></svg><sub><span class="badge badge-pill" id="cart-count">0</span></sub></a></li><li class="nav-item active"><a class="nav-link" href="login.html"><svg class="svg-lg" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-right" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/><path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/></svg></a></li></ul></div></nav></header>'
    $("#navbar-stub").html(navstr)
    $("#footer-stub").html(footerstr)
    currentTimeAndDate()
    setInterval(currentTimeAndDate, 1000)
}
function currentTimeAndDate(){
  const d = new Date()
  var datestring = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" +
      d.getFullYear() + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)+":"+("0" + d.getSeconds()).slice(-2);
  $("#date-time").html(datestring)
}
function getClearString(){
    return '<div class="clear-both" > </div>';
}
function increment(id){
    let item=$("#quantity-"+id);
    initial =parseInt(item.html())
    username=localStorage.getItem("current")
    cart=JSON.parse(localStorage.getItem("cart"))
    cart[username][id.toString()]=initial+1
    localStorage.setItem("cart",JSON.stringify(cart))
    item.html(initial+1)
    checkUserLogStatus()

}
function decrement(id){
    let item=$("#quantity-"+id);
    initial =parseInt(item.html())
    if(initial==0) return;
    username=localStorage.getItem("current")
    cart=JSON.parse(localStorage.getItem("cart"))
    cart[username][id.toString()]=initial-1
    localStorage.setItem("cart",JSON.stringify(cart))
    item.html(initial-1)
    checkUserLogStatus()
}
function remove(id){
    let item=$("#quantity-"+id);
    initial =parseInt(item.html())
    if(initial==0) return;
    username=localStorage.getItem("current")
    cart=JSON.parse(localStorage.getItem("cart"))
    cart[username][id.toString()]=0
    localStorage.setItem("cart",JSON.stringify(cart))
    item.html(0)
    checkUserLogStatus()
}
function readFileData(file, callback){
	var config = {
		header: true,
		delimiter: ",",
		skipEmptyLines: "greedy",
		complete: function(results) {
			callback(results);
	  	}
	}
	Papa.parse(file, config);
}
function checkUserLogStatus(){
if(window.location.href.includes("login.html")) return;
current=localStorage.getItem("current")
passwords=JSON.parse(localStorage.getItem("passwords"))
if(current==undefined || passwords[current]==undefined)
  window.location.replace("login.html?redirect="+window.location.href+"")
else{
  cart=JSON.parse(localStorage.getItem("cart"))
  cart=cart[current]
  let count=0
  for (const item in cart){
  count+=cart[item]
  }
  $("#cart-count").html(count);
}
}
function logOut(){
  localStorage.removeItem("current")
  window.location.replace("login.html")
}
function init(){
  setNavAndFooter();
  checkUserLogStatus();
}
$(document).ready(init)