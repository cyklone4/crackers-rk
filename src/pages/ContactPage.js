import React from 'react';
import { getCategories, getCrackerTypesByCategory } from '../data/dataService';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { MapPin, Phone, Mail, Clock, Flame, Eye, Droplets, Ruler } from 'lucide-react';
import { getCategoryIconComponent } from '../utils/categoryIcons';
import { useTranslation } from '../utils/translate';

const ContactPage = () => {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <SEO
        title="Contact Us"
        description="Contact RK Krackers – call +91 98423 72122 or +91 89408 88500. Located at 3/1991 Sivakasi Road, Virudhunagar, Tamil Nadu. Order fireworks online or visit us."
        canonical="/contact"
      />
      <PageHeader>
        <h1>{t('contact.title')}</h1>
        <Breadcrumb>
          <Link to="/">{t('nav.home')}</Link> / {t('contact.title')}
        </Breadcrumb>
      </PageHeader>

      <ContactSection>
        <ContactInfo>
          <h2>{t('contact.getInTouch')}</h2>
          <p>{t('contact.getInTouchDesc')}</p>

          <ContactDetail>
            <ContactIcon><MapPin size={24} /></ContactIcon>
            <div>
              <h3>{t('contact.address.title')}</h3>
              <p>3/1991 Sivakasi road, Kumaralinga puram, Virudhunagar, Tamil Nadu 626103, India</p>
            </div>
          </ContactDetail>

          <ContactDetail>
            <ContactIcon><Phone size={24} /></ContactIcon>
            <div>
              <h3>{t('contact.phone.title')}</h3>
              <p>+91 9842372122, 8940888500</p>
            </div>
          </ContactDetail>

          <ContactDetail>
            <ContactIcon><Mail size={24} /></ContactIcon>
            <div>
              <h3>{t('contact.email.title')}</h3>
              <p>info@crackersrk.com</p>
            </div>
          </ContactDetail>

          <ContactDetail>
            <ContactIcon><Clock size={24} /></ContactIcon>
            <div>
              <h3>{t('contact.hours.title')}</h3>
              <p>{t('contact.hours.weekdays')}</p>
              <p>{t('contact.hours.sunday')}</p>
            </div>
          </ContactDetail>
        </ContactInfo>

        <ContactForm>
          <h2>{t('contact.sendMessage')}</h2>
          <FormGroup>
            <Label htmlFor="name">{t('contact.form.name')}</Label>
            <Input type="text" id="name" name="name" />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="email">{t('contact.form.email')}</Label>
            <Input type="email" id="email" name="email" />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="phone">{t('contact.form.phone')}</Label>
            <Input type="tel" id="phone" name="phone" />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="subject">{t('contact.form.subject')}</Label>
            <Input type="text" id="subject" name="subject" />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="message">{t('contact.form.message')}</Label>
            <TextArea id="message" name="message" rows="5"></TextArea>
          </FormGroup>

          <SubmitButton type="submit">{t('contact.form.submit')}</SubmitButton>
        </ContactForm>
      </ContactSection>

      <ProductCategoriesSection>
        <h2>{t('contact.products.title')}</h2>
        <p>{t('contact.products.desc')}</p>

        <CategoriesGrid>
          {getCategories().map(category => {
            const types = getCrackerTypesByCategory(category.name);
            return (
              <CategoryCard key={category.id}>
                <CategoryIcon>
                  {React.createElement(getCategoryIconComponent(category.icon), { size: 32 })}
                </CategoryIcon>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <CategoryTypes>
                  {types && types.map((type, index) => (
                    <TypeItem key={index}>{type}</TypeItem>
                  ))}
                </CategoryTypes>
              </CategoryCard>
            );
          })}
        </CategoriesGrid>
      </ProductCategoriesSection>

      <SafetySection>
        <h2>{t('contact.safety.title')}</h2>
        <p>{t('contact.safety.desc')}</p>

        <SafetyGrid>
          <SafetyItem>
            <SafetyIcon><Flame size={24} /></SafetyIcon>
            <h3>{t('contact.safety.flammables.title')}</h3>
            <p>{t('contact.safety.flammables.desc')}</p>
          </SafetyItem>

          <SafetyItem>
            <SafetyIcon><Eye size={24} /></SafetyIcon>
            <h3>{t('contact.safety.supervision.title')}</h3>
            <p>{t('contact.safety.supervision.desc')}</p>
          </SafetyItem>

          <SafetyItem>
            <SafetyIcon><Droplets size={24} /></SafetyIcon>
            <h3>{t('contact.safety.water.title')}</h3>
            <p>{t('contact.safety.water.desc')}</p>
          </SafetyItem>

          <SafetyItem>
            <SafetyIcon><Ruler size={24} /></SafetyIcon>
            <h3>{t('contact.safety.distance.title')}</h3>
            <p>{t('contact.safety.distance.desc')}</p>
          </SafetyItem>
        </SafetyGrid>
      </SafetySection>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    font-size: 2.5rem;
    color: var(--primary-color-3);
    margin-bottom: 0.5rem;
  }
`;

const Breadcrumb = styled.div`
  font-size: 0.9rem;
  color: #777;
  
  a {
    color: var(--primary-color);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ContactSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  h2 {
    font-size: 1.8rem;
    color: var(--primary-color-3);
    margin-bottom: 1.5rem;
  }
  
  > p {
    margin-bottom: 2rem;
    line-height: 1.6;
    color: #555;
  }
`;

const ContactDetail = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  
  h3 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
    color: var(--primary-color-2);
  }
  
  p {
    margin: 0;
    color: #555;
  }
`;

const ContactIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 1rem;
  color: var(--primary-color);
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
`;

const SocialIcon = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  text-decoration: none;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary-color-3);
  }
`;

const ContactForm = styled.form`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  h2 {
    font-size: 1.8rem;
    color: var(--primary-color-3);
    margin-bottom: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  resize: vertical;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: var(--primary-color);
    outline: none;
  }
`;

const SubmitButton = styled.button`
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: var(--primary-color-3);
  }
`;

const ProductCategoriesSection = styled.section`
  margin: 4rem 0;
  
  h2 {
    font-size: 2rem;
    color: var(--primary-color-3);
    text-align: center;
    margin-bottom: 1rem;
  }
  
  > p {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 3rem;
    color: #555;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const CategoryCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  h3 {
    font-size: 1.4rem;
    color: var(--primary-color-2);
    margin: 1rem 0;
  }
  
  p {
    color: #555;
    margin-bottom: 1.5rem;
  }
`;

const CategoryIcon = styled.div`
  font-size: 2.5rem;
  color: var(--primary-color);
`;

const CategoryTypes = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TypeItem = styled.li`
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  color: #555;
  
  &:last-child {
    border-bottom: none;
  }
`;

const SafetySection = styled.section`
  background-color: #f9f9f9;
  padding: 3rem;
  border-radius: 8px;
  margin: 4rem 0;
  
  h2 {
    font-size: 2rem;
    color: var(--primary-color-3);
    text-align: center;
    margin-bottom: 1rem;
  }
  
  > p {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 3rem;
    color: #555;
  }
`;

const SafetyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 2rem;
`;

const SafetyItem = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  h3 {
    font-size: 1.2rem;
    color: var(--primary-color-2);
    margin: 1rem 0;
  }
  
  p {
    color: #555;
    margin: 0;
  }
`;

const SafetyIcon = styled.div`
  font-size: 2rem;
  color: var(--primary-color);
`;

export default ContactPage;