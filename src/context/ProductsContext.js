import React, { createContext, useContext, useState, useEffect } from 'react';
import STATIC_PRODUCTS from '../data/products';

const ProductsContext = createContext();

const mapProduct = (p) => ({
  id: p.id,
  name: p.name,
  nameTa: p.name_ta || '',
  category: p.category_name || p.category || '',
  per: p.per || '',
  price: Number(p.price),
  discount: Number(p.discount) || 0,
  image: p.image || '',
  description: p.description || '',
  rating: Number(p.rating) || 0,
  reviews: Number(p.reviews) || 0,
  stock: Number(p.stock) || 0,
  features: Array.isArray(p.features)
    ? p.features
    : p.features ? JSON.parse(p.features) : [],
  relatedProducts: Array.isArray(p.related_products)
    ? p.related_products
    : p.related_products ? JSON.parse(p.related_products) : (p.relatedProducts || []),
});

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState(STATIC_PRODUCTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || '';
    fetch(`${apiUrl}/api/products?limit=500`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products?.length) {
          setProducts(data.products.map(mapProduct));
        }
      })
      .catch(() => {
        // keep static fallback on error
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error('useProducts must be used within ProductsProvider');
  return ctx;
};
