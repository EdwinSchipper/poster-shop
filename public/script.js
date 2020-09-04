var LOAD_NUM = 4;
var watcher;

new Vue({
    el: "#app",
    data: {
        total: 0,
        products: [
            // { title: "product 1", id: 1, price: 9.99 }
            // Is now dynamic from search request!
        ],
        cart: [],
        search: "cat",
        lastSearch: "",
        loading: false,
        results: [],
    },

    // Functions
    methods:  {
        addToCart: function(product){

            // Debug
            console.log('Current product object: ');
            console.log(product);
            console.log('Total price from element(#app): ');
            console.log(this.total);
            
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
            console.log('Current item: ');
            console.log(item);
            item.qty++;
            this.total += item.price;
        },

        dec: function(item){
            console.log('Current item: ');
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
            this.results = [];
            this.loading = true;
            var path = "/search?q=".concat(this.search);    // search from this element (app)
            this.$http.get(path)
                .then(function(response) {
                        console.log('Response from search: ');    
                        console.log(response);
                        this.results = response.body;
                        // this.products = response.body.slice(0, LOAD_NUM); // fill product array with search results
                        this.lastSearch = this.search;
                        this.appendResults();
                        this.loading = false;
                });
        },

        appendResults: function() {
            console.log('Append results:');
            console.log(this.products);
            console.log(this.results);
            if(this.products.length < this.results.length) {
                var toAppend = this.results.slice(
                    this.products.length, 
                    LOAD_NUM + this.products.length
                    );
                    this.products = this.products.concat(toAppend);
            }
        }
    },
    

    // Filters
    filters: {
        currency: function(price) {
            return "$".concat(price.toFixed(2));
        }
    },


    // Livecycle hooks
    created: function(){
        this.onSubmit ();
    },
    updated: function(){
        var sensor = document.querySelector('#product-list-bottom');
        watcher = scrollMonitor.create(sensor);
        watcher.enterViewport(this.appendResults);
    },
    beforeUpdate: function(){
        if(watcher) {
            watcher.destroy();
            watchter = null;
        }
        
    }

});