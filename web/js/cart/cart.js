import { fetchData } from "../fetch/fetch";
import { endpoints } from '../fetch/endpoints';
import { userContext } from "../user/userContext";

export let cartProducts = [];
const cartList = document.getElementById("products")
const productTable = document.getElementById("productTable")
const emptyDiv = document.getElementById("emptyDiv")
const checkoutBtn = document.getElementById("checkoutBtn")
let subTotal = document.getElementById("sub-total")

export class Cart
{
    _id;
    name;
    image;
    quantity;
    price;
    totalPrice;

    constructor(product)
    {
        this._id = product._id;
        this.name = product.name;
        this.image = product.image;
        this.quantity = product.quantity || 1;
        this.price = product.price;
        this.totalPrice = this.price * this.quantity;
    }

    static getCartProducts = () =>
    {
        if(JSON.parse(localStorage.getItem(`${userContext.user_id}-cart`)) != null)
        {
            cartProducts = JSON.parse(localStorage.getItem(`${userContext.user_id}-cart`));
            cartProducts = cartProducts.map((product)=> new Cart(product))
        }
    }

    static getProductHTML = () =>
    {
        let trs='';
        for(var i=0; i < cartProducts.length; i++)
        {
            trs+= ` <tr id="${cartProducts[i]._id}">
                        <td class="text-left">
                            <img src="${cartProducts[i].image}" alt="" style="width: 50px" />
                            ${cartProducts[i].name}
                        </td>
                        <td class="align-middle">$${cartProducts[i].price}</td>
                        <td class="align-middle">
                            <div class="input-group quantity mx-auto" style="width: 100px">
                                <div class="input-group-btn">
                                    ${cartProducts[i].quantity==1? `<button type="button" disabled` : `<button type="button"`}
                                    
                                    class="decBtn btn btn-sm btn-primary btn-minus decrementBtn blurDivParent" id="decrementBtn-${i}" productIndex=${i}>
                                        <i class="fa fa-minus"></i>
                                        <div class="w-100 h-100 blurDiv decrementBtn"></div>
                                    </button>
                                </div>
                                <input type="text" class="quantityVal form-control form-control-sm bg-secondary border-0 text-center" value="${cartProducts[i].quantity}" readonly/>
                                <div class="input-group-btn">
                                    <button type="button" class="incBtn btn btn-sm btn-primary btn-plus incrementBtn blurDivParent" productIndex=${i}>
                                        <i class="fa fa-plus"></i>
                                        <div class="w-100 h-100 blurDiv incrementBtn"></div>
                                    </button>
                                </div>
                            </div>
                        </td>
                        <td class="align-middle">$${cartProducts[i].totalPrice}</td>
                        <td class="align-middle">
                            <button class="btn btn-sm btn-danger deleteBtn blurDivParent" productIndex=${i}>
                                <i class="fa fa-times"></i>
                                <div class="w-100 h-100 blurDiv deleteBtn"></div>
                            </button>
                        </td>
                    </tr> `
        }
        if(trs == '')
        {
            productTable.classList.add("d-none")
            emptyDiv.classList.remove("d-none")
            checkoutBtn.disabled = true
            subTotal.innerText = `$0`
            return false;
        }
        
        productTable.classList.remove("d-none");
        emptyDiv.classList.add("d-none")
        checkoutBtn.disabled = false
        cartList.innerHTML = trs;
        this.getSubtotal()
        this.getProductsCount()
    }

    static addProdoctToCart = async (productAdded) => 
    { 
        productAdded = new Cart(productAdded)
        let existedProduct = cartProducts.find( (item) => item._id == productAdded._id)
        if(!existedProduct)
        {
            cartProducts.push(productAdded);
        }
        else
        {
            existedProduct.quantity++;
            existedProduct.totalPrice = existedProduct.price * existedProduct.quantity
        }
        localStorage.setItem(`${userContext.user_id}-cart`, JSON.stringify(cartProducts));
    }

    static deleteProduct = (index) =>
    {
        cartProducts.splice(index,1);
        localStorage.setItem(`${userContext.user_id}-cart`, JSON.stringify(cartProducts));
        this.getProductHTML();
    }

    static getSubtotal = () =>
    {
        let total = 0
        cartProducts.map( product =>
            {
                total += product.totalPrice
            })
        subTotal.innerText = `$${total}`
    } 
    
    static getProductsCount = ()=>
    {
        let count = 0;
        cartProducts = JSON.parse(localStorage.getItem(`${userContext.user_id}-cart`));
        cartProducts.map(product => count+= product.quantity)
        
        return count
        //return cartProducts.length
    }
}
export class CartLine
{
    //increment & decremenet
    static incrementQuantity = (productIndex) =>
    {
        cartProducts[productIndex].quantity++;
        cartProducts[productIndex].totalPrice = cartProducts[productIndex].quantity * cartProducts[productIndex].price
    }

    static decrementQuantity = (productIndex) =>
    {   
        if(cartProducts[productIndex].quantity == 1)
        {   
            return false;
        }
        cartProducts[productIndex].quantity--;
        cartProducts[productIndex].totalPrice = cartProducts[productIndex].quantity * cartProducts[productIndex].price;
    }
}

 
/* let productIndex;
document.addEventListener("click", (e)=>
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
})
let checkoutBtn = document.getElementById("checkoutBtn")
checkoutBtn.addEventListener("click", ()=> window.location.href = "/checkout.html")
 */




