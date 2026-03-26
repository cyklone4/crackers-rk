import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { useTranslation } from '../utils/translate';

const AllInOnePage = () => {
  const { products } = useProducts();
  const { t } = useTranslation();
  const { cart, addToCart, removeFromCart } = useCart();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [productQuantities, setProductQuantities] = useState({});

  // Pre-populate search from URL query param (e.g. ?q=sparklers)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) setSearchTerm(q);
  }, [location.search]);
  
  // Get unique categories
  const categories = ['all', ...new Set(products.map(product => product.category))];
  
  // Filter products based on search term and selected category
  const filteredProducts = products.filter(product => {
    const desc = product.description || '';
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         desc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Initialize product quantities based on cart items
  useEffect(() => {
    const quantities = {};
    cart.items.forEach(item => {
      quantities[item.id] = item.quantity;
    });
    setProductQuantities(quantities);
  }, [cart.items]);

  const handleIncreaseQuantity = (product) => {
    addToCart(product);
  };

  const handleDecreaseQuantity = (product) => {
    removeFromCart(product);
  };

  const getProductQuantity = (productId) => {
    return productQuantities[productId] || 0;
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <h1>{t('allInOne.title')}</h1>
        <p>{t('allInOne.description')}</p>
      </PageHeader>
      
      <FilterSection>
        <SearchBar>
          <input 
            type="text" 
            placeholder={t('allInOne.searchPlaceholder')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchBar>
        
        <CategoryFilter>
          {categories.map(category => (
            <CategoryButton 
              key={category}
              data-active={(category === selectedCategory).toString()}
              onClick={() => setSelectedCategory(category)}
            >
              {category === 'all' ? t('allInOne.allCategories') : category}
            </CategoryButton>
          ))}
        </CategoryFilter>
      </FilterSection>
      
      <ProductsGrid>
        {filteredProducts.map(product => (
          <ProductCard key={product.id}>
            <ProductImage src={product.image} alt={product.name} />
            {product.discount > 0 && <DiscountBadge>-{product.discount}%</DiscountBadge>}
            
            <ProductInfo>
              <ProductCategory>{product.category}</ProductCategory>
              <ProductName>{product.name}</ProductName>
              <ProductDescription>{(product.description || '').substring(0, 100)}...</ProductDescription>
              
              <PriceContainer>
                {product.price > 0 ? (
                  product.discount > 0 ? (
                    <>
                      <OriginalPrice>₹{product.price.toLocaleString('en-IN')}</OriginalPrice>
                      <CurrentPrice>
                        ₹{Math.round(product.price * (1 - product.discount / 100)).toLocaleString('en-IN')}
                      </CurrentPrice>
                    </>
                  ) : (
                    <CurrentPrice>₹{product.price.toLocaleString('en-IN')}</CurrentPrice>
                  )
                ) : (
                  <CurrentPrice>₹0</CurrentPrice>
                )}
              </PriceContainer>
              
              <StockInfo data-instock={(product.stock > 0).toString()}>
                {product.stock > 0 ? t('product.inStock', { count: product.stock }) : t('product.outOfStock')}
              </StockInfo>
              
              <ButtonsContainer>
                <QuantityControl>
                  <QuantityButton 
                    onClick={() => handleDecreaseQuantity(product)}
                    disabled={getProductQuantity(product.id) <= 0 || product.stock <= 0}
                  >
                    -
                  </QuantityButton>
                  <QuantityDisplay>{getProductQuantity(product.id)}</QuantityDisplay>
                  <QuantityButton 
                    onClick={() => handleIncreaseQuantity(product)}
                    disabled={product.stock <= 0}
                  >
                    +
                  </QuantityButton>
                </QuantityControl>
                <ViewDetailsButton to={`/product/${product.id}`}>
                  {t('allInOne.viewDetails')}
                </ViewDetailsButton>
              </ButtonsContainer>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductsGrid>
      
      {filteredProducts.length === 0 && (
        <EmptyResults>
          <h2>{t('allInOne.noResults')}</h2>
          <p>{t('allInOne.tryDifferent')}</p>
        </EmptyResults>
      )}
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 40px 20px;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
  
  h1 {
    font-size: 2.5rem;
    color: var(--primary-color-3);
    margin-bottom: 10px;
  }
  
  p {
    font-size: 1.2rem;
    color: #666;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 30px;
`;

const SearchBar = styled.div`
  margin-bottom: 20px;
  
  input {
    width: 100%;
    padding: 12px 20px;
    border: 1px solid #ddd;
    border-radius: 30px;
    font-size: 1rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
    }
  }
`;

const CategoryFilter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
`;

const CategoryButton = styled.button`
  padding: 8px 16px;
  border: 1px solid ${props => props['data-active'] === 'true' ? 'var(--primary-color)' : '#ddd'};
  border-radius: 20px;
  background-color: ${props => props['data-active'] === 'true' ? 'var(--primary-color)' : 'white'};
  color: ${props => props['data-active'] === 'true' ? 'white' : '#333'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props['data-active'] === 'true' ? 'var(--primary-color)' : '#f5f5f5'};
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const ProductCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const DiscountBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: var(--primary-color);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;
  font-size: 0.8rem;
`;

const ProductInfo = styled.div`
  padding: 20px;
`;

const ProductCategory = styled.p`
  color: #666;
  font-size: 0.8rem;
  margin: 0 0 5px 0;
`;

const ProductName = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color-3);
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.5;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
`;

const CurrentPrice = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--primary-color-3);
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
`;

const StockInfo = styled.p`
  font-size: 0.9rem;
  color: ${props => props['data-instock'] === 'true' ? 'green' : 'red'};
  margin-bottom: 15px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const QuantityControl = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 15px;
  font-weight: 600;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--highlight-color);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.span`
  flex: 1;
  text-align: center;
  font-weight: 600;
  font-size: 1.1rem;
  color: var(--primary-color-3);
  padding: 0 10px;
`;

const ViewDetailsButton = styled(Link)`
  flex: 1;
  display: inline-block;
  background-color: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  padding: 10px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: var(--primary-color-light);
  }
`;

const EmptyResults = styled.div`
  text-align: center;
  padding: 50px 0;
  
  h2 {
    color: var(--primary-color-3);
    margin-bottom: 10px;
  }
  
  p {
    color: #666;
  }
`;

export default AllInOnePage;