"use strict";


// Get current route

export function getRoute() {

    const hash =
        window.location.hash || "#/";

    return hash.slice(1);

}