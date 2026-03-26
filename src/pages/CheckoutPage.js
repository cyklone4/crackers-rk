import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: isAuthenticated ? user.name.split(' ')[0] : '',
    lastName: isAuthenticated ? user.name.split(' ')[1] || '' : '',
    email: isAuthenticated ? user.email : '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [pincodeLookup, setPincodeLookup] = useState({ loading: false, error: '' });

  // Auto-fill city & state from pincode
  useEffect(() => {
    const pin = formData.zipCode.trim();
    if (!/^\d{6}$/.test(pin)) return;

    setPincodeLookup({ loading: true, error: '' });
    fetch(`https://api.postalpincode.in/pincode/${pin}`)
      .then(res => res.json())
      .then(data => {
        const result = data[0];
        if (result.Status === 'Success' && result.PostOffice?.length > 0) {
          const po = result.PostOffice[0];
          setFormData(prev => ({
            ...prev,
            city: po.District,
            state: po.State,
          }));
          setErrors(prev => ({ ...prev, city: '', state: '', zipCode: '' }));
          setPincodeLookup({ loading: false, error: '' });
        } else {
          setPincodeLookup({ loading: false, error: 'Invalid pincode' });
        }
      })
      .catch(() => setPincodeLookup({ loading: false, error: 'Could not verify pincode' }));
  }, [formData.zipCode]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = [
      'firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode', 'country'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);
    setSubmitError('');

    const subtotal = cart.totalPrice;
    const taxAmount = Math.round(subtotal * 0.28);
    const totalAmount = subtotal + taxAmount;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || '';
      const res = await fetch(`${apiUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone || '',
          },
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            country: formData.country,
          },
          items: cart.items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
          subtotal,
        }),
      });

      if (!res.ok) throw new Error('Failed to place order');

      const data = await res.json();

      clearCart();

      navigate('/order-confirmation', {
        state: {
          orderDetails: {
            orderNumber: data.orderNumber,
            orderDate: new Date().toLocaleDateString(),
            totalAmount: data.totalAmount,
            items: cart.items,
            shippingInfo: formData,
          },
        },
      });
    } catch (err) {
      console.error(err);
      setSubmitError('Could not place order. Please try again.');
      setSubmitting(false);
    }
  };
  
  // If cart is empty, redirect to cart
  if (cart.items.length === 0) {
    return (
      <PageContainer>
        <h1>Checkout</h1>
        <EmptyCartMessage>
          <p>Your cart is empty. Please add items before proceeding to checkout.</p>
          <ReturnButton onClick={() => navigate('/cart')}>Return to Cart</ReturnButton>
        </EmptyCartMessage>
      </PageContainer>
    );
  }
  
  // We no longer need this section as we're redirecting to OrderConfirmationPage
  
  return (
    <PageContainer>
      <h1>Checkout</h1>
      
      <CheckoutContainer>
        <CheckoutForm onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Shipping Information</SectionTitle>
            <ShippingNote>
              <p><strong>Important:</strong> Due to the nature of our products, we can only ship to addresses where fireworks are legal. Please verify local regulations before placing your order.</p>
              <p>Standard delivery takes 3-5 business days. Express shipping (1-2 business days) is available at checkout for an additional fee.</p>
            </ShippingNote>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />
                {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
                {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
              {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="address">Street Address</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                error={errors.address}
              />
              {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
            </FormGroup>
            
            <FormRow>
              <FormGroup>
                <Label htmlFor="zipCode">Pincode</Label>
                <Input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  placeholder="6-digit PIN"
                  maxLength={6}
                  value={formData.zipCode}
                  onChange={handleChange}
                  error={errors.zipCode || pincodeLookup.error}
                />
                {pincodeLookup.loading && <HintMessage>Looking up pincode…</HintMessage>}
                {pincodeLookup.error && <ErrorMessage>{pincodeLookup.error}</ErrorMessage>}
                {errors.zipCode && !pincodeLookup.error && <ErrorMessage>{errors.zipCode}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="city">City / District</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                  readOnly={!!formData.city && !errors.city}
                />
                {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="state">State</Label>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={errors.state}
                  readOnly={!!formData.state && !errors.state}
                />
                {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <Label htmlFor="country">Country</Label>
              <Select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                error={errors.country}
                disabled
              >
                <option value="India">India</option>
              </Select>
              {errors.country && <ErrorMessage>{errors.country}</ErrorMessage>}
            </FormGroup>
          </FormSection>
          
          <PaymentMessage>
            <PaymentIcon>💳</PaymentIcon>
            <div>
              <strong>Payment</strong>
              <p>Our team will reach out to you regarding the payment after your order is placed.</p>
            </div>
          </PaymentMessage>
          
          {submitError && <ErrorMessage style={{ marginBottom: '0.5rem' }}>{submitError}</ErrorMessage>}
          <PlaceOrderButton type="submit" disabled={submitting}>
            {submitting ? 'Placing Order…' : 'Place Order'}
          </PlaceOrderButton>
        </CheckoutForm>
        
        <OrderSummary>
            <SectionTitle>Order Summary</SectionTitle>
            <OrderPolicies>
              <h4>Order Policies</h4>
              <ul>
                <li><strong>Cancellation:</strong> Orders can be cancelled within 24 hours of placement for a full refund.</li>
                <li><strong>Returns:</strong> Due to safety regulations, we cannot accept returns on fireworks products.</li>
                <li><strong>Damaged Items:</strong> Please report any damaged items within 48 hours of delivery with photos.</li>
                <li><strong>Seasonal Availability:</strong> Some products may be unavailable during certain seasons due to regulations.</li>
              </ul>
            </OrderPolicies>
          
          <OrderItems>
            {cart.items.map((item) => (
              <OrderItem key={item.id}>
                <ItemImage src={item.image} alt={item.name} />
                <ItemDetails>
                  <ItemName>{item.name}</ItemName>
                  <ItemQuantity>Qty: {item.quantity}</ItemQuantity>
                </ItemDetails>
                <ItemPrice>₹{(item.price * item.quantity).toLocaleString('en-IN')}</ItemPrice>
              </OrderItem>
            ))}
          </OrderItems>

          <SummaryRow>
            <span>Subtotal</span>
            <span>₹{cart.totalPrice.toLocaleString('en-IN')}</span>
          </SummaryRow>

          <SummaryRow>
            <span>Shipping</span>
            <span>Free</span>
          </SummaryRow>

          <SummaryRow>
            <span>Tax (GST 28%)</span>
            <span>₹{Math.round(cart.totalPrice * 0.28).toLocaleString('en-IN')}</span>
          </SummaryRow>

          <SummaryTotal>
            <span>Total</span>
            <span>₹{Math.round(cart.totalPrice + cart.totalPrice * 0.28).toLocaleString('en-IN')}</span>
          </SummaryTotal>
        </OrderSummary>
      </CheckoutContainer>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  
  h1 {
    margin-bottom: 2rem;
    font-size: 2rem;
  }
`;

const CheckoutContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CheckoutForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const FormSection = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #eee;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#e74c3c' : '#3498db'};
    box-shadow: 0 0 0 2px ${props => props.error ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)'};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#ddd'};
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#e74c3c' : '#3498db'};
    box-shadow: 0 0 0 2px ${props => props.error ? 'rgba(231, 76, 60, 0.2)' : 'rgba(52, 152, 219, 0.2)'};
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const HintMessage = styled.div`
  color: #888;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;


const ShippingNote = styled.div`
  background-color: #f8f9fa;
  border-left: 3px solid #3498db;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
  
  p {
    margin-bottom: 0.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const PaymentMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background-color: #fff8e1;
  border: 1px solid #ffe082;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  padding: 1.2rem 1.5rem;

  strong {
    display: block;
    font-size: 1rem;
    margin-bottom: 0.3rem;
    color: #92400e;
  }

  p {
    margin: 0;
    color: #78350f;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const PaymentIcon = styled.span`
  font-size: 1.6rem;
  flex-shrink: 0;
  margin-top: 2px;
`;

const OrderPolicies = styled.div`
  background-color: #fff8e1;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
  
  h4 {
    margin-bottom: 0.8rem;
    color: #f57c00;
  }
  
  ul {
    list-style-type: none;
    padding-left: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 0.5rem;
    padding-left: 1.5rem;
    position: relative;
    
    &:before {
      content: '•';
      position: absolute;
      left: 0.5rem;
      color: #f57c00;
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const PlaceOrderButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const OrderSummary = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  height: fit-content;
`;

const OrderItems = styled.div`
  margin-bottom: 1.5rem;
  max-height: 300px;
  overflow-y: auto;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.8rem 0;
  border-bottom: 1px solid #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
`;

const ItemDetails = styled.div`
  flex: 1;
`;

const ItemName = styled.div`
  font-weight: 500;
  margin-bottom: 0.3rem;
`;

const ItemQuantity = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ItemPrice = styled.div`
  font-weight: 600;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1rem;
  
  &:last-of-type {
    padding-bottom: 1rem;
    border-bottom: 1px solid #eee;
  }
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1.5rem 0 0;
  font-size: 1.2rem;
  font-weight: 600;
`;

const EmptyCartMessage = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  
  p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }
`;

const ReturnButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #2980b9;
  }
`;



export default CheckoutPage;