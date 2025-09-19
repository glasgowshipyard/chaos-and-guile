// Store functionality and state management

class TacticalStore {
    constructor() {
        this.products = [];
        this.cart = this.loadCart();
        this.currentFilter = 'all';
        this.apiBaseUrl = '/api'; // Will be handled by Cloudflare Workers
        this.initializeStore();
    }

    async initializeStore() {
        await this.loadProducts();
        this.renderProducts();
        this.updateCartUI();
    }

    // Mock products for development - will be replaced with Printful API
    getMockProducts() {
        return [
            {
                id: 1,
                name: "Dishonest Cat Tee",
                description: "Premium tactical tee featuring our signature dishonest cat skull design.",
                price: 28.00,
                originalPrice: null,
                category: "apparel",
                images: ["dishonest-cat-blk-bg-example.png"],
                sizes: ["S", "M", "L", "XL", "XXL"],
                variants: [
                    { id: 101, size: "S", price: 28.00, stock: 10 },
                    { id: 102, size: "M", price: 28.00, stock: 15 },
                    { id: 103, size: "L", price: 28.00, stock: 12 },
                    { id: 104, size: "XL", price: 28.00, stock: 8 },
                    { id: 105, size: "XXL", price: 30.00, stock: 5 }
                ],
                isNew: true,
                printfulId: null // Will be populated with real Printful product IDs
            },
            {
                id: 2,
                name: "Chaos & Guile Hoodie",
                description: "Heavy-duty hoodie for operators who work in the shadows.",
                price: 58.00,
                originalPrice: null,
                category: "apparel",
                images: ["https://via.placeholder.com/400x400/1a1f14/ffffff?text=Hoodie"],
                sizes: ["S", "M", "L", "XL", "XXL"],
                variants: [
                    { id: 201, size: "S", price: 58.00, stock: 8 },
                    { id: 202, size: "M", price: 58.00, stock: 12 },
                    { id: 203, size: "L", price: 58.00, stock: 10 },
                    { id: 204, size: "XL", price: 58.00, stock: 6 },
                    { id: 205, size: "XXL", price: 62.00, stock: 4 }
                ],
                isNew: false
            },
            {
                id: 3,
                name: "SBS Tribute Patch",
                description: "Velcro patch paying homage to strength and guile operations.",
                price: 12.00,
                originalPrice: null,
                category: "patches",
                images: ["https://via.placeholder.com/400x400/4a5d23/ffffff?text=Patch"],
                sizes: ["One Size"],
                variants: [
                    { id: 301, size: "One Size", price: 12.00, stock: 25 }
                ],
                isNew: true
            },
            {
                id: 4,
                name: "Tactical Coffee Mug",
                description: "Ceramic mug for proper mission fuel. Dishonest cats need caffeine too.",
                price: 18.00,
                originalPrice: 22.00,
                category: "accessories",
                images: ["https://via.placeholder.com/400x400/2d3748/ffffff?text=Mug"],
                sizes: ["11oz", "15oz"],
                variants: [
                    { id: 401, size: "11oz", price: 18.00, stock: 15 },
                    { id: 402, size: "15oz", price: 22.00, stock: 10 }
                ],
                isNew: false,
                onSale: true
            },
            {
                id: 5,
                name: "Operator Beanie",
                description: "Low-profile beanie for covert operations in cold climates.",
                price: 24.00,
                originalPrice: null,
                category: "accessories",
                images: ["https://via.placeholder.com/400x400/1a1f14/ffffff?text=Beanie"],
                sizes: ["One Size"],
                variants: [
                    { id: 501, size: "One Size", price: 24.00, stock: 20 }
                ],
                isNew: false
            },
            {
                id: 6,
                name: "Stealth Sticker Pack",
                description: "Collection of tactical stickers for gear marking and morale.",
                price: 8.00,
                originalPrice: null,
                category: "accessories",
                images: ["https://via.placeholder.com/400x400/4a5d23/ffffff?text=Stickers"],
                sizes: ["Pack"],
                variants: [
                    { id: 601, size: "Pack", price: 8.00, stock: 50 }
                ],
                isNew: true
            }
        ];
    }

    async loadProducts() {
        try {
            // For now, use mock data. Later, this will call Printful API via Cloudflare Workers
            // const response = await fetch(`${this.apiBaseUrl}/products`);
            // this.products = await response.json();
            
            this.products = this.getMockProducts();
        } catch (error) {
            console.error('Failed to load products:', error);
            this.products = this.getMockProducts(); // Fallback to mock data
        }
    }

    filterProducts(category) {
        this.currentFilter = category;
        this.renderProducts();
    }

    getFilteredProducts() {
        if (this.currentFilter === 'all') {
            return this.products;
        }
        return this.products.filter(product => product.category === this.currentFilter);
    }

    renderProducts() {
        const grid = document.getElementById('products-grid');
        const loading = document.getElementById('loading');
        
        if (!grid) return;

        loading.style.display = 'none';
        
        const filteredProducts = this.getFilteredProducts();
        
        if (filteredProducts.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12">
                    <p class="text-gray-400 text-lg">No products found in this category.</p>
                    <p class="text-gray-500 text-sm mt-2">Check back soon for new tactical gear.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = filteredProducts.map(product => this.renderProductCard(product)).join('');
    }

    renderProductCard(product) {
        const badge = product.isNew ? '<div class="badge-new">NEW</div>' : 
                     product.onSale ? '<div class="badge-sale">SALE</div>' : '';
        
        const priceHtml = product.originalPrice ? 
            `<span class="price">$${product.price.toFixed(2)}</span> <span class="price-original">$${product.originalPrice.toFixed(2)}</span>` :
            `<span class="price">$${product.price.toFixed(2)}</span>`;

        return `
            <div class="product-card group cursor-pointer" onclick="store.openProductModal(${product.id})">
                <div class="relative overflow-hidden">
                    ${badge}
                    <img src="${product.images[0]}" alt="${product.name}" 
                         class="product-image w-full h-64 object-cover bg-slate-700">
                </div>
                <div class="p-4">
                    <h3 class="font-semibold text-lg mb-2 group-hover:text-tactical-green transition-colors">
                        ${product.name}
                    </h3>
                    <p class="text-gray-400 text-sm mb-3 line-clamp-2">
                        ${product.description}
                    </p>
                    <div class="flex justify-between items-center">
                        <div class="flex items-baseline space-x-2">
                            ${priceHtml}
                        </div>
                        <button onclick="event.stopPropagation(); store.quickAddToCart(${product.id})" 
                                class="btn-primary text-sm px-3 py-1">
                            ADD
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    openProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const modal = document.createElement('div');
        modal.className = 'modal-backdrop';
        modal.innerHTML = `
            <div class="modal-content p-6 max-h-[90vh] overflow-y-auto">
                <div class="flex justify-between items-start mb-4">
                    <h2 class="text-2xl font-bold font-display">${product.name}</h2>
                    <button onclick="this.closest('.modal-backdrop').remove()" class="text-gray-400 hover:text-white">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <img src="${product.images[0]}" alt="${product.name}" class="w-full h-auto bg-slate-700">
                    </div>
                    
                    <div class="space-y-4">
                        <div class="flex items-baseline space-x-2">
                            ${product.originalPrice ? 
                                `<span class="text-2xl font-bold text-tactical-green">$${product.price.toFixed(2)}</span>
                                 <span class="text-lg text-gray-500 line-through">$${product.originalPrice.toFixed(2)}</span>` :
                                `<span class="text-2xl font-bold text-tactical-green">$${product.price.toFixed(2)}</span>`
                            }
                        </div>
                        
                        <p class="text-gray-300">${product.description}</p>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">Size:</label>
                            <div class="flex flex-wrap gap-2">
                                ${product.sizes.map(size => {
                                    const variant = product.variants.find(v => v.size === size);
                                    const available = variant && variant.stock > 0;
                                    return `
                                        <button class="size-option ${!available ? 'unavailable' : ''}" 
                                                data-size="${size}" 
                                                data-variant-id="${variant ? variant.id : ''}"
                                                ${!available ? 'disabled' : ''}>
                                            ${size}
                                        </button>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-sm font-medium mb-2">Quantity:</label>
                            <div class="flex items-center space-x-2">
                                <button class="quantity-btn" onclick="this.nextElementSibling.stepDown()">−</button>
                                <input type="number" class="quantity-input" value="1" min="1" max="10">
                                <button class="quantity-btn" onclick="this.previousElementSibling.stepUp()">+</button>
                            </div>
                        </div>
                        
                        <button onclick="store.addToCartFromModal(${product.id}, this)" 
                                class="w-full btn-primary py-3 text-lg">
                            ADD TO CART
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Size selection logic
        modal.querySelectorAll('.size-option:not(.unavailable)').forEach(btn => {
            btn.addEventListener('click', () => {
                modal.querySelectorAll('.size-option').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            });
        });

        // Auto-select first available size
        const firstAvailable = modal.querySelector('.size-option:not(.unavailable)');
        if (firstAvailable) {
            firstAvailable.classList.add('selected');
        }
    }

    quickAddToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        // Use first available variant
        const availableVariant = product.variants.find(v => v.stock > 0);
        if (!availableVariant) {
            alert('Sorry, this item is currently out of stock.');
            return;
        }

        this.addToCart(product, availableVariant, 1);
    }

    addToCartFromModal(productId, buttonElement) {
        const modal = buttonElement.closest('.modal-backdrop');
        const selectedSize = modal.querySelector('.size-option.selected');
        const quantity = parseInt(modal.querySelector('.quantity-input').value);
        
        if (!selectedSize) {
            alert('Please select a size.');
            return;
        }

        const product = this.products.find(p => p.id === productId);
        const variantId = selectedSize.dataset.variantId;
        const variant = product.variants.find(v => v.id == variantId);

        if (!variant || variant.stock < quantity) {
            alert('Sorry, not enough stock available.');
            return;
        }

        this.addToCart(product, variant, quantity);
        modal.remove();
    }

    addToCart(product, variant, quantity) {
        const existingItem = this.cart.find(item => 
            item.productId === product.id && item.variantId === variant.id
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                productId: product.id,
                variantId: variant.id,
                name: product.name,
                size: variant.size,
                price: variant.price,
                quantity: quantity,
                image: product.images[0]
            });
        }

        this.saveCart();
        this.updateCartUI();
        this.showCartNotification();
    }

    removeFromCart(productId, variantId) {
        this.cart = this.cart.filter(item => 
            !(item.productId === productId && item.variantId === variantId)
        );
        this.saveCart();
        this.updateCartUI();
    }

    updateCartQuantity(productId, variantId, newQuantity) {
        const item = this.cart.find(item => 
            item.productId === productId && item.variantId === variantId
        );
        
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(productId, variantId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
                this.updateCartUI();
            }
        }
    }

    getCartTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getCartItemCount() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    updateCartUI() {
        const cartCount = document.getElementById('cart-count');
        const cartTotal = document.getElementById('cart-total');
        const cartItems = document.getElementById('cart-items');
        const cartEmpty = document.getElementById('cart-empty');
        const checkoutBtn = document.getElementById('checkout-btn');

        const itemCount = this.getCartItemCount();
        const total = this.getCartTotal();

        // Update cart count badge
        if (cartCount) {
            cartCount.textContent = itemCount;
            cartCount.style.opacity = itemCount > 0 ? '1' : '0';
        }

        // Update cart total
        if (cartTotal) {
            cartTotal.textContent = `$${total.toFixed(2)}`;
        }

        // Update checkout button state
        if (checkoutBtn) {
            checkoutBtn.disabled = itemCount === 0;
        }

        // Render cart items
        if (cartItems && cartEmpty) {
            if (this.cart.length === 0) {
                cartEmpty.style.display = 'block';
                cartItems.innerHTML = '';
            } else {
                cartEmpty.style.display = 'none';
                cartItems.innerHTML = this.cart.map(item => this.renderCartItem(item)).join('');
            }
        }
    }

    renderCartItem(item) {
        return `
            <div class="cart-item">
                <div class="flex space-x-3">
                    <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover bg-slate-700 flex-shrink-0">
                    <div class="flex-1 min-w-0">
                        <h4 class="font-medium truncate">${item.name}</h4>
                        <p class="text-sm text-gray-400">Size: ${item.size}</p>
                        <p class="text-sm font-medium text-tactical-green">$${item.price.toFixed(2)}</p>
                    </div>
                    <div class="flex flex-col items-end space-y-2">
                        <button onclick="store.removeFromCart(${item.productId}, ${item.variantId})" 
                                class="text-gray-400 hover:text-red-400 transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                            </svg>
                        </button>
                        <div class="flex items-center space-x-1">
                            <button onclick="store.updateCartQuantity(${item.productId}, ${item.variantId}, ${item.quantity - 1})" 
                                    class="quantity-btn text-xs">−</button>
                            <span class="w-8 text-center text-sm">${item.quantity}</span>
                            <button onclick="store.updateCartQuantity(${item.productId}, ${item.variantId}, ${item.quantity + 1})" 
                                    class="quantity-btn text-xs">+</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    showCartNotification() {
        // Simple notification - could be enhanced with a toast library
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-tactical-green text-white px-4 py-2 z-50 transition-all duration-300 transform translate-x-full';
        notification.textContent = 'Item added to cart!';
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(full)';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    saveCart() {
        localStorage.setItem('chaosGuilCart', JSON.stringify(this.cart));
    }

    loadCart() {
        try {
            const saved = localStorage.getItem('chaosGuilCart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartUI();
    }

    // Checkout functionality - will integrate with Printful API
    async checkout() {
        if (this.cart.length === 0) return;

        try {
            // Show loading state
            const checkoutBtn = document.getElementById('checkout-btn');
            const originalText = checkoutBtn.textContent;
            checkoutBtn.textContent = 'PROCESSING...';
            checkoutBtn.disabled = true;

            // This will call Cloudflare Workers endpoint to create Printful order
            const orderData = {
                items: this.cart,
                total: this.getCartTotal(),
                // Customer info will be collected in checkout form
            };

            // For now, simulate checkout
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            alert('Order simulation complete! Integration with Printful coming soon.');
            this.clearCart();

        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Checkout failed. Please try again.');
        } finally {
            const checkoutBtn = document.getElementById('checkout-btn');
            checkoutBtn.textContent = 'SECURE CHECKOUT';
            checkoutBtn.disabled = false;
        }
    }
}

// Initialize store
const store = new TacticalStore();