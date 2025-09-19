// Cloudflare Worker for Printful API integration
// This worker acts as a secure proxy between the frontend and Printful API

export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return handleCORS();
        }

        try {
            const url = new URL(request.url);
            const path = url.pathname;

            // Route API requests
            switch (path) {
                case '/api/products':
                    return await handleGetProducts(request, env);
                
                case '/api/product':
                    return await handleGetProduct(request, env);
                
                case '/api/order':
                    return await handleCreateOrder(request, env);
                
                case '/api/webhook':
                    return await handleWebhook(request, env);
                
                default:
                    return new Response('Not Found', { 
                        status: 404,
                        headers: getCORSHeaders()
                    });
            }
        } catch (error) {
            console.error('Worker error:', error);
            return new Response(JSON.stringify({ 
                error: 'Internal Server Error',
                message: error.message 
            }), {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    ...getCORSHeaders()
                }
            });
        }
    }
};

// Get products from Printful store
async function handleGetProducts(request, env) {
    const printfulResponse = await fetch('https://api.printful.com/store/products', {
        headers: {
            'Authorization': `Bearer ${env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    if (!printfulResponse.ok) {
        throw new Error(`Printful API error: ${printfulResponse.status}`);
    }

    const data = await printfulResponse.json();
    
    // Transform Printful data to our format
    const products = data.result.map(transformProduct);

    return new Response(JSON.stringify({ products }), {
        headers: {
            'Content-Type': 'application/json',
            ...getCORSHeaders()
        }
    });
}

// Get single product with variants
async function handleGetProduct(request, env) {
    const url = new URL(request.url);
    const productId = url.searchParams.get('id');

    if (!productId) {
        return new Response(JSON.stringify({ error: 'Product ID required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                ...getCORSHeaders()
            }
        });
    }

    const printfulResponse = await fetch(`https://api.printful.com/store/products/${productId}`, {
        headers: {
            'Authorization': `Bearer ${env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json'
        }
    });

    if (!printfulResponse.ok) {
        throw new Error(`Printful API error: ${printfulResponse.status}`);
    }

    const data = await printfulResponse.json();
    const product = transformProductWithVariants(data.result);

    return new Response(JSON.stringify({ product }), {
        headers: {
            'Content-Type': 'application/json',
            ...getCORSHeaders()
        }
    });
}

// Create order in Printful
async function handleCreateOrder(request, env) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { 
            status: 405,
            headers: getCORSHeaders()
        });
    }

    const orderData = await request.json();
    
    // Validate order data
    if (!orderData.recipient || !orderData.items || orderData.items.length === 0) {
        return new Response(JSON.stringify({ 
            error: 'Invalid order data' 
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                ...getCORSHeaders()
            }
        });
    }

    // Transform order to Printful format
    const printfulOrder = {
        recipient: {
            name: orderData.recipient.name,
            company: orderData.recipient.company || '',
            address1: orderData.recipient.address1,
            address2: orderData.recipient.address2 || '',
            city: orderData.recipient.city,
            state_code: orderData.recipient.state_code,
            country_code: orderData.recipient.country_code || 'US',
            zip: orderData.recipient.zip,
            phone: orderData.recipient.phone || '',
            email: orderData.recipient.email
        },
        items: orderData.items.map(item => ({
            variant_id: item.variant_id,
            quantity: item.quantity,
            retail_price: item.retail_price || item.price
        })),
        retail_costs: {
            shipping: orderData.shipping_cost || 0,
            tax: orderData.tax || 0
        }
    };

    // Create order in Printful
    const printfulResponse = await fetch('https://api.printful.com/orders', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.PRINTFUL_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(printfulOrder)
    });

    if (!printfulResponse.ok) {
        const errorData = await printfulResponse.json();
        throw new Error(`Printful order creation failed: ${JSON.stringify(errorData)}`);
    }

    const orderResult = await printfulResponse.json();

    return new Response(JSON.stringify({ 
        success: true,
        order: orderResult.result
    }), {
        headers: {
            'Content-Type': 'application/json',
            ...getCORSHeaders()
        }
    });
}

// Handle Printful webhooks
async function handleWebhook(request, env) {
    if (request.method !== 'POST') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const webhookData = await request.json();
    
    // Verify webhook signature (recommended for production)
    // const signature = request.headers.get('X-Printful-Signature');
    // if (!verifyWebhookSignature(webhookData, signature, env.PRINTFUL_WEBHOOK_SECRET)) {
    //     return new Response('Unauthorized', { status: 401 });
    // }

    // Process webhook events
    switch (webhookData.type) {
        case 'order_updated':
            console.log('Order updated:', webhookData.data);
            // Handle order status updates
            break;
        
        case 'order_shipped':
            console.log('Order shipped:', webhookData.data);
            // Handle shipping notifications
            break;
        
        case 'order_failed':
            console.log('Order failed:', webhookData.data);
            // Handle failed orders
            break;
        
        default:
            console.log('Unknown webhook type:', webhookData.type);
    }

    return new Response('OK', { status: 200 });
}

// Transform Printful product to our format
function transformProduct(printfulProduct) {
    return {
        id: printfulProduct.id,
        name: printfulProduct.name,
        description: printfulProduct.description || '',
        price: parseFloat(printfulProduct.retail_price || 0),
        category: categorizeProduct(printfulProduct.name),
        images: [printfulProduct.thumbnail_url],
        printfulId: printfulProduct.id,
        isNew: false // Could be determined by creation date
    };
}

// Transform product with full variant information
function transformProductWithVariants(printfulProduct) {
    const baseProduct = transformProduct(printfulProduct.sync_product);
    
    baseProduct.variants = printfulProduct.sync_variants.map(variant => ({
        id: variant.id,
        printfulId: variant.id,
        size: variant.size || 'One Size',
        color: variant.color || '',
        price: parseFloat(variant.retail_price || baseProduct.price),
        stock: 100, // Printful doesn't provide real-time stock, assume available
        sku: variant.sku
    }));

    baseProduct.sizes = [...new Set(baseProduct.variants.map(v => v.size))];
    
    return baseProduct;
}

// Categorize products based on name/type
function categorizeProduct(productName) {
    const name = productName.toLowerCase();
    
    if (name.includes('shirt') || name.includes('tee') || name.includes('hoodie') || name.includes('tank')) {
        return 'apparel';
    } else if (name.includes('patch') || name.includes('embroidered')) {
        return 'patches';
    } else if (name.includes('mug') || name.includes('sticker') || name.includes('hat') || name.includes('beanie')) {
        return 'accessories';
    }
    
    return 'accessories';
}

// CORS headers
function getCORSHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
    };
}

function handleCORS() {
    return new Response(null, {
        status: 204,
        headers: getCORSHeaders()
    });
}

// Webhook signature verification (optional but recommended)
function verifyWebhookSignature(payload, signature, secret) {
    // Implementation would use crypto.subtle.importKey and crypto.subtle.sign
    // to verify HMAC signature from Printful
    return true; // Simplified for now
}