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
    return valid ? {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role || 'employee',
        permissions: data.permissions || []
    } : null;
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
    let { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();
        
    if (error && error.message && error.message.includes('schema cache')) {
        // Fallback for when the SQL updates haven't been applied or cache is stale
        const { cost_price, seo_title, seo_description, seo_keywords, target_country, target_region, ...fallbackProduct } = product;
        const retry = await supabase.from('products').insert(fallbackProduct).select().single();
        data = retry.data;
        error = retry.error;
    }
        
    return { data, error };
}

export async function updateProduct(id, updates) {
    let { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
    if (error && error.message && error.message.includes('schema cache')) {
        const { cost_price, seo_title, seo_description, seo_keywords, target_country, target_region, ...fallbackUpdates } = updates;
        const retry = await supabase.from('products').update(fallbackUpdates).eq('id', id).select().single();
        data = retry.data;
        error = retry.error;
    }
        
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

    let totalOrderCost = 0;
    const enrichedItems = await Promise.all(orderData.items.map(async (item) => {
        let costPrice = 0;
        if (item.productId) {
            const { data: prod } = await supabase.from('products').select('cost_price').eq('id', item.productId).single();
            if (prod) costPrice = prod.cost_price || 0;
        }
        totalOrderCost += (costPrice * item.quantity);
        return {
            ...item,
            cost_price: costPrice,
            profit: item.price - costPrice
        };
    }));

    // Insert order items
    const items = enrichedItems.map((item) => ({
        order_id: order.id,
        product_id: item.productId || null,
        product_name: item.name,
        product_image: item.image || '',
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
        cost_price: item.cost_price,
        profit: item.profit * item.quantity
    }));

    await supabase.from('order_items').insert(items);

    const deliveryCharge = orderData.deliveryCharge || 0;
    const totalOrderProfit = (orderData.totalPrice - deliveryCharge) - totalOrderCost;

    // Update the parent order with final cost and profit metrics
    await supabase.from('orders').update({
        total_cost: totalOrderCost,
        total_profit: totalOrderProfit,
        delivery_charge: deliveryCharge
    }).eq('id', order.id);

    // Sync to Finance Ledger
    const totalOrderQuantity = enrichedItems.reduce((acc, i) => acc + i.quantity, 0);
    await supabase.from('finance_records').insert({
        type: 'income',
        amount: orderData.totalPrice,
        profit: totalOrderProfit,
        quantity: totalOrderQuantity,
        description: `Revenue from Order ${orderId}`,
        category: 'Sales',
        order_id: order.id,
        date: new Date().toISOString().split('T')[0]
    });

    // Reduce stock for each item
    for (const item of orderData.items) {
        if (item.productId && item.size) {
            let success = false;
            let attempts = 0;

            // Simple JS based optimistic concurrency retry loop
            while (!success && attempts < 3) {
                // 1. Fetch the absolute latest stock right now
                const { data: product } = await supabase
                    .from('products')
                    .select('stock')
                    .eq('id', item.productId)
                    .single();

                if (product?.stock) {
                    const newStock = { ...product.stock };
                    const current = parseInt(newStock[item.size]) || 0;
                    newStock[item.size] = Math.max(0, current - item.quantity);

                    // 2. Update it. In a real highly concurrent system without RPC, 
                    // you would add a `version` WHERE clause. Here we do our best JS reduction.
                    const { error } = await supabase
                        .from('products')
                        .update({ stock: newStock })
                        .eq('id', item.productId);

                    if (!error) {
                        success = true;
                    }
                } else {
                    break; // No stock object, exit retry
                }
                attempts++;
            }
        }
    }

    return { success: true, orderId, message: 'Order placed successfully!' };
}

// ============================================
// ADMIN CUSTOM ORDERS
// ============================================

export async function createManualCustomOrder(orderData) {
    const { data, error } = await supabase
        .from('custom_orders')
        .insert([{
            customer_name: orderData.customer_name,
            customer_email: orderData.customer_email,
            customer_phone: orderData.customer_phone,
            design_description: orderData.design_description,
            quantity: orderData.quantity || 1,
            cost_price: orderData.cost_price || 0,
            sale_price: orderData.sale_price || 0,
            delivery_charge: orderData.delivery_charge || 0,
            status: orderData.status || 'pending',
            admin_notes: orderData.admin_notes || ''
        }])
        .select()
        .single();
        
    // If created immediately as completed
    if (!error && data && data.status === 'completed' && data.sale_price) {
        const salePriceUnit = Number(data.sale_price || 0);
        const costPriceUnit = Number(data.cost_price || 0);
        const qty = Number(data.quantity || 1);
        const deliveryCharge = Number(data.delivery_charge || 0);
        
        const totalSale = (salePriceUnit * qty) + deliveryCharge;
        const profit = (salePriceUnit - costPriceUnit) * qty;
        
        await supabase.from('finance_records').insert({
            type: 'income',
            amount: totalSale,
            profit: profit,
            quantity: qty,
            description: `Custom Order Revenue: ${data.customer_name}`,
            category: 'Sales',
            order_id: data.id,
            date: new Date().toISOString().split('T')[0]
        });
    }

    return { data, error };
}

export async function getAdminCustomOrders() {
    const { data, error } = await supabase
        .from('custom_orders')
        .select('*')
        .order('created_at', { ascending: false });
    return { data: data || [], error };
}

export async function updateCustomOrderStatus(id, status, adminNotes = '', additionalData = {}) {
    const payload = { status, admin_notes: adminNotes };
    if (additionalData.sale_price !== undefined) payload.sale_price = additionalData.sale_price;
    if (additionalData.cost_price !== undefined) payload.cost_price = additionalData.cost_price;
    if (additionalData.quantity !== undefined) payload.quantity = additionalData.quantity;
    if (additionalData.delivery_charge !== undefined) payload.delivery_charge = additionalData.delivery_charge;

    const { data, error } = await supabase
        .from('custom_orders')
        .update(payload)
        .eq('id', id)
        .select()
        .single();
        
    // If completed and prices provided, add to finance ledger automatically
    if (!error && data && status === 'completed' && additionalData.sale_price !== undefined) {
        const salePriceUnit = Number(data.sale_price || 0);
        const costPriceUnit = Number(data.cost_price || 0);
        const qty = Number(data.quantity || 1);
        const deliveryCharge = Number(data.delivery_charge || 0);
        
        const totalSale = (salePriceUnit * qty) + deliveryCharge;
        const profit = (salePriceUnit - costPriceUnit) * qty;
        
        await supabase.from('finance_records').insert({
            type: 'income',
            amount: totalSale,
            profit: profit,
            quantity: qty,
            description: `Custom Order Revenue: ${data.customer_name}`,
            category: 'Sales',
            order_id: data.id,
            date: new Date().toISOString().split('T')[0]
        });
    }

    return { data, error };
}

// ============================================
// CATEGORIES
// ============================================

export async function getAdminCategories() {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true });
    return { data: data || [], error };
}

export async function createCategory(categoryData) {
    const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();
    return { data, error };
}

export async function updateCategory(id, categoryData) {
    const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();
    return { data, error };
}

export async function deleteCategory(id) {
    const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
    return { error };
}

// ============================================
// FINANCE LEDGER
// ============================================

export async function getFinanceRecords(dateFilter, exactMonth = null, exactYear = null) {
    let query = supabase.from('finance_records').select('*').order('date', { ascending: false });

    if (exactMonth && exactYear) {
        // Find first and last day of exact month
        const from = new Date(exactYear, parseInt(exactMonth) - 1, 1).toISOString();
        const to = new Date(exactYear, parseInt(exactMonth), 0, 23, 59, 59).toISOString();
        query = query.gte('date', from).lte('date', to);
    } else if (dateFilter) {
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
            query = query.gte('date', from.toISOString());
        }
    }

    const { data, error } = await query;
    return { data: data || [], error };
}

export async function addFinanceRecord(record) {
    const { data, error } = await supabase
        .from('finance_records')
        .insert([record])
        .select()
        .single();
    return { data, error };
}

export async function updateFinanceRecord(id, updates) {
    const { data, error } = await supabase
        .from('finance_records')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    return { data, error };
}

export async function deleteFinanceRecord(id) {
    const { error } = await supabase
        .from('finance_records')
        .delete()
        .eq('id', id);
    return { error };
}

// ============================================
// ANALYTICS OVERVIEW
// ============================================

export async function getDashboardAnalytics() {
    const [ordersRes, eventRes] = await Promise.all([
        supabase.from('orders').select('id, total_price, created_at, status'),
        supabase.from('analytics_events').select('session_id, event_type')
    ]);

    const orders = ordersRes.data || [];
    const events = eventRes.data || [];

    // Calculate metrics
    const totalRevenue = orders
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + Number(o.total_price), 0);

    const totalOrders = orders.length;

    // Very basic funnel analytics assuming sessions
    const uniqueSessions = new Set(events.map(e => e.session_id)).size;
    const purchaseSessions = new Set(events.filter(e => e.event_type === 'purchase').map(e => e.session_id)).size;

    const conversionRate = uniqueSessions > 0 ? (purchaseSessions / uniqueSessions) * 100 : 0;
    const aov = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    return {
        totalRevenue,
        totalOrders,
        conversionRate: conversionRate.toFixed(2),
        aov: aov.toFixed(2),
        orders,
        events
    };
}

export async function getProductAnalytics() {
    // We group by product ID
    const { data: products } = await supabase.from('products').select('id, name, stock, cost_price, is_visible, category');
    const { data: events } = await supabase.from('analytics_events').select('product_id, event_type');
    const { data: orderItems } = await supabase.from('order_items').select('product_id, quantity, price');

    const prodStats = (products || []).map(p => {
        const prodEvents = (events || []).filter(e => e.product_id === p.id);
        const prodOrders = (orderItems || []).filter(o => o.product_id === p.id);

        const views = prodEvents.filter(e => e.event_type === 'product_view').length;
        const addToCart = prodEvents.filter(e => e.event_type === 'add_to_cart').length;

        const purchases = prodOrders.reduce((sum, item) => sum + item.quantity, 0);
        const revenue = prodOrders.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        const conversionRate = views > 0 ? (purchases / views) * 100 : 0;

        // Sum total stock recursively
        let totalStock = 0;
        if (p.stock && typeof p.stock === 'object') {
            totalStock = Object.values(p.stock).reduce((sum, val) => sum + Number(val), 0);
        }

        return {
            ...p,
            views,
            addToCart,
            purchases,
            revenue,
            conversionRate: conversionRate.toFixed(2),
            totalStock
        };
    });

    return { data: prodStats };
}

// ============================================
// EMPLOYEE SALARY MANAGEMENT
// ============================================

export async function getEmployeeSalaries() {
    const { data, error } = await supabase
        .from('employee_salaries')
        .select('*')
        .order('date', { ascending: false });
    return { data: data || [], error };
}

export async function addEmployeeSalary(record) {
    const { data, error } = await supabase
        .from('employee_salaries')
        .insert([record])
        .select()
        .single();
        
    // Sync immediately to Finance Ledger
    if (!error && data) {
        await supabase.from('finance_records').insert({
            type: 'expense',
            amount: data.amount,
            profit: 0,
            description: `Salary given to: ${data.employee_name}${data.notes ? ' (' + data.notes + ')' : ''}`,
            category: 'Salary',
            date: data.date
        });
    }

    return { data, error };
}
