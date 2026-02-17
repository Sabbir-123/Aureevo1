// Real API layer — all data from Supabase
import { supabase } from './supabase';

// ============================================
// PUBLIC PRODUCT API
// ============================================

export async function getProducts(category = 'all') {
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false });

  if (category !== 'all') {
    query = query.eq('category', category);
  }

  const { data } = await query;
  return data || [];
}

export async function getProduct(id) {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  return data;
}

export async function getFeaturedProducts() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('is_visible', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false });
  return data || [];
}

// ============================================
// SETTINGS
// ============================================

export async function getSettings() {
  const { data } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();

  return data || {
    facebook_pixel_id: '',
    whatsapp_number: '',
    store_name: 'AUREEVO',
    currency: 'BDT',
    currency_symbol: '৳',
    shipping_cost: 120,
  };
}

// ============================================
// PLACE ORDER
// ============================================

export async function placeOrder(orderData) {
  const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();

  try {
    // Insert order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_id: orderId,
        customer_name: orderData.name,
        customer_phone: orderData.phone,
        customer_address: orderData.address,
        total_price: orderData.totalPrice,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const items = orderData.items.map((item) => ({
      order_id: order.id,
      product_id: item.productId || null,
      product_name: item.name,
      product_image: item.image || '',
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      price: item.price,
    }));

    await supabase.from('order_items').insert(items);

    // Reduce stock for each item
    for (const item of orderData.items) {
      if (item.productId && item.size) {
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.productId)
          .single();

        if (product?.stock) {
          const newStock = { ...product.stock };
          const current = parseInt(newStock[item.size]) || 0;
          newStock[item.size] = Math.max(0, current - item.quantity);
          await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', item.productId);
        }
      }
    }

    // Generate WhatsApp notification
    const settings = await getSettings();
    if (settings.whatsapp_number) {
      const whatsappMsg = generateWhatsAppMessage(orderData, orderId);
      // The frontend can open this URL to send the notification
      orderData._whatsappUrl = `https://wa.me/${settings.whatsapp_number}?text=${whatsappMsg}`;
    }

    return {
      success: true,
      orderId,
      message: 'Order placed successfully!',
    };
  } catch (err) {
    console.error('Order error:', err);
    return {
      success: false,
      error: err.message || 'Failed to place order',
    };
  }
}

function generateWhatsAppMessage(orderData, orderId) {
  const items = orderData.items
    .map(
      (item) =>
        `• ${item.name} (${item.size}, ${item.color}) × ${item.quantity}`
    )
    .join('\n');

  return encodeURIComponent(
    `🛒 New Order: ${orderId}\n\n` +
    `👤 ${orderData.name}\n` +
    `📱 ${orderData.phone}\n` +
    `📍 ${orderData.address}\n\n` +
    `📦 Items:\n${items}\n\n` +
    `💰 Total: ৳${Number(orderData.totalPrice).toFixed(2)}`
  );
}

// ============================================
// PRODUCT IMAGE URL HELPER
// ============================================

export function getProductImageUrl(product) {
  // Use the first uploaded image if available
  if (product.images && product.images.length > 0 && product.images[0]) {
    return product.images[0];
  }

  // Fallback gradient placeholder
  const colors = product.colors?.[0]?.hex || '#333';
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="750" viewBox="0 0 600 750">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${colors};stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="600" height="750" fill="url(#g)"/>
      <text x="300" y="360" font-family="Georgia" font-size="22" fill="rgba(255,255,255,0.5)" text-anchor="middle">${product.name}</text>
      <text x="300" y="400" font-family="sans-serif" font-size="14" fill="rgba(201,169,110,0.6)" text-anchor="middle">${product.category === 'hoodies' ? 'HOODIE' : 'T-SHIRT'}</text>
    </svg>
  `)}`;
}
