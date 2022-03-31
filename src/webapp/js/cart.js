var total_amount,total_quantity;
function removeItem(id){
	initial=parseInt($("#quantity-"+id).html())
	price=parseInt($("#cart-item-price-"+id).html())
	remove(id)
	$("#cart-item-"+id).remove()
	total_quantity-=initial
	total_amount-=initial*price;
	$("#total-quantity").html(total_quantity);
	$("#total-price").html(total_amount);
}
function incrementItem(id){
	increment(id);
	total_quantity+=1
	total_amount+=parseInt($("#cart-item-price-"+id).html())
	$("#total-quantity").html(total_quantity);
	$("#total-price").html(total_amount);
	}
function decrementItem(id){
	initial=parseInt($("#quantity-"+id).html())
	if(initial==1)
		{removeItem(id)
		return;}
	decrement(id);
    total_quantity-=1
    total_amount-=parseInt($("#cart-item-price-"+id).html())
    $("#total-quantity").html(total_quantity);
    $("#total-price").html(total_amount);
    }
function addNewCartItem(id,imgsrc,name,price,quantity){
  var newItem =$("#cart-item-0").clone();
  newItem.prop("id","cart-item-"+id);
  newItem.prop("hidden",false);
  newItem.find("#cart-item-name-0").html('<a id="link-0" href="product.html?id='+id+'">'+name+'</a>');
  newItem.find("#cart-item-name-0").prop("id","cart-item-name-"+id);
  if(imgsrc=='')
    newItem.find("#img-0").prop("src","../resources/prod"+1+".jpg");//TODO change image for all
  else
    newItem.find("#img-0").prop("src",imgsrc);
  newItem.find("#cart-item-price-0").html(price);
  newItem.find("#cart-item-price-0").prop("id","cart-item-price-"+id);
  newItem.find("#link-0").prop("href","product.html?id="+id);
  newItem.find("#link-0").prop("id","link-"+id);
  newItem.find("#increment-0").attr("onclick","incrementItem("+id+")");
  newItem.find("#increment-0").prop("id","increment-"+id);
  newItem.find("#quantity-0").html(quantity);
  newItem.find("#quantity-0").prop("id","quantity-"+id);
  newItem.find("#decrement-0").attr("onclick","decrementItem("+id+")");
  newItem.find("#decrement-0").prop("id","decrement-"+id);
  newItem.find("#remove-0").attr("onclick","removeItem("+id+")");
  newItem.find("#remove-0").prop("id","remove-"+id);
  newItem.appendTo("#cart-items");
  total_quantity+=quantity;
  total_amount+=quantity*price;
}
function getProduct(id,products){
	return products.find(o => o.id == id)
}
function loadPage(){
    cart= JSON.parse(localStorage.getItem("cart"))
    current= localStorage.getItem("current")
    products=JSON.parse(localStorage.getItem("products"))
	var temp=cart[current];
	total_amount=0;
    total_quantity=0;
	for (const item in temp)
	{
		if(item!=0&& temp[item]!=0){
			var obj={};
			obj["id"]=item;
			obj["quantity"]=temp[item];
			var obj= getProduct(item,products);
			addNewCartItem(item,obj["img"],obj["name"],obj["price"],temp[item])
		}
	}
	$("#total-quantity").html(total_quantity);
	$("#total-price").html(total_amount);
}
function init(){
	loadPage()
    }
$(document).ready(init)