module.exports =
    class Pricecalculator {
        #prodCatalogManager;
        #cartManager
        constructor(prodCatalogManager, cartManager) {
            this.#prodCatalogManager = prodCatalogManager;
            this.#cartManager = cartManager;
        }

        calculateTotalPrice() {
            let priceCalculatedItems = [];
            let grandTotal = 0;

            if (this.#cartManager.cartItems != undefined && this.#prodCatalogManager != undefined) {
                this.#cartManager.cartItems.forEach(item => {
                    let lineTotal = this.#prodCatalogManager.getPrice(item.id) * item.quantity;
                    priceCalculatedItems.push({
                        id: item.id,
                        quantity: item.quantity,
                        lineTotal: lineTotal
                    });
                    grandTotal += lineTotal;
                });
            }

            return {
                cartSummary: {
                    priceCalculatedItems: priceCalculatedItems,
                    grandTotal: grandTotal
                }
            };
        }

        applyOffers(summaryItems) {
            //to do later
        }

    }
