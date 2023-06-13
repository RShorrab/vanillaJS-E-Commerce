import { endpoints } from "../fetch/endpoints";
import { fetchData } from "../fetch/fetch";
import { updateNavBadge } from "../main";
import { isLogged, userContext } from "../user/userContext";
import { Cart, CartLine, cartProducts } from "./cart" 
let cartSpan = document.querySelector(".cartspan");
let heartSpan = document.querySelector(".heartspan");

const res = await fetchData(
    endpoints.getProducts.url,
    endpoints.getProducts.method
);
//Cart.addProdoctToCart(res.data)


if(!isLogged())
{
    window.location.href = "signin.html"
}
else
{
    if (!localStorage.getItem(`${userContext.user_id}-cart`)) 
    localStorage.setItem(`${userContext.user_id}-cart`, "[]");
  if (!localStorage.getItem(`${userContext.user_id}-favorites`)) 
    localStorage.setItem(`${userContext.user_id}-favorites`, "[]");

    heartSpan.innerText = (JSON.parse(localStorage.getItem(`${userContext.user_id}-favorites`))).length
    let count = 0
    let cartList = JSON.parse(localStorage.getItem(`${userContext.user_id}-cart`));
    cartList.map(product => count+= product.quantity)
    cartSpan.innerText = count
    



    Cart.getCartProducts() 
    Cart.getProductHTML()   
}

let productIndex;
document.addEventListener("click", (e)=>
{
    if(e.target.classList.contains("deleteBtn") || e.target.classList.contains("incrementBtn") || e.target.classList.contains("decrementBtn"))
    {
        productIndex = e.target.parentElement.getAttribute("productIndex")
        if(e.target.classList.contains("deleteBtn"))
        {
            Cart.deleteProduct(productIndex)  
        }
        else if(e.target.classList.contains("incrementBtn"))
        {
            CartLine.incrementQuantity(productIndex)
        }
        else if(e.target.classList.contains("decrementBtn"))
        {
            CartLine.decrementQuantity(productIndex)
        }
        
        localStorage.setItem(`${userContext.user_id}-cart`, JSON.stringify(cartProducts));
        Cart.getProductHTML() 
        cartSpan.innerText = Cart.getProductsCount()
    }
})


let checkoutBtn = document.getElementById("checkoutBtn")
checkoutBtn.addEventListener("click", ()=> window.location.href = "/checkout.html")



// handle user state
const userIcon = document.querySelector('.user-icon')
userIcon.addEventListener('click', () => {
    const nestedList = document.querySelector('.nested-user-list');
    nestedList.classList.toggle('d-none');
    if (isLogged()) {
        nestedList.innerHTML = `<h6>${userContext.email}</h6> <button class="logout">LogOut</button>`;
    }
});
// start logout action 
document.addEventListener("click", e => {
    if (e.target.classList.contains("logout")) {
        sessionStorage.removeItem("token");
        window.location.href = '/index.html';
    }
})


