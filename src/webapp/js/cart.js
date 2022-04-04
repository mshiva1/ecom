var totalAmount,totalQuantity;
function removeItem(id){
	initial=parseInt($("#quantity-"+id).html())
	price=parseInt($("#cart-item-price-"+id).html())
	remove(id)
	$("#cart-item-"+id).remove()
	totalQuantity-=initial
	totalAmount-=initial*price;
	if(totalQuantity==0)
	emptyCartDisplay()
	$("#total-quantity").html(totalQuantity);
	$("#total-price").html(totalAmount);
}
function incrementItem(id){
	increment(id);
	totalQuantity+=1
	totalAmount+=parseInt($("#cart-item-price-"+id).html())
	$("#total-quantity").html(totalQuantity);
	$("#total-price").html(totalAmount);
	}
function decrementItem(id){
	initial=parseInt($("#quantity-"+id).html())
	if(initial==1)
		{removeItem(id)
		return;}
	decrement(id);
    totalQuantity-=1
    totalAmount-=parseInt($("#cart-item-price-"+id).html())
	  if(totalQuantity==0)
	  emptyCartDisplay()
    $("#total-quantity").html(totalQuantity);
    $("#total-price").html(totalAmount);
    }
function addNewCartItem(id,imgsrc,name,price,quantity){
  var newItem =$("#cart-item-0").clone();
  newItem.prop("id","cart-item-"+id);
  newItem.prop("hidden",false);
  newItem.find("#cart-item-name-0").html('<a id="link-0" href="product.html?id='+id+'">'+name+'</a>');
  newItem.find("#cart-item-name-0").prop("id","cart-item-name-"+id);
  if(imgsrc=='')
    newItem.find("#img-0").prop("src","../resources/prod"+1+".jpg");
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
  totalQuantity+=quantity;
  totalAmount+=quantity*price;
}
function getProduct(id,products){
	return products.find(o => o.id == id)
}
function emptyCartDisplay(){
    //disable checkout button
    $("#checkout").prop("disabled",true)
    // show that no items in cart and Link products page
    $("#empty-cart").css("display","block")

}
function loadPage(){
    cart= JSON.parse(localStorage.getItem("cart"))
    current= localStorage.getItem("current")
    products=JSON.parse(localStorage.getItem("products"))
	var temp=cart[current];
	totalAmount=0;
    totalQuantity=0;
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
	if(totalQuantity==0)
	  emptyCartDisplay()
	$("#total-quantity").html(totalQuantity);
	$("#total-price").html(totalAmount);
}
function checkOut(){
    cart= JSON.parse(localStorage.getItem("cart"))
    current= localStorage.getItem("current")
    products=JSON.parse(localStorage.getItem("products"))
    var temp=cart[current];
    var itemArray=[]
    	for (const item in temp)
    	{
    		if(item!=0&& temp[item]!=0){
    			var obj=[];
    			var prod= getProduct(item,products);
    			obj.push(item);
    			obj.push(prod["name"]);
    			obj.push(prod["price"]);
    			obj.push(temp[item]);
    			itemArray.push(obj);
    		}
    	}
    	var csv=Papa.unparse({
              	"fields": ["ID", "Name","Price","Quantity"],
              	"data": itemArray
              });
      downloadCsvFile(csv)
      emptyCart(current)
      window.location.replace("cart.html")
}
function emptyCart(id){
cart=JSON.parse(localStorage.getItem("cart"))
delete cart[current]
cart[current]={}
localStorage.setItem("cart",JSON.stringify(cart))

}
function downloadCsvFile(csvData) {
			CSVFile = new Blob([csvData], {
				type: "text/csv"
			});
			var tempLink = document.createElement('a');
			tempLink.download = "Order.csv";
			var url = window.URL.createObjectURL(CSVFile);
			tempLink.href = url;
			tempLink.style.display = "none";
			document.body.appendChild(tempLink);
			tempLink.click();
			document.body.removeChild(tempLink);
		}
function init(){
  $("#checkout").click(checkOut)
	loadPage()
    }
$(document).ready(init)