"use strict";

/*
========================================
UI COMPONENTS
========================================
*/


// ======================================
// PRODUCT CARD
// ======================================

export function productCard(product) {

    return `
        <article class="product-card">

            <img
                src="${escapeHTML(product.thumbnail)}"
                alt="${escapeHTML(product.title)}"
                loading="lazy"
                width="300"
                height="220">

            <div class="product-content">

                <p class="category">
                    ${escapeHTML(product.category)}
                </p>

                <h2>
                    ${escapeHTML(product.title)}
                </h2>

                <p class="price">
                    $${product.price}
                </p>

                <div class="product-actions">

                    <a
                        href="#/product/${product.id}"
                        class="btn">

                        View Details

                    </a>

                    <button
                        type="button"
                        class="btn add-cart"
                        data-id="${product.id}">

                        Add to Cart

                    </button>

                </div>

            </div>

        </article>
    `;
}


// ======================================
// PRODUCT DETAILS
// ======================================

export function productDetails(product) {

    return `
        <article class="product-details">

            <img
                src="${escapeHTML(product.thumbnail)}"
                alt="${escapeHTML(product.title)}"
                width="500"
                height="400">

            <div>

                <p class="category">
                    ${escapeHTML(product.category)}
                </p>

                <h1>
                    ${escapeHTML(product.title)}
                </h1>

                <p class="price">
                    $${product.price}
                </p>

                <p>
                    ${escapeHTML(product.description)}
                </p>

                <p>
                    <strong>Rating:</strong>
                    ${product.rating}
                </p>

                <p>
                    <strong>Stock:</strong>
                    ${product.stock}
                </p>

                <button
                    type="button"
                    class="btn add-cart"
                    data-id="${product.id}">

                    Add to Cart

                </button>

            </div>

        </article>
    `;
}


// ======================================
// HTML ESCAPING
// ======================================

function escapeHTML(value) {

    const element =
        document.createElement("div");

    element.textContent =
        String(value);

    return element.innerHTML;

}