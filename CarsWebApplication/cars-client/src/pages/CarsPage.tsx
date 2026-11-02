import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';
import CarDetailsPage from './CarDetailsPage';
import NotFoundPage from './NotFoundPage';

export default function CarsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCars = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCars();
      setCars(data);
    } catch (err) {
      setError('Nie udało się pobrać listy samochodów.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  const isNotFound = !loading && id && !cars.some((car) => car.id === id);

  useEffect(() => {
    if (isNotFound) {
      toast.error('Samochód o podanym ID nie istnieje w Twojej flocie.');
    }
  }, [isNotFound]);

  if (isNotFound) {
    return <NotFoundPage />;
  }

  const handleDelete = async (car: Car) => {
    const confirmed = window.confirm(`Czy na pewno chcesz usunąć samochód: ${car.brand} ${car.model}?`);
    if (!confirmed) return;

    try {
      await deleteCar(car.id);
      await loadCars();
      toast.success(`Usunięto samochód: ${car.brand} ${car.model}`);
      if (id === car.id) navigate('/cars');
    } catch (err) {
      toast.error(`Nie udało się usunąć ${car.brand} ${car.model}`);
    }
  };

  const handleTileClick = (carId: string) => {
    if (id === carId) {
      navigate('/cars');
    } else {
      navigate(`/cars/${carId}`);
    }
  };

  if (loading && cars.length === 0) return (
    <div className="page-container loader-container">
      <span className="spinner"></span>
      <p>Pobieranie listy samochodów...</p>
    </div>
  );
  
  if (error) return <div className="page-container"><p>{error}</p></div>;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="page-title">Posiadane samochody:</h1>
        <Link to="/cars/new" className="btn btn-green">
          Dodaj nowy samochód
        </Link>
      </div>
      
      {cars.length === 0 ? (
        <p>Lista jest pusta.</p>
      ) : (
        <div className="cars-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {cars.map((car) => (
            <div 
              key={car.id} 
              onClick={() => handleTileClick(car.id)}
              style={{
                border: '1px solid var(--border)',
                padding: '1.2rem 3%',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: 'var(--bg)',
                boxShadow: 'var(--shadow)',
                transition: 'border-color 0.2s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-h)' }}>
                  {car.brand} {car.model} ({car.productionDate.substring(0, 4)})
                </h3>
                
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link 
                    to={`/cars/${car.id}/edit`} 
                    className="btn btn-edit"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Edytuj
                  </Link>
                  <button 
                    className="btn btn-delete"
                    onClick={(e) => { e.stopPropagation(); handleDelete(car); }}
                  >
                    Usuń
                  </button>
                </div>
              </div>
              
              {id === car.id && (
                <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                  <CarDetailsPage />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}