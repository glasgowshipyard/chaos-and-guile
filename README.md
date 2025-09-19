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
- **Webhooks**: Real-time order status updates
- **Security**: API key protection, CORS handling

### E-commerce (Printful Integration)
- **Print-on-Demand**: No inventory management needed
- **Product Sync**: Real-time product and pricing data
- **Order Fulfillment**: Automatic order processing
- **Shipping**: Global shipping via Printful network

## 🚀 Features

### Store Features
- **Product Catalog**: Clean grid with filtering by category
- **Shopping Cart**: Sliding sidebar with quantity controls
- **Checkout**: Secure order processing via Printful API
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
├── css/
│   └── styles.css             # Custom Tailwind extensions
├── js/
│   ├── store.js               # Product and cart management
│   ├── cart.js                # Shopping cart UI
│   └── main.js                # App initialization
├── workers/
│   └── printful-api.js        # Cloudflare Worker for API proxy
├── assets/
│   └── images/                # Brand assets and product images
├── wrangler.toml              # Cloudflare Workers config
└── README.md                  # This file
```

## 🎨 Design System

### Colors
- **Primary**: Slate 900 (`#0f172a`) - Deep tactical background
- **Accent**: Tactical Green (`#4a5d23`) - Military-inspired highlight
- **Text**: White/Gray scale for maximum contrast
- **Borders**: Subtle grays for clean separation

### Typography
- **Headers**: JetBrains Mono - Technical, tactical feel
- **Body**: Inter - Clean, readable, professional
- **Style**: ALL CAPS for emphasis, tracking for spacing

### Components
- **Product Cards**: Hover effects, clean imagery
- **Buttons**: Tactical green with smooth transitions
- **Cart**: Sliding sidebar with elegant animations
- **Modals**: Dark overlay with focused content

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

# Development  
PRINTFUL_API_KEY=your_dev_api_key_here
PRINTFUL_WEBHOOK_SECRET=your_dev_webhook_secret_here
```

### Printful Setup
1. Create Printful account
2. Generate API key in Printful dashboard
3. Set up webhook endpoint pointing to your worker
4. Configure products in Printful store

### Cloudflare Setup
1. Connect GitHub repo to Cloudflare Pages
2. Set build command: *None* (static site)
3. Set output directory: `/` (root)
4. Deploy worker separately via Wrangler

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
3. **Proceeds to checkout** with shipping info
4. **Order submitted** via Workers to Printful API
5. **Printful processes** order and begins fulfillment
6. **Customer receives** order confirmation and tracking
7. **Webhooks update** order status in real-time

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

- **API Keys**: Stored securely in Cloudflare Workers
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
- [ ] Checkout flow with Printful integration
- [ ] Responsive design on all screen sizes
- [ ] Order confirmation and tracking

### API Testing
```bash
# Test product endpoint
curl https://your-worker.workers.dev/api/products

# Test order creation
curl -X POST https://your-worker.workers.dev/api/order \
  -H "Content-Type: application/json" \
  -d '{"recipient":{"name":"Test"},"items":[...]}'
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