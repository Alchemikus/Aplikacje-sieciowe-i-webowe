import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="page-container" style={{ 
      textAlign: 'center', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '65vh'
    }}>
      <h1 style={{ 
        fontSize: '8rem', 
        fontWeight: '900', 
        color: '#991b1b', 
        margin: '0', 
        lineHeight: '1',
        textShadow: '2px 4px 10px rgba(153, 27, 27, 0.3)' 
      }}>
        404
      </h1>
      
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-h)' }}>
        Ups! Zjechałeś z trasy...
      </h2>
      
      <p style={{ 
        color: 'var(--text)', 
        fontSize: '1.2rem', 
        lineHeight: '1.6',
        maxWidth: '500px', 
        marginBottom: '2.5rem' 
      }}>
        Wygląda na to, że strona, której szukasz nie istnieje. Pozwól, że pomożemy Ci wrócić na właściwą ścieżkę. Kliknij przycisk poniżej, aby wrócić do bazy i kontynuować swoją podróż.
      </p>
      
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-green" style={{ fontSize: '1.1rem', padding: '0.8rem 1.5rem' }}>
          Wróć do bazy
        </Link>
      </div>
    </div>
  );
}