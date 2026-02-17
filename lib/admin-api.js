import { supabase } from './supabase';

// ============================================
// ADMIN AUTH
// ============================================

export async function validateAdmin(email, password) {
    const bcrypt = (await import('bcryptjs')).default;
    const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

    if (error || !data) return null;

    const valid = await bcrypt.compare(password, data.password_hash);
    return valid ? { id: data.id, email: data.email, name: data.name } : null;
}

export async function createAdminUser(email, password, name = 'Admin') {
    const bcrypt = (await import('bcryptjs')).default;
    const hash = await bcrypt.hash(password, 12);

    const { data, error } = await supabase
        .from('admin_users')
        .upsert({ email, password_hash: hash, name }, { onConflict: 'email' })
        .select()
        .single();

    return { data, error };
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats() {
    const [products, orders, settings] = await Promise.all([
        supabase.from('products').select('id, stock, is_visible', { count: 'exact' }),
        supabase.from('orders').select('id, status, created_at, customer_name, total_price, order_id', { count: 'exact' }),
        supabase.from('settings').select('*').eq('id', 1).single(),
    ]);

    const allOrders = orders.data || [];
    const lowStockThreshold = settings.data?.low_stock_threshold || 3;

    const productsList = products.data || [];
    let lowStockCount = 0;
    productsList.forEach((p) => {
        if (p.stock && typeof p.stock === 'object') {
            const minStock = Math.min(...Object.values(p.stock).map(Number));
            if (minStock <= lowStockThreshold) lowStockCount++;
        }
    });

    return {
        totalProducts: products.count || 0,
        totalOrders: orders.count || 0,
        pendingOrders: allOrders.filter((o) => o.status === 'pending').length,
        confirmedOrders: allOrders.filter((o) => o.status === 'confirmed').length,
        deliveredOrders: allOrders.filter((o) => o.status === 'delivered').length,
        cancelledOrders: allOrders.filter((o) => o.status === 'cancelled').length,
        lowStockProducts: lowStockCount,
        recentOrders: allOrders
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5),
    };
}

// ============================================
// PRODUCT MANAGEMENT
// ============================================

export async function getAdminProducts() {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
    return { data: data || [], error };
}

export async function getAdminProduct(id) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    return { data, error };
}

export async function createProduct(product) {
    const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
    return { data, error };
}

export async function updateProduct(id, updates) {
    const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    return { data, error };
}

export async function deleteProduct(id) {
    const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
    return { error };
}

export async function toggleProductVisibility(id, isVisible) {
    return updateProduct(id, { is_visible: isVisible });
}

// ============================================
// IMAGE UPLOAD
// ============================================

export async function uploadProductImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
        return { url: null, error: data.error || 'Upload failed' };
    }

    return { url: data.url, error: null };
}

export async function deleteProductImage(url) {
    const filename = url.split('/product-images/')[1];
    if (!filename) return;
    await supabase.storage.from('product-images').remove([filename]);
}

// ============================================
// ORDER MANAGEMENT
// ============================================

export async function getAdminOrders({ search, status, dateFilter } = {}) {
    let query = supabase
        .from('orders')
        .select(`
      *,
      order_items (
        id, product_name, product_image, size, color, quantity, price, product_id
      )
    `)
        .order('created_at', { ascending: false });

    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    if (dateFilter) {
        const now = new Date();
        let from;
        if (dateFilter === 'today') {
            from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (dateFilter === 'week') {
            from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        } else if (dateFilter === 'month') {
            from = new Date(now.getFullYear(), now.getMonth(), 1);
        }
        if (from) {
            query = query.gte('created_at', from.toISOString());
        }
    }

    const { data, error } = await query;

    let filtered = data || [];
    if (search && search.trim()) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
            (o) =>
                o.order_id?.toLowerCase().includes(s) ||
                o.customer_name?.toLowerCase().includes(s) ||
                o.customer_phone?.includes(s) ||
                o.order_items?.some((item) => item.product_name?.toLowerCase().includes(s))
        );
    }

    return { data: filtered, error };
}

export async function getAdminOrder(id) {
    const { data, error } = await supabase
        .from('orders')
        .select(`
      *,
      order_items (
        id, product_name, product_image, size, color, quantity, price, product_id
      )
    `)
        .eq('id', id)
        .single();
    return { data, error };
}

export async function updateOrderStatus(id, status) {
    const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
    return { data, error };
}

// ============================================
// SETTINGS
// ============================================

export async function getAdminSettings() {
    const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();
    return { data, error };
}

export async function updateSettings(updates) {
    const { data, error } = await supabase
        .from('settings')
        .update(updates)
        .eq('id', 1)
        .select()
        .single();
    return { data, error };
}

// ============================================
// FRONTEND API (replaces mock)
// ============================================

export async function getPublicProducts(category = 'all') {
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

export async function getPublicProduct(id) {
    const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_visible', true)
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

export async function getPublicSettings() {
    const { data } = await supabase
        .from('settings')
        .select('facebook_pixel_id, whatsapp_number, store_name, currency, currency_symbol, shipping_cost')
        .eq('id', 1)
        .single();
    return data;
}

export async function placePublicOrder(orderData) {
    const orderId = 'ORD-' + Date.now().toString(36).toUpperCase();

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

    if (orderError) return { success: false, error: orderError.message };

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

    return { success: true, orderId, message: 'Order placed successfully!' };
}
