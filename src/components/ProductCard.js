import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };
  
  return (
    <Card>
      <Link to={`/product/${product.id}`}>
        <ProductImage src={product.image} alt={product.name} />
        {product.discount > 0 && <DiscountBadge>-{product.discount}%</DiscountBadge>}
        <ProductInfo>
          <ProductCategory>{product.category}</ProductCategory>
          <ProductName>{product.name}</ProductName>
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
        </ProductInfo>
      </Link>
      <AddToCartButton onClick={handleAddToCart}>Add to Cart</AddToCartButton>
    </Card>
  );
};

// Styled Components
const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  a {
    text-decoration: none;
    color: inherit;
    display: block;
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
  padding: 15px;
`;

const ProductCategory = styled.p`
  color: #666;
  font-size: 0.8rem;
  margin: 0 0 5px 0;
`;

const ProductName = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1rem;
  font-weight: 600;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CurrentPrice = styled.span`
  font-weight: bold;
  color: var(--primary-color);
  font-size: 1.1rem;
`;

const OriginalPrice = styled.span`
  text-decoration: line-through;
  color: #999;
  font-size: 0.9rem;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: var(--primary-color);
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary-color-dark);
  }
`;

export default ProductCard;