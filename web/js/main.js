import { Cart } from "./cart/cart";
import { isLogged, userContext } from "./user/userContext";

(function ($) 
{
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });
    
})(jQuery);

export const updateNavBadge = () =>
{
    if (!localStorage.getItem(`${userContext.user_id}-cart`)) 
        localStorage.setItem(`${userContext.user_id}-cart`, "[]");
    if (!localStorage.getItem(`${userContext.user_id}-favorites`)) 
        localStorage.setItem(`${userContext.user_id}-favorites`, "[]");

    let heartSpan = document.querySelector(".heartspan");
    let cartSpan = document.querySelector(".cartspan");
    let count = 0
    
    heartSpan.innerText = (JSON.parse(localStorage.getItem(`${userContext.user_id}-favorites`))).length
    let cartProducts = JSON.parse(localStorage.getItem(`${userContext.user_id}-cart`));
    cartProducts.map(product => count+= product.quantity)
    cartSpan.innerText = count
}

if (isLogged()) 
{
    //update nav icon
    updateNavBadge()
}


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
    if (e.target.classList.contains("logout")) 
    {
        sessionStorage.removeItem("token");
        window.location.href = '/index.html';
    }
    else if(e.target.classList.contains("fToCart"))
    {
        if(isLogged())
        {
            window.location.href="cart.html";
        }
        else
        {
            window.location.href="signin.html"
        }
    }
})

