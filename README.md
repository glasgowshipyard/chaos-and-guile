# Chaos & Guile - Tactical Apparel Store

*By Strength and Guile* - Professional subversion through premium tactical apparel.

A sophisticated e-commerce platform built for operators who understand that sometimes the best approach isn't the most obvious one. Clean design meets tactical humor, powered by Printful integration and Cloudflare edge deployment.

## 🎯 Project Overview

Chaos & Guile is a premium tactical apparel brand that serves as an elegant counterpoint to traditional military brands. Where others go for "honest dogs," we embrace the dishonest cat approach - sophisticated, cunning, and professionally irreverent.

### Brand Philosophy
- **Professional Subversion**: We break conventions with style
- **Tactical Humor**: Smart jokes that operators appreciate  
- **Quality First**: Premium materials and designs
- **SBS Inspired**: "By Strength and Guile" vs "Who Dares Wins"

## 🏗️ Architecture

### Frontend (Cloudflare Pages)
- **Framework**: Vanilla JavaScript with Tailwind CSS
- **Design**: Clean, minimal, elegant pirate aesthetic
- **Features**: Shopping cart, product filtering, responsive design
- **Performance**: Sub-2s load times, edge-cached

### Backend (Cloudflare Workers)
- **API Proxy**: Secure Printful API integration
- **Order Processing**: Automated order creation and tracking
- **Payment Processing**: Stripe Checkout integration
- **Webhooks**: Real-time order status updates
- **Security**: API key protection, CORS handling

### E-commerce (Printful + Stripe Integration)
- **Print-on-Demand**: No inventory management needed
- **Product Sync**: Real-time product and pricing data
- **Payment Processing**: Secure Stripe Checkout sessions
- **Order Fulfillment**: Automatic order processing after payment
- **Shipping**: Global shipping via Printful network

## 🚀 Features

### Store Features
- **Product Catalog**: Clean grid with filtering by category
- **Shopping Cart**: Sliding sidebar with quantity controls
- **Stripe Checkout**: Secure payment processing with automatic order creation
- **Order Success**: Professional confirmation page with tracking info
- **Responsive Design**: Perfect on all devices
- **Real-time Updates**: Live inventory and pricing

### Technical Features
- **Edge Deployment**: Cloudflare Pages for global speed
- **API Security**: Workers proxy for safe API calls
- **Order Tracking**: Webhook integration for status updates
- **Cart Persistence**: LocalStorage cart across sessions
- **SEO Optimized**: Meta tags, semantic HTML, fast loading

## 📁 Project Structure

```
chaos-and-guile/
├── index.html                  # Main storefront
├── success.html               # Payment success page
├── css/
│   └── styles.css             # Custom Tailwind extensions
├── js/
│   ├── store.js               # Product and cart management with Stripe
│   ├── cart.js                # Shopping cart UI
│   └── main.js                # App initialization
├── workers/
│   └── printful-api.js        # Cloudflare Worker for API proxy and Stripe
├── assets/
│   └── images/                # Brand assets and product images
├── wrangler.toml              # Cloudflare Workers config
└── README.md                  # This file
```

## 🎨 Design System

### Colors
- **Primary**: Black (`#000000`) - Clean, professional background
- **Secondary**: White (`#ffffff`) - High contrast text and accents
- **Gray Scale**: Various grays for subtle elements
- **Hover States**: Smooth transitions between light/dark modes

### Typography
- **Headers**: JetBrains Mono - Technical, professional feel
- **Body**: Inter - Clean, readable, modern
- **Style**: ALL CAPS for emphasis, letter spacing for elegance
- **Source**: Bunny Fonts (privacy-friendly alternative to Google Fonts)

### Components
- **Product Cards**: Hover effects, clean imagery, responsive grid
- **Buttons**: Black/white theme with smooth transitions
- **Cart**: Sliding sidebar with elegant animations
- **Modals**: Dark overlay with focused content
- **Success Page**: Professional order confirmation layout

## 🛠️ Development Setup

### Prerequisites
- Node.js and npm (for Wrangler CLI)
- Cloudflare account
- Printful account and API key

### Local Development
```bash
# Clone the repository
git clone [your-repo-url]
cd chaos-and-guile

# Install Wrangler (Cloudflare CLI)
npm install -g wrangler

# Serve the frontend locally
python3 -m http.server 8000
# or
npx serve .

# Open http://localhost:8000
```

### Worker Development
```bash
# Login to Cloudflare
wrangler login

# Develop worker locally
wrangler dev workers/printful-api.js

# Deploy worker
wrangler deploy
```

## 🔧 Configuration

### Environment Variables
Set these in your Cloudflare Workers dashboard:

```bash
# Production
PRINTFUL_API_KEY=your_printful_api_key_here
PRINTFUL_WEBHOOK_SECRET=your_webhook_secret_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here

# Development  
PRINTFUL_API_KEY=your_dev_api_key_here
PRINTFUL_WEBHOOK_SECRET=your_dev_webhook_secret_here
STRIPE_SECRET_KEY=your_dev_stripe_secret_key_here
```

### Printful Setup
1. Create Printful account
2. Generate API key in Printful dashboard
3. Set up webhook endpoint pointing to your worker
4. Configure products in Printful store

### Stripe Setup
1. Create Stripe account
2. Get publishable and secret keys from dashboard
3. Add secret key to Cloudflare Workers environment
4. Update publishable key in store.js checkout function

### Cloudflare Setup
1. Connect GitHub repo to Cloudflare Pages
2. Set build command: *None* (static site)
3. Set output directory: `/` (root)
4. Deploy worker separately via Wrangler
5. Set environment variables in Workers dashboard

### Custom Domain Setup (chaosandguile.com)
1. Add domain to Cloudflare
2. Configure DNS to point to Cloudflare
3. Set up Pages custom domain: chaosandguile.com → Pages project
4. Configure Worker route: chaosandguile.com/api/* → Worker
5. Update API base URL in js/store.js to use domain

## 📦 Product Management

### Adding Products
Products are managed in Printful dashboard and automatically synced via API:

1. Create products in Printful with designs
2. Products appear automatically in store
3. Pricing and availability synced in real-time
4. Categories assigned automatically based on product type

### Mock Data
For development, the store includes mock products:
- Dishonest Cat Tee
- Chaos & Guile Hoodie  
- SBS Tribute Patch
- Tactical Coffee Mug
- Operator Beanie
- Stealth Sticker Pack

## 🛒 Order Flow

1. **Customer browses** products on storefront
2. **Adds items** to cart with size/quantity selection
3. **Proceeds to checkout** which creates Stripe checkout session
4. **Customer pays** securely via Stripe Checkout
5. **Payment success** triggers automatic Printful order creation
6. **Printful processes** order and begins fulfillment
7. **Customer receives** order confirmation and tracking
8. **Webhooks update** order status in real-time

## 🚀 Deployment

### Cloudflare Pages
```bash
# Connect GitHub repo to Cloudflare Pages
# Set build command: (leave empty)
# Set output directory: /
# Deploy automatically on git push
```

### Cloudflare Workers
```bash
# Deploy API worker
wrangler deploy workers/printful-api.js

# Configure routes in Cloudflare dashboard
# Route pattern: yourdomain.com/api/*
```

## 🔒 Security

- **API Keys**: Stored securely in Cloudflare Workers environment
- **Payment Processing**: All payments handled by Stripe (PCI compliant)
- **No Data Storage**: Zero user data retention for liability protection
- **CORS**: Proper headers for cross-origin requests
- **Webhooks**: Signature verification for Printful callbacks
- **Input Validation**: All user inputs sanitized
- **HTTPS**: All traffic encrypted end-to-end

## 📊 Analytics & Monitoring

- **Performance**: Web Vitals tracking
- **Errors**: Automatic error logging and reporting
- **Orders**: Track conversion rates and popular products
- **Users**: Anonymous usage analytics (privacy-first)

## 🧪 Testing

### Manual Testing Checklist
- [ ] Product catalog loads correctly
- [ ] Filtering works across all categories
- [ ] Cart functionality (add/remove/update)
- [ ] Stripe checkout flow with test cards
- [ ] Payment success page displays correctly
- [ ] Printful order creation after payment
- [ ] Responsive design on all screen sizes
- [ ] Order confirmation and tracking

### API Testing
```bash
# Test product endpoint
curl https://chaos-and-guile-api.dev-a4b.workers.dev/api/products

# Test Stripe checkout session creation
curl -X POST https://chaos-and-guile-api.dev-a4b.workers.dev/api/create-checkout-session \
  -H "Content-Type: application/json" \
  -d '{"items":[{"name":"Test Item","price":25.00,"quantity":1}],"total":25.00}'

# Test payment success (use real session ID from Stripe)
curl -X POST https://chaos-and-guile-api.dev-a4b.workers.dev/api/payment-success \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"cs_test_..."}'
```

## 🔄 Future Enhancements

### Planned Features
- [ ] Customer accounts and order history
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email marketing integration
- [ ] Social media sharing
- [ ] Advanced analytics dashboard

### Technical Improvements
- [ ] Progressive Web App (PWA) features
- [ ] Image optimization and lazy loading
- [ ] Advanced caching strategies
- [ ] A/B testing framework
- [ ] Internationalization support

## 🤝 Contributing

This is a brand-specific e-commerce platform. For suggestions or issues:

1. Create an issue describing the problem/enhancement
2. Include screenshots if relevant
3. Test thoroughly before submitting PRs
4. Follow existing code style and patterns

## 📄 License

All rights reserved. Chaos & Guile brand and associated designs are proprietary.

## 🐱 About the Brand

**Chaos & Guile** draws inspiration from:
- **SBS Motto**: "By Strength and Guile" 
- **Tactical Community**: Professional operators with sense of humor
- **Dishonest Cat**: Our mascot representing cunning over conventional approaches
- **Quality Focus**: Premium materials and thoughtful design

*For operators who understand that strength and guile triumph over conventional wisdom.*

---

**Built with ❤️ for dishonest cats worldwide** 🐱💀