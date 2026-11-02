import { Link } from 'react-router';

export default function HomePage() {
  return (
    <div className="page-container" style={{ 
      textAlign: 'center', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh'
    }}>
      <h1 className="page-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        Witaj w <span style={{ color: '#22c55e' }}>AutoManager</span>
      </h1>
      
      <p style={{ 
        color: 'var(--text)', 
        fontSize: '1.2rem', 
        lineHeight: '1.6',
        maxWidth: '600px', 
        marginBottom: '3rem' 
      }}>
        Twoje osobiste centrum zarządzania pojazdami. Miej pełną kontrolę nad swoją flotą, 
        dodawaj nowe samochody i aktualizuj ich dane w szybki, nowoczesny sposób.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link 
          to="/cars" 
          className="btn btn-green" 
          style={{ fontSize: '1.1rem', padding: '0.8rem 1.8rem' }}
        >
          Przejdź do listy pojazdów
        </Link>
        
        <Link 
          to="/cars/new" 
          className="btn btn-edit" 
          style={{ 
            fontSize: '1.1rem', 
            padding: '0.8rem 1.8rem', 
            backgroundColor: 'transparent', 
            border: '2px solid var(--border)', 
            color: 'var(--text)' 
          }}
        >
          Dodaj samochód
        </Link>
      </div>
    </div>
  );
}