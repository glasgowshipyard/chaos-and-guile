# Chaos & Guile - Development Documentation

## Implementation Details

### Architecture Overview

**Chaos & Guile** is a complete e-commerce platform built on Cloudflare's edge infrastructure, integrating Printful for print-on-demand fulfillment and Stripe for payment processing.

### Technology Stack

- **Frontend**: Vanilla JavaScript + Tailwind CSS
- **Backend**: Cloudflare Workers (serverless)
- **Database**: None (stateless architecture)
- **Payments**: Stripe Checkout
- **Fulfillment**: Printful API
- **Fonts**: Bunny Fonts (privacy-friendly)
- **Deployment**: Cloudflare Pages + Workers

### Key Design Decisions

1. **No User Data Storage**: Zero liability approach - no customer data stored
2. **Stateless Architecture**: All state managed client-side or via external APIs
3. **Edge-First**: Cloudflare Workers for global performance
4. **Print-on-Demand**: No inventory management required
5. **Payment-First**: Orders only created after successful payment

## File Structure & Responsibilities

### Frontend Files

**index.html**
- Main storefront with product grid and shopping cart
- Includes Stripe.js for checkout processing
- Uses Bunny Fonts for privacy compliance
- Responsive design with light/dark mode toggle

**success.html**
- Payment confirmation page
- Clears cart after successful payment
- Notifies backend of successful payment for order creation
- Professional order processing information

**css/styles.css**
- Custom Tailwind CSS extensions
- Black/white theme with smooth transitions
- Component-specific styling for cart, modals, and buttons

**js/store.js**
- Product catalog management
- Shopping cart functionality
- Stripe checkout integration
- Product modal and filtering logic

**js/cart.js**
- Shopping cart UI management
- Cart sidebar animations
- Quantity controls and item removal

**js/main.js**
- Application initialization
- Theme toggle functionality
- Cart sidebar controls
- Utility functions

### Backend Implementation

**workers/printful-api.js**
- Cloudflare Worker handling all API interactions
- Endpoints:
  - `/api/products` - Fetch products from Printful
  - `/api/create-checkout-session` - Create Stripe checkout
  - `/api/payment-success` - Process successful payments
  - `/api/webhook` - Handle Printful webhooks

## API Integrations

### Printful Integration

**Product Fetching**
```javascript
// Fetches all products with detailed variant information
const response = await fetch('https://api.printful.com/store/products', {
    headers: {
        'Authorization': `Bearer ${env.PRINTFUL_API_KEY}`,
        'Content-Type': 'application/json'
    }
});
```

**Order Creation**
```javascript
// Creates order in Printful after successful payment
const printfulOrder = {
    recipient: {
        name: session.shipping_details.name,
        address1: session.shipping_details.address.line1,
        // ... shipping details from Stripe
    },
    items: orderData.items.map(item => ({
        variant_id: item.variantId,
        quantity: item.quantity,
        retail_price: item.price.toFixed(2),
    }))
};
```

### Stripe Integration

**Checkout Session Creation**
```javascript
// Creates secure checkout session
const session = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/`,
        shipping_address_collection: {
            allowed_countries: ['US', 'CA', 'GB', 'AU'],
        },
        metadata: {
            order_data: JSON.stringify(orderData),
        },
    })
});
```

**Payment Success Handling**
```javascript
// Retrieves session and creates Printful order
const session = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
    headers: {
        'Authorization': `Bearer ${env.STRIPE_SECRET_KEY}`,
    }
});

if (session.payment_status === 'paid') {
    // Create order in Printful with shipping details from Stripe
}
```

## Data Flow

### Order Processing Flow

1. **Product Browsing**
   - Frontend loads products from `/api/products`
   - Products cached client-side for performance
   - Real-time pricing from Printful API

2. **Cart Management**
   - Items stored in localStorage
   - Cart persists across browser sessions
   - No server-side cart storage

3. **Checkout Process**
   - Cart data sent to `/api/create-checkout-session`
   - Stripe session created with line items
   - Customer redirected to Stripe Checkout

4. **Payment Processing**
   - Stripe handles all payment processing
   - Customer completes payment securely
   - Success URL includes session ID

5. **Order Creation**
   - Success page calls `/api/payment-success`
   - Worker retrieves Stripe session details
   - Order created in Printful with shipping info
   - Cart cleared from localStorage

### Product Data Transformation

**Printful API Response → Store Format**
```javascript
function transformProductWithVariants(printfulProduct) {
    const baseProduct = transformProduct(printfulProduct.sync_product);
    
    baseProduct.variants = printfulProduct.sync_variants.map(variant => ({
        id: variant.id,
        size: variant.size || 'One Size',
        color: variant.color || '',
        price: parseFloat(variant.retail_price || 0),
        stock: 100, // Printful manages stock
        sku: variant.sku
    }));

    baseProduct.sizes = [...new Set(baseProduct.variants.map(v => v.size))];
    baseProduct.price = Math.min(...baseProduct.variants.map(v => v.price));
    
    return baseProduct;
}
```

## Security Implementation

### API Key Protection
- All API keys stored in Cloudflare Workers environment
- No sensitive data exposed to frontend
- Worker acts as secure proxy

### Payment Security
- No payment data stored locally
- All transactions handled by Stripe
- PCI compliance through Stripe

### CORS Configuration
```javascript
function getCORSHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
    };
}
```

### Input Validation
- All user inputs sanitized
- Cart data validated before checkout
- Order data validated before Printful submission

## Performance Optimizations

### Edge Computing
- Cloudflare Workers run at edge locations globally
- Sub-100ms response times worldwide
- Automatic scaling and load balancing

### Caching Strategy
- Static assets cached at CDN edge
- Product data cached client-side
- API responses use appropriate cache headers

### Bundle Optimization
- Vanilla JavaScript (no framework overhead)
- Tailwind CSS via CDN (considering build optimization)
- Minimal external dependencies

## Error Handling

### API Error Handling
```javascript
try {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }
    return await response.json();
} catch (error) {
    console.error('API request failed:', error);
    return { success: false, error: error.message };
}
```

### User Error Handling
- Graceful degradation for API failures
- Clear error messages for users
- Retry mechanisms for transient failures
- Fallback to cached data when available

## Deployment Process

### Cloudflare Pages Deployment
```bash
# Automatic deployment on git push
# No build process required (static site)
# Environment variables set in dashboard
```

### Worker Deployment
```bash
# Deploy worker with wrangler
npx wrangler deploy workers/printful-api.js

# Set environment variables
wrangler secret put PRINTFUL_API_KEY
wrangler secret put STRIPE_SECRET_KEY
```

### Environment Configuration
- Production and development environments
- Separate API keys for each environment
- Domain routing configuration

## Testing Strategy

### Manual Testing
- Product catalog loading
- Cart functionality (add/remove/update)
- Stripe checkout with test cards
- Payment success flow
- Printful order creation
- Responsive design testing

### API Testing
```bash
# Test product fetching
curl https://chaos-guile-api.dev-a4b.workers.dev/api/products

# Test checkout session creation
curl -X POST https://chaos-guile-api.dev-a4b.workers.dev/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"Test","price":25.00,"quantity":1}],"total":25.00}'
```

### Test Data
- Stripe test cards for payment testing
- Printful sandbox environment for order testing
- Mock product data for development

## Monitoring & Analytics

### Error Monitoring
- Cloudflare Workers analytics
- Console logging for debugging
- Error tracking for API failures

### Performance Monitoring
- Core Web Vitals tracking
- API response time monitoring
- Conversion funnel analysis

### Business Metrics
- Product view tracking
- Cart abandonment rates
- Conversion rates by product
- Order success rates

## Future Optimizations

### Technical Improvements
- Progressive Web App (PWA) features
- Service worker for offline functionality
- Image optimization and lazy loading
- Advanced caching strategies

### Business Features
- Customer account system
- Order history tracking
- Email marketing integration
- Inventory management integration

## Development Workflow

### Local Development
```bash
# Serve frontend locally
python3 -m http.server 8000

# Develop worker locally
wrangler dev workers/printful-api.js

# Test integration locally
# Update API base URL to local worker
```

### Git Workflow
- Feature branches for new development
- Automatic deployment on main branch
- Environment-specific configurations

### Code Standards
- Vanilla JavaScript with modern ES6+ features
- Consistent naming conventions
- Comprehensive error handling
- Clear documentation and comments

## Brand Implementation

### Design Philosophy
- Clean, professional aesthetic
- Black and white color scheme
- Elegant typography with Bunny Fonts
- Minimal, focused user experience

### Brand Elements
- "Dishonest Cat" mascot and logo
- "CHAOS & GUILE" branding throughout
- Professional yet playful tone
- Quality-focused messaging

This documentation provides a complete reference for understanding, maintaining, and extending the Chaos & Guile e-commerce platform.