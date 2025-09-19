// Main application logic and initialization

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupProductFilters();
    setupScrollBehavior();
    setupMobileMenu();
    setupKeyboardNavigation();
    loadEnvironmentConfig();
}

// Product filtering
function setupProductFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter products
            const category = button.dataset.category;
            store.filterProducts(category);
        });
    });
}

// Smooth scrolling and navigation
function setupScrollBehavior() {
    // Smooth scroll to products
    window.scrollToProducts = function() {
        const productsSection = document.getElementById('products');
        if (productsSection) {
            productsSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    };

    // Header background on scroll
    const header = document.querySelector('nav');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.classList.add('bg-slate-900');
                header.classList.remove('bg-slate-900/95');
            } else {
                header.classList.add('bg-slate-900/95');
                header.classList.remove('bg-slate-900');
            }
        });
    }
}

// Mobile menu functionality
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
            }
        });
    }
}

// Keyboard navigation and accessibility
function setupKeyboardNavigation() {
    // Tab navigation for product cards
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const focused = document.activeElement;
            if (focused && focused.classList.contains('product-card')) {
                e.preventDefault();
                focused.click();
            }
        }
    });

    // Make product cards focusable
    document.addEventListener('DOMContentLoaded', () => {
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'button');
        });
    });
}

// Environment configuration
function loadEnvironmentConfig() {
    // Check if we're in development or production
    const isDev = window.location.hostname === 'localhost' || 
                  window.location.hostname === '127.0.0.1';
    
    if (isDev) {
        console.log('🔧 Development mode - using mock data');
        // Enable dev tools
        window.store = store; // Expose store for debugging
        window.cartUI = cartUI;
    } else {
        console.log('🚀 Production mode - Chaos & Guile operational');
    }
}

// Utility functions
function formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance monitoring
function measurePerformance() {
    if (window.performance && window.performance.mark) {
        window.performance.mark('app-start');
        
        window.addEventListener('load', () => {
            window.performance.mark('app-loaded');
            window.performance.measure('app-load-time', 'app-start', 'app-loaded');
            
            const measure = window.performance.getEntriesByName('app-load-time')[0];
            console.log(`⚡ App loaded in ${measure.duration.toFixed(2)}ms`);
        });
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Application error:', e.error);
    
    // In production, you might want to send this to an error tracking service
    if (!window.location.hostname.includes('localhost')) {
        // Track error in production
    }
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Analytics helper (for future integration)
function trackEvent(eventName, properties = {}) {
    // Placeholder for analytics integration
    console.log('📊 Event tracked:', eventName, properties);
    
    // Example: Google Analytics 4
    // gtag('event', eventName, properties);
    
    // Example: Plausible
    // plausible(eventName, { props: properties });
}

// Initialize performance monitoring
measurePerformance();

// SEO and social sharing helpers
function updatePageMeta(title, description, image) {
    document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = description;
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    
    if (ogTitle) ogTitle.content = title;
    if (ogDescription) ogDescription.content = description;
    if (ogImage && image) ogImage.content = image;
}

// Service worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('🔧 SW registered:', registration);
            })
            .catch(registrationError => {
                console.log('🔧 SW registration failed:', registrationError);
            });
    });
}

// Export functions for global access
window.scrollToProducts = scrollToProducts;
window.formatPrice = formatPrice;
window.trackEvent = trackEvent;