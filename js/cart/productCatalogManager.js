module.exports =
    class ProductCatalogManager {
        #products;
        constructor(products) {
            this.#products = products;
        }

        get products() {
            return [...this.#products];
        }

        getProducts(keyword) {
            if (keyword === '' || keyword == undefined)
                return [...this.#products];
            else
                return this.#products.filter(item => item.name.toUpperCase().includes(keyword.toUpperCase()));
        }

        getProduct(id) {
            return this.#products.find(item => item.id == id);
        }

        getPrice(id) {
            let matchedItem = this.#products.find(item => item.id == id);

            if (matchedItem != undefined)
                return matchedItem.price;
            else
                return 0; //to do later
        }
    }
