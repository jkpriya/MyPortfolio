class ViewManager {
    #productCatalogManager;
    #cartManager;
    #priceCalculator;
    // #baseUrl = "http://192.168.0.55:3000"
    #baseUrl = "https://www.jkpriya.com"

    constructor(productCatalogManager, cartManager, priceCalculator) {
        this.#productCatalogManager = productCatalogManager;
        this.#cartManager = cartManager;
        this.#priceCalculator = priceCalculator;
    }

    loadProducts() {
        document.getElementById("products-container").innerHTML = "";

        // let products = this.#productCatalogManager.products;

        fetch(`${this.#baseUrl}/products`)
            .then(
                response => response.json())
            .then(products => {
                products.forEach(product => {
                    var productTemplate = document.getElementById("product-template").content.cloneNode(true);

                    productTemplate.getElementById("product-image").setAttribute("src", product.img);
                    productTemplate.getElementById("product-name").innerHTML = product.name;
                    productTemplate.getElementById("product-price").innerHTML = "$" + product.price;
                    productTemplate.getElementById("product-quantity").value = 0;
                    productTemplate.getElementById("product-quantity").setAttribute("id", "product-quantity-id" + product.id);
                    productTemplate.getElementById("btn-add-to-cart").setAttribute("data-product-id", product.id);

                    document.getElementById("products-container").appendChild(productTemplate);
                });
            }).catch(error => console.log(error));
    }

    loadFilteredProducts() {
        document.getElementById("products-container").innerHTML = "";

        var searchKeyword = document.getElementById("search-input").value;
        // let products = this.#productCatalogManager.searchProducts(searchKeyword);

        fetch(`${this.#baseUrl}/products?keyword=${searchKeyword}`)
            .then(
                response => response.json())
            .then(products => {
                if (products.length == 0)
                    document.getElementById("products-container").innerHTML = "<h5 style='text-align: left' >No matching products found</h5>";
                else {
                    products.forEach(product => {
                        var productTemplate = document.getElementById("product-template").content.cloneNode(true);

                        productTemplate.getElementById("product-image").setAttribute("src", product.img);
                        productTemplate.getElementById("product-name").innerHTML = product.name;
                        productTemplate.getElementById("product-price").innerHTML = "$" + product.price;
                        productTemplate.getElementById("product-quantity").value = 0;
                        productTemplate.getElementById("product-quantity").setAttribute("id", "product-quantity-id" + product.id);
                        productTemplate.getElementById("btn-add-to-cart").setAttribute("data-product-id", product.id);

                        document.getElementById("products-container").appendChild(productTemplate);
                    });
                }
            });
    }

    addToCart(btnObj) {
        var productId = Number(btnObj.dataset.productId);
        var quantity = Number(document.getElementById("product-quantity-id" + productId).value);

        //this.#cartManager.updateCartItem(productId, quantity);

        fetch(`${this.#baseUrl}/cart`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: productId, qty: quantity })
        }).then(res => { this.loadCartSummaryDetails() })
    }

    deleteCartItem(id) {
        //this.#cartManager.deleteCartItem(id);
        fetch(`${this.#baseUrl}/cart/${id}`, {
            method: 'DELETE',
            mode: 'cors',
        }).then(res => {
            this.loadCartSummaryDetails();
        })
    }

    loadCartSummaryDetails() {
        fetch(`${this.#baseUrl}/cartsummary`)
            .then(res => res.json())
            .then(data => {
                document.querySelector("tbody").innerHTML = "";

                let priceCalculatedItems = data.cartSummary.priceCalculatedItems;

                priceCalculatedItems.forEach(priceCalculatedItem => {

                    fetch(`${this.#baseUrl}/products/${priceCalculatedItem.id}`)
                        .then(res => res.json())
                        .then(product => {
                            var rowTemplate = document.getElementById("cart-row").content.cloneNode(true);

                            var tds = rowTemplate.querySelectorAll("td");
                            tds[0].textContent = product.name;
                            tds[1].textContent = priceCalculatedItem.quantity;
                            tds[2].textContent = "$ " + product.price;
                            tds[3].textContent = "$ " + priceCalculatedItem.lineTotal;
                            tds[4].innerHTML = `<a href="#summary-table"  style = "color: red;
                                                text-decoration: none;" onclick = "viewManager.deleteCartItem(${product.id})">Remove</a>`;
                            document.querySelector("tbody").appendChild(rowTemplate);
                        })
                });

                document.getElementById("grand-total").textContent = "$ " + data.cartSummary.grandTotal;
            });
    }
}