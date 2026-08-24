"use strict";


const CART_KEY =
    "shophub_cart";


let cart =
    JSON.parse(
        localStorage.getItem(CART_KEY)
    ) || [];


// Get cart

export function getCart() {

    return cart;

}


// Add product

export function addToCart(product) {

    const existing =
        cart.find(
            item => item.id === product.id
        );


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            id: product.id,

            title: product.title,

            price: product.price,

            thumbnail: product.thumbnail,

            quantity: 1

        });

    }


    saveCart();

}


// Remove product

export function removeFromCart(id) {

    cart =
        cart.filter(
            item => item.id !== id
        );

    saveCart();

}


// Clear cart

export function clearCart() {

    cart = [];

    saveCart();

}


// Calculate item count

export function getCartCount() {

    return cart.reduce(
        (total, item) =>
            total + item.quantity,
        0
    );

}


// Save cart

function saveCart() {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}