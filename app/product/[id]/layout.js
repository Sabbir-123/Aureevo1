import { getProduct } from '@/lib/api';

export async function generateMetadata({ params }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return {
            title: 'Product Not Found | Aureevo',
        };
    }

    const title = product.seo_title || `${product.name} | Aureevo Custom Clothing`;
    const description = product.seo_description || product.description || `Buy ${product.name} from Aureevo. Premium quality and bespoke fits.`;
    const keywords = product.seo_keywords || `Aureevo, ${product.name}, ${product.category}, luxury fashion, custom clothing`;

    const images = [];
    let parsedImages = product.images;
    if (typeof parsedImages === 'string') {
        try { parsedImages = JSON.parse(parsedImages); } catch (e) { }
    }
    if (Array.isArray(parsedImages) && parsedImages.length > 0) {
        images.push(parsedImages[0]);
    } else {
        // Assume fallback image exists or logic
        images.push('https://via.placeholder.com/600x750?text=Aureevo');
    }

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            url: `https://aureevo.com/product/${product.id}`,
            siteName: 'Aureevo',
            images: [
                {
                    url: images[0],
                    width: 800,
                    height: 1000,
                    alt: title,
                },
            ],
            locale: 'en_BD',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [images[0]],
        },
    };
}

export default function ProductLayout({ children }) {
    return <>{children}</>;
}
