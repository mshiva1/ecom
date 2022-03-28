function increment(id){
    let item=$("#quantity-"+id);
    initial =parseInt(item.html())
    //TODO update cart
    item.html(initial+1)
}
function decrement(id){
    let item=$("#quantity-"+id);
    initial =parseInt(item.html())
    if(initial==0) return;
    //TODO update cart
    item.html(initial-1)
}
function remove(id){
    let item=$("#quantity-"+id);
    initial =parseInt(item.html())
    if(initial==0) return;
    //TODO update cart
    item.html(0)
}

function getData(id){
	var temp=JSON.parse(localStorage.getItem("items"));
    var retval = temp.find(o => o.id == id);
    return retval;
    }
function load(id){
    var current=getData(id)
    $("#title").html(current.name)
    $("#product-img").prop("src",current.img);
    $("#product-name").html(current.name)
    $("#product-price").html(current.price)
    $("#product-description").html(current.description)

    $("#increment-0").attr("onclick","increment("+id+")");
    $("#increment-0").prop("id","increment-"+id);
    $("#quantity-0").html(current.quantity);
    $("#quantity-0").prop("id","quantity-"+id);
    $("#decrement-0").attr("onclick","decrement("+id+")");
    $("#decrement-0").prop("id","decrement-"+id);
    $("#delete-0").attr("onclick","remove("+id+")");
    $("#delete-0").prop("id","delete-"+id);
    }

function init(){
    const id =  new URLSearchParams(window.location.search).get('id');
    if(id!=null)
    load(id);
}

$(document).ready(init)

