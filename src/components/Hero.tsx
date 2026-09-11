import React from 'react';

interface HeroProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title = 'Cardápio da semana 🍽️',
  subtitle = 'Confira as refeições, saladas, frutas e informações nutricionais disponíveis para os alunos.',
  badgeText = 'Cardápio escolar',
}) => {
  return (
    <section className="hero">
      <div className="container">
        <span className="hero-badge">
          <i className="bi bi-calendar3"></i>
          {badgeText}
        </span>

        <h1>
          {title.includes('🍽️') ? (
            <>
              Cardápio da<br />
              semana 🍽️
            </>
          ) : (
            title
          )}
        </h1>

        <p className="mb-0">{subtitle}</p>
      </div>
    </section>
  );
};

