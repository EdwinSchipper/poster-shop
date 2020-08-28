console.log("It works!");

var LOAD_NUM = 4;

new Vue({
    el: "#app",
    data: {
        total: 0,
        products: [
            // { title: "product 1", id: 1, price: 9.99 },
            // { title: "product 2", id: 2, price: 9.99 },
            // { title: "product 3", id: 3, price: 9.99 }
        ],
        cart: [],
        search: "cat",
        lastSearch: "",
        loading: false,
        results: [],
    },
    methods:  {
        addToCart: function(product){

            // Debug
            console.log(product); // current object
            console.log(this.total); // total from this element (app)
            
            // Real code
            this.total += product.price;
            var found = false;
            
            // Check cartitems exist
            for(var i =0; i < this.cart.length; i++) {
                if(this.cart[i].id === product.id) {
                    this.cart[i].qty++;
                    found = true;
                }
            }

            // Add item to cart array
            if(!found){
                this.cart.push({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    qty: 1
                });
            }

        },

        inc: function(item){
            item.qty++;
            this.total += item.price;
        },

        dec: function(item){
            console.log(item);
            item.qty--;
            this.total -= item.price;
            if(item.qty <= 0) {
                console.log(this.cart.indexOf(item));
                var i = this.cart.indexOf(item); // get the right item from the cart array
                this.cart.splice(i, 1); // remove the right item from cart
            }
        },

        onSubmit: function() {
            this.products = [];
            this.loading = true;

            var path = "/search?q=".concat(this.search);    // search from this element (app)
            this.$http.get(path)
                .then(function(response) {
                        console.log(response);
                        this.results = response.body;
                        this.products = response.body.slice(0, LOAD_NUM); // fill product array with search results
                        this.lastSearch = this.search;
                        this.loading = false;
                });
        }

    },
    filters: {
        currency: function(price) {
            return "$".concat(price.toFixed(2));
        }
    },
    created: function(){
        this.onSubmit ();
    }

});
