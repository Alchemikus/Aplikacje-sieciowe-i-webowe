import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';
import CarDetailsPage from './CarDetailsPage';
import NotFoundPage from './NotFoundPage';
import axios from 'axios';
import { useCarUiStore } from '../store/useCarUiStore';

export default function CarsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const favoriteCarIds = useCarUiStore((state) => state.favoriteCarIds);
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);
  const searchTerm = useCarUiStore((state) => state.searchTerm);
  const setSearchTerm = useCarUiStore((state) => state.setSearchTerm);
  const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly);
  const setShowFavoritesOnly = useCarUiStore((state) => state.setShowFavoritesOnly);
  const removeFavorite = useCarUiStore((state) => state.removeFavorite);

  
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCars = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCars();
      setCars(data);
    } catch (err) {
      if (axios.isCancel(err)) {
        return;
      }
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
      if (id === car.id) navigate('/cars');
      removeFavorite(car.id);
      await loadCars();
      toast.success(`Usunięto samochód: ${car.brand} ${car.model}`);
    } catch (err) {
      if (axios.isCancel(err)) {
        return;
      }
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

  const normalizedSearch = searchTerm.trim().toLowerCase();

  const visibleCars = cars.filter((car) => {
    const matchesSearch = 
      car.brand.toLowerCase().includes(normalizedSearch)
      ||
      car.model.toLowerCase().includes(normalizedSearch);

    const matchesFavorite =
      !showFavoritesOnly
      ||
      favoriteCarIds.includes( car.id );

    return (
      matchesSearch && matchesFavorite
    );
  });


  if (loading && cars.length === 0) return (
    <div className="page-container loader-container">
      <span className="spinner"></span>
      <p>Pobieranie listy samochodów...</p>
    </div>
  );
  
  if (error) return <div className="page-container"><p>{error}</p></div>;

  return (
    <div className="page-container">
      <div className="toolbar-container">
        
        <div className="search-filter-group">
          <input
            type="text"
            placeholder="Szukaj samochodu..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="search-input"
          />
          
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(event) => setShowFavoritesOnly(event.target.checked)}
              className="checkbox-input"
            />
            Tylko ulubione
          </label>
        </div>

        <Link to="/cars/new" className="btn btn-green">
          Dodaj nowy samochód
        </Link>
      </div>
      
      <h1 className="page-title" style={{ marginBottom: '1.5rem' }}>Posiadane samochody:</h1>
      
      {visibleCars.length === 0 ? (
        <p>Brak samochodów do wyświetlenia.</p>
      ) : (
        <div className="cars-list">
          {visibleCars.map((car) => {
            const isFavorite = favoriteCarIds.includes(car.id);

            return (
              <div 
                key={car.id} 
                onClick={() => handleTileClick(car.id)}
                className="car-tile"
              >
                <div className="car-tile-header">
                  <div className="car-tile-info">
                    <button
                      type="button"
                      className="favorite-star-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(car.id);
                      }}
                      title={isFavorite ? "Usuń z ulubionych" : "Dodaj do ulubionych"}
                    >
                      {isFavorite ? '★' : '☆'}
                    </button>
                    <h3 className="car-tile-title">
                      {car.brand} {car.model} ({car.productionDate.substring(0, 4)})
                    </h3>
                  </div>
                  
                  <div className="car-tile-actions">
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
                  <div 
                    className="car-tile-details" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CarDetailsPage />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}