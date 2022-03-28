function checkFor(username,password){
    //TODO check credentials
    console.log(username,password)
    var baseUrl = $("meta[name=baseUrl]").attr("content")
    window.location.replace('products.html')
}
function checkUser(){
    var username=$("#login-form [name=username]").val()
    var password=$("#login-form [name=password]").val()
    checkFor(username,password)
}
function getObject(id,name,img,price,description){
		var retval = {};
		retval["id"]=id;
        retval["name"]=name;
        retval["img"]=img;
        retval["price"]=price;
        retval["description"]=description;
        retval["quantity"]= 0;
        return retval;
}
function loadLocalStorage(){
	items=[]
	items.push( getObject(1,"Lays","https://m.media-amazon.com/images/I/71lMUEjjhcL._SX679_.jpg",20,"\nWeight: 52g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :American Style Cream and Onion"))
    items.push( getObject(2,"Lays","https://m.media-amazon.com/images/I/711xAt29aeL._SX679_.jpg",20,"\nWeight: 52g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :Classic Salted"))
    items.push( getObject(3,"Lays","https://m.media-amazon.com/images/I/71J93R3+TkL._SX679_.jpg",20,"\nWeight: 52g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :India's Magic Masala"))
    items.push( getObject(4,"Lays","https://m.media-amazon.com/images/I/71Af8qfZQUL._SX679_.jpg",20,"\nWeight: 52g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :Spanish Tomato Tango"))
    items.push( getObject(5,"Kurkure","https://m.media-amazon.com/images/I/710CqT5lNBL._SX679_.jpg",20,"\nWeight: 90g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :Chilli Chatka"))
    items.push( getObject(6,"Kurkure","https://m.media-amazon.com/images/I/71FLHWoSDWL._SX679_.jpg",20,"\nWeight: 90g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :Masala Munch"))
    items.push( getObject(7,"Kurkure","https://m.media-amazon.com/images/I/71TFvENBQML._SX679_.jpg",20,"\nWeight: 90g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :Green Chutney Style"))
    items.push( getObject(8,"Kurkure","https://m.media-amazon.com/images/I/91uisMtxriL._SY679_.jpg",20,"\nWeight: 90g \nVegetarian Snacks \nManufactured: PepsiCo India \nFlavour :Solid Masti"))
    items.push( getObject(9,"Bingo Mad Angles","https://m.media-amazon.com/images/I/81r0LYFC0HL._SX679_.jpg",20,"\nWeight: 66g \nVegetarian Snacks \nManufactured: ITC Foods \nFlavour :Tomato Madness"))
    items.push( getObject(10,"Bingo Mad Angles","https://m.media-amazon.com/images/I/61m4foyFSVL._SX679_.jpg",20,"\nWeight: 66g \nVegetarian Snacks \nManufactured: ITC Foods \nFlavour :Pizza Aaah"))
    items.push( getObject(11,"Bingo Mad Angles","https://m.media-amazon.com/images/I/814gWY+drSL._SX679_.jpg",20,"\nWeight: 66g \nVegetarian Snacks \nManufactured: ITC Foods \nFlavour :Achaari Masti"))
    items.push( getObject(12,"Bingo Mad Angles","https://m.media-amazon.com/images/I/81mK1JX+2yL._SX679_.jpg",20,"\nWeight: 66g \nVegetarian Snacks \nManufactured: ITC Foods \nFlavour :Very Peri Peri"))
	localStorage.setItem("items",JSON.stringify(items))
    var temp=localStorage.getItem("items")
   // console.log(temp)
}
function init(){
    $("#login").click(checkUser)
    loadLocalStorage()
}
$(document).ready(init)