import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Star, AlertTriangle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { getCategoryPathMapping } from '../data/dataService';
import { useTranslation } from '../utils/translate';

// Function to get category path from category name
const getCategoryPathFromName = (categoryName) => {
  const pathMapping = getCategoryPathMapping();
  // Invert the mapping to get name-to-path
  const nameToPathMapping = {};
  for (const [path, name] of Object.entries(pathMapping)) {
    nameToPathMapping[name] = path;
  }
  return nameToPathMapping[categoryName] || '';
};

const ProductDetailsPage = () => {
  const { products } = useProducts();
  const { productId } = useParams();
  const { cart, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const { t } = useTranslation();

  // Find the product by ID
  const product = products.find(p => p.id === parseInt(productId));

  // How many of this product are already in the cart
  const cartItem = product ? cart.items.find(i => i.id === product.id) : null;
  const inCartCount = cartItem ? cartItem.quantity : 0;

  if (!product) {
    return (
      <ErrorContainer>
        <h2>{t('product.notFound.title')}</h2>
        <p>{t('product.notFound.message')}</p>
        <Link to="/">{t('product.notFound.home')}</Link>
      </ErrorContainer>
    );
  }

  const handleAddToCart = () => {
    // Add the product to cart multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    
    // Show success message
    setAddedToCart(true);
    
    // Reset message after 3 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  return (
    <PageContainer>
      <BreadcrumbNav>
        <Link to="/">{t('nav.home')}</Link> &gt; 
        <Link to="/categories">{t('nav.categories')}</Link> &gt; 
        <Link to={`/categories/${getCategoryPathFromName(product.category)}`}>{product.category}</Link> &gt; 
        <span>{product.name}</span>
      </BreadcrumbNav>
      
      <ProductContainer>
        <ProductImage src={product.image} alt={product.name} />
        
        <ProductInfo>
          <h1>{product.name}</h1>
          
          <Rating>
            {Array(5).fill().map((_, i) => (
              <StarWrapper key={i} filled={i < Math.floor(product.rating)}>
                <Star size={18} fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'} />
              </StarWrapper>
            ))}
            <span>({product.rating}) - {product.reviews} reviews</span>
          </Rating>
          
          <Price>
            {product.price > 0 ? (
              product.discount > 0 ? (
                <>
                  <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '1.2rem', marginRight: '10px' }}>
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  ₹{Math.round(product.price * (1 - product.discount / 100)).toLocaleString('en-IN')}
                  <span style={{ marginLeft: '10px', fontSize: '1rem', color: 'var(--primary-color)', fontWeight: 700 }}>
                    {product.discount}% off
                  </span>
                </>
              ) : (
                <>₹{product.price.toLocaleString('en-IN')}</>
              )
            ) : (
              <span style={{ fontSize: '1.2rem', color: '#888' }}>Price on request</span>
            )}
          </Price>
          
          <Description>{product.description}</Description>
          
          <StockInfo inStock={product.stock > 0}>
            {product.stock > 0 ? t('product.inStock', { count: product.stock }) : t('product.outOfStock')}
          </StockInfo>

          {inCartCount > 0 && (
            <InCartBadge>
              🛒 {inCartCount} already in your cart
            </InCartBadge>
          )}

          <QuantityContainer>
            <label htmlFor="quantity">{t('product.quantity')}:</label>
            <QuantityControls>
              <QuantityButton 
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
              >
                -
              </QuantityButton>
              <QuantityInput 
                type="number" 
                id="quantity" 
                min="1" 
                max={product.stock}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
              />
              <QuantityButton 
                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                disabled={quantity >= product.stock}
              >
                +
              </QuantityButton>
            </QuantityControls>
          </QuantityContainer>
          
          <AddToCartButton 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? t('product.outOfStock') : t('product.addToCart')}
          </AddToCartButton>
          
          {addedToCart && (
            <SuccessMessage>
              {t('product.added')}
            </SuccessMessage>
          )}
        </ProductInfo>
      </ProductContainer>
      
      <ProductDetails>
        <h2>{t('product.details')}</h2>
        <DetailDescription>{product.description}</DetailDescription>
        
        <FeaturesContainer>
          <h3>{t('product.features')}</h3>
          <FeaturesList>
            {product.features.map((feature, index) => (
              <FeatureItem key={index}>{feature}</FeatureItem>
            ))}
          </FeaturesList>
        </FeaturesContainer>
        
        <SafetyInstructions>
          <h3>{t('product.safety')}</h3>
          <SafetyList>
            <SafetyItem><AlertTriangle size={16} /><span>{t('product.safety.adultSupervision')}</span></SafetyItem>
            <SafetyItem><AlertTriangle size={16} /><span>{t('product.safety.keepAway')}</span></SafetyItem>
            <SafetyItem><AlertTriangle size={16} /><span>{t('product.safety.openAreas')}</span></SafetyItem>
            <SafetyItem><AlertTriangle size={16} /><span>{t('product.safety.waterNearby')}</span></SafetyItem>
            <SafetyItem><AlertTriangle size={16} /><span>{t('product.safety.readInstructions')}</span></SafetyItem>
            <SafetyItem><AlertTriangle size={16} /><span>{t('product.safety.storeCool')}</span></SafetyItem>
          </SafetyList>
        </SafetyInstructions>
        
        <UsageGuidelines>
          <h3>Usage Guidelines</h3>
          <p>For optimal experience and safety, please follow these guidelines:</p>
          <ol>
            <li>Select a flat, stable surface for ground items</li>
            <li>Ensure adequate clearance for aerial items</li>
            <li>Light at arm's length using a long lighter or incense stick</li>
            <li>Move away immediately after lighting</li>
            <li>Wait for complete cooling before disposal</li>
          </ol>
        </UsageGuidelines>
      </ProductDetails>
      
      <RelatedProducts>
        <h2>You May Also Like</h2>
        <RelatedProductsGrid>
          {products
            .filter(p => p.id !== product.id)
            .slice(0, 3)
            .map(relatedProduct => (
              <RelatedProductCard key={relatedProduct.id}>
                <Link to={`/product/${relatedProduct.id}`}>
                  <RelatedProductImage src={relatedProduct.image} alt={relatedProduct.name} />
                  <RelatedProductName>{relatedProduct.name}</RelatedProductName>
                  <RelatedProductPrice>₹{relatedProduct.price.toLocaleString('en-IN')}</RelatedProductPrice>
                </Link>
                <CategoryLink to={`/categories/${getCategoryPathFromName(relatedProduct.category)}`}>
                  {relatedProduct.category}
                </CategoryLink>
              </RelatedProductCard>
            ))}
        </RelatedProductsGrid>
      </RelatedProducts>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const BreadcrumbNav = styled.div`
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: #666;
  
  a {
    color: #666;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  span {
    color: #333;
    font-weight: 500;
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  h1 {
    font-size: 2rem;
    margin: 0;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  span {
    color: #666;
    font-size: 0.9rem;
  }
`;

const StarWrapper = styled.span`
  display: inline-flex;
  color: ${props => props.filled ? '#FFD700' : '#e0e0e0'};
`;

const Price = styled.div`
  font-size: 1.8rem;
  font-weight: 600;
  color: #333;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #555;
`;

const StockInfo = styled.div`
  font-weight: 500;
  color: ${props => props.inStock ? '#2ecc71' : '#e74c3c'};
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  
  label {
    font-weight: 500;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid var(--primary-color);
  border-radius: 4px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: var(--primary-color-dark, #c0392b);
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  text-align: center;
  border: none;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  padding: 0.5rem;
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const AddToCartButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;

  &:hover:not(:disabled) {
    background-color: var(--primary-color-dark, #c0392b);
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background-color: #2ecc71;
  color: white;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
`;

const InCartBadge = styled.div`
  display: inline-block;
  background-color: #eaf6ff;
  color: #2980b9;
  border: 1px solid #aed6f1;
  border-radius: 4px;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const ProductDetails = styled.div`
  margin-bottom: 3rem;
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }
`;

const FeaturesContainer = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }
`;

const FeaturesList = styled.ul`
  padding-left: 1.5rem;
`;

const FeatureItem = styled.li`
  margin-bottom: 0.5rem;
  line-height: 1.6;
`;

const DetailDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
  margin-bottom: 2rem;
`;

const SafetyInstructions = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #fff9e6;
  border-radius: 8px;
  border-left: 4px solid #ffc107;
`;

const SafetyList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
`;

const SafetyItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  svg {
    flex-shrink: 0;
    color: #ffc107;
  }
`;

const UsageGuidelines = styled.div`
  margin-top: 2rem;
  
  ol {
    margin-top: 1rem;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.8rem;
    line-height: 1.5;
  }
`;

const RelatedProducts = styled.div`
  margin-bottom: 3rem;
  
  h2 {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 0.5rem;
  }
`;

const RelatedProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const RelatedProductCard = styled.div`
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
  
  a {
    text-decoration: none;
    color: inherit;
    display: block;
  }
`;

const RelatedProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const RelatedProductName = styled.h3`
  font-size: 1rem;
  margin: 1rem;
  color: #333;
`;

const RelatedProductPrice = styled.div`
  font-weight: 600;
  margin: 0 1rem 0.5rem;
  color: #333;
`;

const CategoryLink = styled(Link)`
  display: block;
  margin: 0 1rem 1rem;
  font-size: 0.8rem;
  color: #666;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 3rem;
  
  h2 {
    margin-bottom: 1rem;
  }
  
  a {
    display: inline-block;
    margin-top: 1rem;
    color: #3498db;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default ProductDetailsPage;