export default function AboutPage() {
  return (
    <div className="page-container">
      <h1 className="page-title">O aplikacji</h1>
      <div className="car-form" style={{ maxWidth: '100%', gap: '1rem', padding: '2rem' }}>
        <h2 style={{ margin: 0, paddingBottom: '0.5rem' }}>AutoManager</h2>
        <p>
          AutoManager to nowoczesny system do zarządzania flotą pojazdów. Umożliwia wygodne śledzenie parametrów technicznych samochodów, ich edycję oraz organizację poprzez system ulubionych pojazdów.
        </p>
        <p>
          Aplikacja została zbudowana w oparciu o React, TypeScript oraz Zustand do zaawansowanego zarządzania stanem, gwarantując wydajność i doskonałe doświadczenie użytkownika (UX).
        </p>
      </div>
    </div>
  );
}
