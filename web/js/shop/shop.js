import { fetchData } from '../fetch/fetch';
import { endpoints } from '../fetch/endpoints';
import { Product } from './Product';
import {isLogged, userContext} from '../user/userContext'
import { Cart } from '../cart/cart';
import { updateNavBadge } from '../main';

let productsList = []
const handleProductsHTMLElements = products => {
  const productsContainer = document.querySelector('.products-container');
  productsContainer.innerHTML =
    products.map(product => new Product(product).getCardHTMLElement(product._id)).join('') +
    Product.getHTMLPagination();
    productsList = products;
};
try {
  Product.generateFilters();
  const res = await fetchData(
    endpoints.getProducts.url + Product.getPginationQuery(),
    endpoints.getProducts.method
  );
  Product.filters.count = res.data.length
  const data = Product.addFilterAndPagination(res.data)
  handleProductsHTMLElements(data);
} catch (error) {
  console.log(error);
}


let heartSpan = document.querySelector(".heartspan");
let cartSpan = document.querySelector(".cartspan");

if (isLogged()) 
{ 
  updateNavBadge()
  Cart.getCartProducts() //!IMPORTANT -> to load data and avoid overwriting
  
  ;(async () => 
  {
      try {
          document.addEventListener("click", (e) => 
          {
            let productId = e.target.getAttribute("data-id");
              if (e.target.classList.contains("cart")) 
              {                    
                let product = productsList.find( product => product._id == productId) 
                Cart.addProdoctToCart(product)
                cartSpan.innerText = Cart.getProductsCount()
                console.log("product Added");
              }  
              else if (e.target.classList.contains("heart")) 
              {
                let userFavorites = JSON.parse(localStorage.getItem(`${userContext.user_id}-favorites`));
                
                if (!userFavorites.includes(productId)) {
                  userFavorites.push(productId);
                  heartSpan.innerText = userFavorites.length;
                  localStorage.setItem(`${userContext.user_id}-favorites`, JSON.stringify(userFavorites));
                } 
                else {
                  let filterData = userFavorites.filter(product => product != productId);
                  heartSpan.innerText = filterData.length;
                  localStorage.setItem(`${userContext.user_id}-favorites`, JSON.stringify(filterData));
                }
              }
          })
  
      } catch (error) {
          console.log(error);
      }
  })();
}


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
