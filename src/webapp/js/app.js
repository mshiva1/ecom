
function increment(id){
    let item=$("#quantity-"+id);
    initial =parseInt(item.html())
    username=localStorage.getItem("current")
    cart=JSON.parse(localStorage.getItem("cart"))
    cart[username][id.toString()]=initial+1
    localStorage.setItem("cart",JSON.stringify(cart))
    item.html(initial+1)
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
    return initial-1;
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
}