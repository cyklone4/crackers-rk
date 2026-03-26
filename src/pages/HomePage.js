import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Shield, CheckCircle, Tag, Star, Phone, MapPin } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { useProducts } from '../context/ProductsContext';
import { useTranslation } from '../utils/translate';

const HERO_IMAGE = 'https://images.pexels.com/photos/33851784/pexels-photo-33851784.jpeg?auto=compress&cs=tinysrgb&w=1920';

/* ── animations ─────────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const glow = keyframes`
  0%, 100% { text-shadow: 0 0 20px rgba(255,200,50,0.6), 0 0 40px rgba(255,150,0,0.3); }
  50%       { text-shadow: 0 0 30px rgba(255,200,50,0.9), 0 0 60px rgba(255,150,0,0.5); }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(var(--primary-color-rgb, 220,38,38), 0.5); }
  50%       { box-shadow: 0 0 0 12px rgba(var(--primary-color-rgb, 220,38,38), 0); }
`;

/* ── hero ────────────────────────────────────────────────────── */
const HeroSection = styled.section`
  position: relative;
  min-height: 92vh;
  margin-top: -62px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('${HERO_IMAGE}');
    background-size: cover;
    background-position: center 30%;
    transform: scale(1.04);
    transition: transform 8s ease;
    z-index: 0;
  }

  /* dark + warm-gold gradient overlay */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      160deg,
      rgba(10,5,20,0.82) 0%,
      rgba(30,10,5,0.70) 50%,
      rgba(10,5,20,0.85) 100%
    );
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 860px;
  padding: 0 24px;
  animation: ${fadeUp} 0.9s ease both;
`;

const HeroBadge = styled.span`
  display: inline-block;
  background: rgba(255,200,50,0.15);
  border: 1px solid rgba(255,200,50,0.4);
  color: #ffd166;
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  padding: 5px 16px;
  border-radius: 20px;
  margin-bottom: 22px;
`;

const HeroTitle = styled.h1`
  font-size: clamp(2.4rem, 6vw, 4.2rem);
  font-weight: 800;
  color: #fff;
  line-height: 1.15;
  margin-bottom: 18px;
  animation: ${glow} 3s ease-in-out infinite;

  span {
    color: #ffd166;
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1rem, 2.2vw, 1.25rem);
  color: rgba(255,255,255,0.82);
  max-width: 580px;
  margin: 0 auto 36px;
  line-height: 1.7;
  animation: ${fadeUp} 0.9s 0.2s ease both;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
  animation: ${fadeUp} 0.9s 0.4s ease both;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const HeroButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--primary-color);
  color: white;
  padding: 14px 34px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.3s ease;
  animation: ${pulse} 2.5s ease-in-out infinite;

  &:hover {
    color: white;
    transform: translateY(-3px);
    filter: brightness(1.15);
    box-shadow: 0 12px 28px rgba(0,0,0,0.35);
  }
`;

const HeroButtonOutline = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: #fff;
  padding: 14px 34px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 1rem;
  border: 2px solid rgba(255,255,255,0.55);
  transition: all 0.3s ease;

  &:hover {
    color: #fff;
    background: rgba(255,255,255,0.12);
    border-color: #fff;
    transform: translateY(-3px);
  }
`;

const HeroMeta = styled.div`
  display: flex;
  justify-content: center;
  gap: 28px;
  flex-wrap: wrap;
  margin-top: 48px;
  animation: ${fadeUp} 0.9s 0.6s ease both;
  opacity: 0;
  animation-fill-mode: forwards;
`;

const HeroMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  color: rgba(255,255,255,0.75);
  font-size: 0.88rem;

  svg { color: #ffd166; flex-shrink: 0; }
`;

const QuickLinksSection = styled.section`
  padding: 50px 0;
  background-color: var(--background-color-2);
`;

const QuickLinksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 20px;
`;

const QuickLinkCard = styled(Link)`
  background-color: white;
  border-radius: 10px;
  padding: 30px 20px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  h3 {
    margin: 15px 0;
    color: var(--primary-color-3);
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  margin-bottom: 40px;
  font-size: 2rem;
  color: var(--primary-color-3);
  position: relative;
  
  &:after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background-color: var(--primary-color);
    margin: 15px auto 0;
  }
`;

const ProductsSection = styled.section`
  padding: 50px 0;
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 30px;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 20px;
`;



const TrustBadgesSection = styled.section`
  padding: 0;
  margin-top: -32px;
  position: relative;
  z-index: 10;
`;

const TrustBadgesContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 20px;
`;

const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  border-radius: 50px;
  padding: 12px 22px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.10);

  svg { color: var(--primary-color); }

  h4 {
    margin: 0;
    font-size: 0.88rem;
    font-weight: 600;
    color: #333;
    white-space: nowrap;
  }
`;

const HomePage = () => {
  const { products } = useProducts();
  const { t } = useTranslation();
  
  // Quick links data
  const quickLinks = [
    { name: t('home.quickLinks.categories'), path: "/categories" },
    { name: t('home.quickLinks.giftBoxes'), path: "/gift-boxes" },
    { name: t('home.quickLinks.bulkOrders'), path: "/bulk-orders" },
  ];
  
  // Trust badges data
  const trustBadges = [
    { name: t('home.trustBadges.safety'), Icon: Shield },
    { name: t('home.trustBadges.authentic'), Icon: CheckCircle },
    { name: t('home.trustBadges.pricing'), Icon: Tag },
    { name: t('home.trustBadges.experience'), Icon: Star },
  ];
  
  // Featured products (showing first 4 products)
  const featuredProducts = products.slice(0, 4);
  
  return (
    <>
      <SEO canonical="/" />
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            Celebrate with<br />
            <span>RK Krackers</span>
          </HeroTitle>
          <HeroSubtitle>
            Premium quality sparklers &amp; fireworks sourced directly from Sivakasi.
            Unbeatable prices, safe &amp; fast delivery across India.
          </HeroSubtitle>
          <HeroButtons>
            <HeroButton to="/all-products">{t('home.hero.shopNow')} →</HeroButton>
            <HeroButtonOutline to="/categories">Browse Categories</HeroButtonOutline>
          </HeroButtons>
          <HeroMeta>
            <HeroMetaItem>
              <Phone size={15} />
              9842372122 / 8940888500
            </HeroMetaItem>
            <HeroMetaItem>
              <MapPin size={15} />
              Sivakasi Road, Kumaralinga Puram, Virudhunagar
            </HeroMetaItem>
          </HeroMeta>
        </HeroContent>
      </HeroSection>
      
      <QuickLinksSection>
        <QuickLinksContainer>
          {quickLinks.map((link, index) => (
            <QuickLinkCard key={index} to={link.path}>
              <h3>{link.name}</h3>
            </QuickLinkCard>
          ))}
        </QuickLinksContainer>
      </QuickLinksSection>
      
      <TrustBadgesSection>
        <TrustBadgesContainer>
          {trustBadges.map((badge, index) => (
            <TrustBadge key={index}>
              <badge.Icon size={20} strokeWidth={2} />
              <h4>{badge.name}</h4>
            </TrustBadge>
          ))}
        </TrustBadgesContainer>
      </TrustBadgesSection>
      
      <ProductsSection>
        <SectionTitle>{t('home.featuredProducts')}</SectionTitle>
        <ProductsGrid>
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ProductsGrid>
      </ProductsSection>
      

    </>
  );
};

export default HomePage;