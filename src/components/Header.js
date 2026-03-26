import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Menu } from 'lucide-react';
import CartIcon from './CartIcon';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from '../utils/translate';
import { useProducts } from '../context/ProductsContext';

const HeaderContainer = styled.header`
  background-color: ${({ scrolled }) => scrolled ? 'var(--background-color)' : 'transparent'};
  box-shadow: ${({ scrolled }) => scrolled ? '0 2px 10px rgba(0, 0, 0, 0.1)' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 15px 0;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 20px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: ${({ scrolled }) => scrolled ? 'var(--primary-color-3)' : '#fff'};
  display: flex;
  align-items: center;
  transition: color 0.3s ease;

  span {
    margin-left: 10px;
  }
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

const StyledNavLink = styled(Link)`
  margin: 0 15px;
  font-weight: 500;
  color: ${({ scrolled }) => scrolled ? '#333' : 'rgba(255,255,255,0.88)'};
  transition: color 0.3s ease;

  &:hover {
    color: ${({ scrolled }) => scrolled ? 'var(--primary-color)' : '#fff'};
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-left: 20px;
`;

const SearchBar = styled.form`
  display: flex;
  align-items: center;
  background-color: ${({ scrolled }) => scrolled ? 'var(--background-color-2)' : 'rgba(255,255,255,0.15)'};
  border-radius: 20px;
  padding: 5px 15px;
  border: 1px solid ${({ scrolled }) => scrolled ? 'transparent' : 'rgba(255,255,255,0.3)'};
  transition: background-color 0.3s ease, border-color 0.3s ease;

  input {
    border: none;
    background: transparent;
    padding: 5px;
    outline: none;
    width: 150px;
    color: ${({ scrolled }) => scrolled ? '#333' : '#fff'};

    &::placeholder {
      color: ${({ scrolled }) => scrolled ? '#999' : 'rgba(255,255,255,0.65)'};
    }
  }

  button {
    background: transparent;
    border: none;
    cursor: pointer;
    color: ${({ scrolled }) => scrolled ? '#666' : 'rgba(255,255,255,0.8)'};
  }
`;

const Dropdown = styled.ul`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
  list-style: none;
  margin: 0;
  padding: 4px 0;
  min-width: 280px;
  max-height: 320px;
  overflow-y: auto;
  z-index: 200;
`;

const DropdownItem = styled.li`
  a {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 14px;
    text-decoration: none;
    color: #333;
    transition: background 0.15s;

    &:hover {
      background: var(--background-color-2, #f5f5f5);
    }
  }
`;

const DropdownThumb = styled.img`
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
  background: #eee;
`;

const DropdownName = styled.span`
  flex: 1;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DropdownPrice = styled.span`
  font-size: 0.85rem;
  color: var(--primary-color);
  font-weight: 600;
  white-space: nowrap;
`;

const DropdownFooter = styled.li`
  border-top: 1px solid #eee;
  margin-top: 4px;

  a {
    display: block;
    padding: 8px 14px;
    text-align: center;
    font-size: 0.85rem;
    color: var(--primary-color);
    font-weight: 600;
    text-decoration: none;

    &:hover {
      background: var(--background-color-2, #f5f5f5);
    }
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
`;

const Header = () => {
  const { products } = useProducts();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const wrapperRef = useRef(null);

  // On non-home pages, always treat as scrolled (solid background)
  const transparent = isHome && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const suggestions = searchTerm.trim().length >= 3
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 6)
    : [];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      navigate(`/all-products?q=${encodeURIComponent(q)}`);
      setSearchTerm('');
      setShowDropdown(false);
    }
  };

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setShowDropdown(true);
  };

  const handleSelect = () => {
    setSearchTerm('');
    setShowDropdown(false);
  };

  const navigationItems = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.categories'), path: '/categories' },
    { name: t('nav.allProducts'), path: '/all-products' },
    { name: t('nav.contact'), path: '/contact' }
  ];

  return (
    <HeaderContainer scrolled={!transparent}>
      <HeaderContent>
        <Logo scrolled={!transparent}>
          <span>{t('app.name')}</span>
        </Logo>

        <Navigation>
          {navigationItems.map((item, index) => (
            <StyledNavLink key={index} to={item.path} scrolled={!transparent}>
              {item.name}
            </StyledNavLink>
          ))}

          <SearchWrapper ref={wrapperRef}>
            <SearchBar scrolled={!transparent} onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleChange}
                onFocus={() => searchTerm.trim().length >= 3 && setShowDropdown(true)}
              />
              <button type="submit" aria-label="Search"><Search size={20} /></button>
            </SearchBar>

            {showDropdown && suggestions.length > 0 && (
              <Dropdown>
                {suggestions.map(product => (
                  <DropdownItem key={product.id}>
                    <Link to={`/product/${product.id}`} onClick={handleSelect}>
                      <DropdownThumb src={product.image} alt={product.name} />
                      <DropdownName>{product.name}</DropdownName>
                      <DropdownPrice>
                        ₹{(product.price * (1 - product.discount / 100)).toLocaleString('en-IN')}
                      </DropdownPrice>
                    </Link>
                  </DropdownItem>
                ))}
                <DropdownFooter>
                  <Link
                    to={`/all-products?q=${encodeURIComponent(searchTerm.trim())}`}
                    onClick={handleSelect}
                  >
                    See all results for "{searchTerm.trim()}"
                  </Link>
                </DropdownFooter>
              </Dropdown>
            )}
          </SearchWrapper>
        </Navigation>

        <UserActions>
          <LanguageSelector />
          <CartIcon />
        </UserActions>

        <MobileMenuButton type="button" aria-label="Menu"><Menu size={24} /></MobileMenuButton>
      </HeaderContent>
    </HeaderContainer>
  );
};

export default Header;
