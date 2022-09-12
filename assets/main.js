// Traigo elementos del HTML
// Contenedor de productos
const products = document.querySelector(".products__container-cards");
// Products text
const productsText = document.querySelector(".products__container-text");
// Contenedor de productos del carrito
const productsCart = document.querySelector(".cart-container");
// Total del carrito
const total = document.querySelector(".total");
// Contenedor de categorias
const categories = document.querySelector(".categorias__cards-container");
// Un hmtl collection de botones de todas las categorias
const categoriesList = document.querySelectorAll(".category");
// Boton de ver mas
const btnLoad = document.querySelector(".btn-load");
// Boton de comprar
const buyBtn = document.querySelector(".btn-buy");
// Boton para abrir y cerrar el menu
const cartBtn = document.querySelector(".cart-btn");
// Cart
const cartMenu = document.querySelector(".cart");
// Overlay que va abajo del menu/cart
const overlay = document.querySelector(".overlay");
// Barras de menu
const barsBtn = document.querySelector(".menu-label");
// Menu Hamburguesa
const barsMenu = document.querySelector(".navbar-list");

// Seteamos el carrito vacio o lo que este en el local storage
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Funcion para guardar el carrito en el localStorage
const saveLocalStorage = (cartList) => {
    localStorage.setItem("cart", JSON.stringify(cartList));
};

// Renderizado de productos

// Funcion para renderizar hmtl
const renderProduct = (product) => {
    const { id, nombre, ingredientes, precio, imagen } = product;
    return `
    <div class="products__card">
                    <img src="./assets/img/${imagen}" alt="" />
                    <div class="products__card-info">
                        <div class="products__card-text">
                            <h4>${nombre}</h4>
                            <p>${ingredientes} </p>
                            <b>$${precio}</b>
                        </div>
                        <div class="products__card-button">
                            <button class="btn-add"
                            data-id="${id}"
                            data-name="${nombre}"
                            data-price="${precio}"
                            data-img=./assets/img/${imagen}">Agregar</button>
                        </div>
                    </div>
                </div>
    `;
};

const renderProducts = (category, index) => {
    if (category === "todas") {
        products.innerHTML += allProducts.productList[index]
            .map(renderProduct)
            .join("");
        productsText.innerHTML = `<p>Todos nuestros productos</p>`;
        return;
    }
    const productList = productsData.filter((p) => p.category === category);
    products.innerHTML = productList.map(renderProduct).join("");
    productsText.innerHTML = `<p>${
    category.charAt(0).toUpperCase() + category.slice(1)
  }</p>`;
};

// Filter
const changeFilterState = (e) => {
    const selectedCategory = e.target.dataset.category;
    const categories = [...categoriesList];
    categories.forEach((category) => {
        if (category.dataset.category !== selectedCategory) {
            category.classList.remove("active");
        } else {
            category.classList.add("active");
        }
    });
    if (selectedCategory !== "todas") {
        btnLoad.classList.add("hidden");
    } else {
        btnLoad.classList.remove("hidden");
    }
};
const filterProducts = (e) => {
    if (!e.target.classList.contains("category")) return;
    changeFilterState(e);
    if (e.target.dataset.category.toLowerCase() === "todas") {
        products.innerHTML = "";
        productsText.innerHTML = `<p>Todos nuestros productos</p>`;
        renderProducts("todas", 0);
    } else {
        renderProducts(e.target.dataset.category);
    }
};

// Funcion para mostrar mas
const showMore = () => {
    renderProducts("todas", allProducts.next);
    allProducts.next++;
    if (allProducts.next === allProducts.limit) {
        btnLoad.classList.add("hidden");
    }
};

// Logica para carrito
const renderCartProduct = (cartProduct) => {
    const { id, name, price, img, quantity } = cartProduct;
    return `
    <div class="cart-item">
    <img src="${img}" alt="Producto del carro" />
    <div class="item-info">
      <h3 class="item-title">${name}</h3>
      <p class="item-bid">Precio</p>
      <span class="item-price">$${price}</span>
    </div>
    <div class="item-handler">
      <span class="quantity-handler down" data-id=${id}>-</span>
      <span class="item-quantity">${quantity}</span>
      <span class="quantity-handler up" data-id=${id}>+</span>
    </div>
  </div>
    `;
};

const renderCart = (cartList) => {
    if (!cartList.length) {
        productsCart.innerHTML = `<p class="empty-msg">No hay productos en el carrito</p>`;
        return;
    }
    productsCart.innerHTML = cartList.map(renderCartProduct).join("");
};
// Funcion para renderizar la suma de precios del carrito.
const showTotal = (cartList) => {
    total.innerHTML = `$${cartList.reduce(
    (acc, cur) => acc + Number(cur.price) * cur.quantity,
    0
  )}`;
};

const disableBuyBtn = () => {
    if (!cart.length) {
        buyBtn.classList.add("disabled");
    } else {
        buyBtn.classList.remove("disabled");
    }
};

// Funcion para el manejo de mas y menos dentro del carrito
const handleQuantity = (e) => {
    if (e.target.classList.contains("down")) {
        const existingCartItem = cart.find(
            (item) => item.id === e.target.dataset.id
        );

        // Si tocamos en un item que tine una sola cantidad
        if (existingCartItem.quantity === 1) {
            if (window.confirm("¿Desea Eliminar el producto del carrito?")) {
                cart = cart.filter((prod) => prod.id !== existingCartItem.id);
                saveLocalStorage(cart);
                renderCart(cart);
                showTotal(cart);
                disableBuyBtn();
                return;
            }
            // Si no
        }
        cart = cart.map((item) => {
            return item.id === existingCartItem.id ?
                {...item, quantity: Number(item.quantity) - 1 } :
                item;
        });

        // Si se toco el boton de up
    } else if (e.target.classList.contains("up")) {
        const existingCartItem = cart.find(
            (item) => item.id === e.target.dataset.id
        );

        cart = cart.map((item) => {
            return item.id === existingCartItem.id ?
                {...item, quantity: Number(item.quantity) + 1 } :
                item;
        });
    }
    // Para todos los casos
    saveLocalStorage(cart);
    renderCart(cart);
    showTotal(cart);
    disableBuyBtn();
};

const addProduct = (e) => {
    if (!e.target.classList.contains("btn-add")) return;
    const product = {
        id: e.target.dataset.id,
        name: e.target.dataset.name,
        price: e.target.dataset.price,
        img: e.target.dataset.img,
    };

    const existingCartItem = cart.find((item) => item.id === product.id);
    if (existingCartItem) {
        cart = cart.map((item) => {
            return item.id === product.id ?
                {...item, quantity: Number(item.quantity) + 1 } :
                item;
        });
    } else {
        cart = [...cart, {...product, quantity: 1 }];
    }
    saveLocalStorage(cart);
    renderCart(cart);
    showTotal(cart);
    disableBuyBtn();
};

const completeBuy = () => {
    if (!cart.length) return;
    if (window.confirm("¿Desea finalizar su compra?")) {
        localStorage.removeItem("cart");
        window.location.reload();
    }
};

// Menu y cart

const toggleMenu = () => {
    barsMenu.classList.toggle("open-menu");
    if (cartMenu.classList.contains("open-cart")) {
        cartMenu.classList.remove("open-cart");
        return;
    }
    overlay.classList.toggle("show-overlay");
};

const toggleCart = () => {
    cartMenu.classList.toggle("open-cart");
    if (barsMenu.classList.contains("open-menu")) {
        barsMenu.classList.remove("open-menu");
        return;
    }
    overlay.classList.toggle("show-overlay");
};
//
const closeOnScroll = () => {
    if (!barsMenu.classList.contains("open-menu") &&
        !cartMenu.classList.contains("open-cart")
    )
        return;

    barsMenu.classList.remove("open-menu");
    cartMenu.classList.remove("open-cart");
    overlay.classList.remove("show-overlay");
};

// Funcion para tener todos los eventos
const init = () => {
    document.addEventListener("DOMContentLoaded", renderProducts("todas", 0));
    document.addEventListener("DOMContentLoaded", renderCart(cart));
    document.addEventListener("DOMContentLoaded", showTotal(cart));
    categories.addEventListener("click", filterProducts);
    products.addEventListener("click", addProduct);
    productsCart.addEventListener("click", handleQuantity);
    btnLoad.addEventListener("click", showMore);
    buyBtn.addEventListener("click", completeBuy);
    cartBtn.addEventListener("click", toggleCart);
    barsBtn.addEventListener("click", toggleMenu);
    disableBuyBtn();
    window.addEventListener("scroll", closeOnScroll);
};

init();