"use strict";

const API_URL =
    "https://dummyjson.com/products";


// Get all products

export async function getProducts() {

    const response =
        await fetch(
            `${API_URL}?limit=30`
        );

    if (!response.ok) {

        throw new Error(
            "Unable to load products."
        );

    }

    const data =
        await response.json();

    return data.products;
}


// Get single product

export async function getProduct(id) {

    const response =
        await fetch(
            `${API_URL}/${id}`
        );

    if (!response.ok) {

        throw new Error(
            "Product not found."
        );

    }

    return await response.json();

}