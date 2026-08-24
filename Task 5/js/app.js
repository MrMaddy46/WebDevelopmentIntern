"use strict";

import {
    getProducts,
    getProduct
} from "./api.js";

import {
    addToCart,
    getCart,
    removeFromCart,
    clearCart,
    getCartCount
} from "./state.js";

import {
    productCard,
    productDetails
} from "./components.js";

import {
    getRoute
} from "./router.js";


const app = document.getElementById("app");

const cartCount =
    document.getElementById("cart-count");


let products = [];


// ======================================
// INITIALIZE
// ======================================

async function init() {

    updateCartCount();

    await loadProducts();

    renderRoute();

}


// ======================================
// LOAD PRODUCTS
// ======================================

async function loadProducts() {

    try {

        products = await getProducts();

    } catch (error) {

        console.error(
            "Product loading error:",
            error
        );

        app.innerHTML = `
            <section>
                <h1>Unable to Load Products</h1>
                <p>
                    Please check your internet connection
                    and try again.
                </p>
            </section>
        `;

    }

}


// ======================================
// ROUTER
// ======================================

async function renderRoute() {

    const route = getRoute();


    if (route === "/") {

        renderHome();

        return;

    }


    if (route === "/products") {

        renderProducts(products);

        return;

    }


    if (route.startsWith("/product/")) {

        const id =
            route.split("/")[2];

        await renderProduct(id);

        return;

    }


    if (route === "/cart") {

        renderCart();

        return;

    }


    renderNotFound();

}


// ======================================
// HOME
// ======================================

function renderHome() {

    app.innerHTML = `

        <section class="hero">

            <div>

                <p class="eyebrow">
                    Welcome to ShopHub
                </p>

                <h1>
                    Discover Products
                    You'll Love
                </h1>

                <p>
                    Explore our product catalog
                    and find your next favorite item.
                </p>

                <a
                    href="#/products"
                    class="btn">

                    Browse Products

                </a>

            </div>

        </section>

    `;

}


// ======================================
// PRODUCTS
// ======================================

function renderProducts(productList) {

    app.innerHTML = `

        <section>

            <div class="section-heading">

                <div>

                    <p class="eyebrow">
                        Catalog
                    </p>

                    <h1>
                        Products
                    </h1>

                </div>

                <input
                    type="search"
                    id="product-search"
                    placeholder="Search products..."
                    aria-label="Search products">

            </div>

            <div
                id="product-grid"
                class="product-grid">

            </div>

        </section>

    `;


    const grid =
        document.getElementById(
            "product-grid"
        );


    function display(list) {

        if (list.length === 0) {

            grid.innerHTML =
                "<p>No products found.</p>";

            return;

        }

        grid.innerHTML =
            list
                .map(productCard)
                .join("");

    }


    display(productList);


    const search =
        document.getElementById(
            "product-search"
        );


    search.addEventListener(
        "input",
        function () {

            const query =
                this.value
                    .toLowerCase()
                    .trim();


            const filtered =
                productList.filter(
                    product =>
                        product.title
                            .toLowerCase()
                            .includes(query)
                );


            display(filtered);

        }
    );

}


// ======================================
// PRODUCT DETAILS
// ======================================

async function renderProduct(id) {

    app.innerHTML = `

        <p>
            Loading product...
        </p>

    `;


    try {

        const product =
            await getProduct(id);


        app.innerHTML =
            productDetails(product);

    } catch (error) {

        console.error(
            "Product details error:",
            error
        );


        app.innerHTML = `

            <section>

                <h1>
                    Product Not Found
                </h1>

                <p>
                    We couldn't load this product.
                </p>

                <a
                    href="#/products"
                    class="btn">

                    Back to Products

                </a>

            </section>

        `;

    }

}


// ======================================
// CART EVENT DELEGATION
// ======================================

app.addEventListener(
    "click",
    async function (event) {

        const addButton =
            event.target.closest(
                ".add-cart"
            );


        if (!addButton) {

            return;

        }


        const productId =
            Number(
                addButton.dataset.id
            );


        if (!productId) {

            console.error(
                "Invalid product ID."
            );

            return;

        }


        try {

            addButton.disabled = true;

            addButton.textContent =
                "Adding...";


            const product =
                await getProduct(productId);


            addToCart(product);


            updateCartCount();


            addButton.textContent =
                "Added ✓";


        } catch (error) {

            console.error(
                "Add to cart error:",
                error
            );


            addButton.disabled = false;

            addButton.textContent =
                "Add to Cart";

        }

    }
);


// ======================================
// CART PAGE
// ======================================

function renderCart() {

    const cart =
        getCart();


    if (cart.length === 0) {

        app.innerHTML = `

            <section class="empty-cart">

                <h1>
                    Your Cart is Empty
                </h1>

                <p>
                    Add some products to get started.
                </p>

                <a
                    href="#/products"
                    class="btn">

                    Browse Products

                </a>

            </section>

        `;

        return;

    }


    const items =
        cart.map(item => `

            <article class="cart-item">

                <img
                    src="${item.thumbnail}"
                    alt="${item.title}"
                    width="100"
                    height="80"
                    loading="lazy">

                <div>

                    <h2>
                        ${item.title}
                    </h2>

                    <p>
                        $${item.price}
                        ×
                        ${item.quantity}
                    </p>

                </div>

                <button
                    type="button"
                    class="remove-cart"
                    data-id="${item.id}">

                    Remove

                </button>

            </article>

        `).join("");


    app.innerHTML = `

        <section>

            <h1>
                Shopping Cart
            </h1>

            <div class="cart-list">

                ${items}

            </div>

            <button
                type="button"
                id="clear-cart"
                class="btn danger">

                Clear Cart

            </button>

        </section>

    `;


    document
        .querySelectorAll(".remove-cart")
        .forEach(button => {

            button.addEventListener(
                "click",
                function () {

                    removeFromCart(
                        Number(
                            this.dataset.id
                        )
                    );


                    updateCartCount();

                    renderCart();

                }
            );

        });


    document
        .getElementById("clear-cart")
        .addEventListener(
            "click",
            function () {

                clearCart();

                updateCartCount();

                renderCart();

            }
        );

}


// ======================================
// UPDATE CART COUNT
// ======================================

function updateCartCount() {

    cartCount.textContent =
        getCartCount();

}


// ======================================
// 404
// ======================================

function renderNotFound() {

    app.innerHTML = `

        <section>

            <h1>
                Page Not Found
            </h1>

            <a
                href="#/"
                class="btn">

                Go Home

            </a>

        </section>

    `;

}


// ======================================
// ROUTE CHANGE
// ======================================

window.addEventListener(
    "hashchange",
    renderRoute
);


// ======================================
// START
// ======================================

init();