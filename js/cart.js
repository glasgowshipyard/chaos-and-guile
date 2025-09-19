// Shopping cart UI interactions

class CartUI {
    constructor() {
        this.sidebar = document.getElementById('cart-sidebar');
        this.overlay = document.getElementById('cart-overlay');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Cart toggle
        const cartToggle = document.getElementById('cart-toggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', () => this.openCart());
        }

        // Cart close
        const cartClose = document.getElementById('cart-close');
        if (cartClose) {
            cartClose.addEventListener('click', () => this.closeCart());
        }

        // Overlay close
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeCart());
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.handleCheckout());
        }

        // Escape key to close cart
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isCartOpen()) {
                this.closeCart();
            }
        });
    }

    openCart() {
        if (this.sidebar) {
            this.sidebar.classList.add('cart-open');
        }
        if (this.overlay) {
            this.overlay.classList.add('overlay-visible');
        }
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        if (this.sidebar) {
            this.sidebar.classList.remove('cart-open');
        }
        if (this.overlay) {
            this.overlay.classList.remove('overlay-visible');
        }
        document.body.style.overflow = '';
    }

    isCartOpen() {
        return this.sidebar ? this.sidebar.classList.contains('cart-open') : false;
    }

    async handleCheckout() {
        if (store.cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // For full integration, this would open a checkout modal or redirect
        // For now, we'll simulate the process
        const proceed = confirm(
            `Proceed to checkout with ${store.getCartItemCount()} items totaling $${store.getCartTotal().toFixed(2)}?`
        );

        if (proceed) {
            await store.checkout();
            this.closeCart();
        }
    }

    // Animation helpers
    animateCartItem(element, animation = 'add') {
        if (!element) return;

        switch (animation) {
            case 'add':
                element.style.transform = 'translateX(-100%)';
                element.style.opacity = '0';
                setTimeout(() => {
                    element.style.transition = 'all 0.3s ease';
                    element.style.transform = 'translateX(0)';
                    element.style.opacity = '1';
                }, 50);
                break;

            case 'remove':
                element.style.transition = 'all 0.3s ease';
                element.style.transform = 'translateX(100%)';
                element.style.opacity = '0';
                setTimeout(() => {
                    element.remove();
                }, 300);
                break;
        }
    }

    // Update cart badge with animation
    updateCartBadge(count) {
        const badge = document.getElementById('cart-count');
        if (!badge) return;

        // Animate the change
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => {
            badge.style.transform = 'scale(1)';
        }, 150);

        // Update visibility
        badge.style.opacity = count > 0 ? '1' : '0';
    }

    // Show mini cart preview on hover (future enhancement)
    showMiniCart() {
        // Implementation for mini cart preview on desktop
    }
}

// Initialize cart UI
const cartUI = new CartUI();