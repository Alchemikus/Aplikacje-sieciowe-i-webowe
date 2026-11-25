import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { Car } from '../models/Car';
import { getCars, deleteCar } from '../services/carService';
import { queryKeys } from '../queries/queryKeys';
import { useCarUiStore } from '../store/useCarUiStore';
import { useAuthStore } from '../store/useAuthStore';
import CarDetailsPage from './CarDetailsPage';
import NotFoundPage from './NotFoundPage';

export default function CarsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles.includes('Admin') ?? false;

  const favoriteCarIdsByUser = useCarUiStore((state) => state.favoriteCarIdsByUser);
  const favoriteCarIds = user ? (favoriteCarIdsByUser[user.id] ?? []) : [];
  const toggleFavorite = useCarUiStore((state) => state.toggleFavorite);
  const removeFavorite = useCarUiStore((state) => state.removeFavorite);
  const searchTerm = useCarUiStore((state) => state.searchTerm);
  const setSearchTerm = useCarUiStore((state) => state.setSearchTerm);
  const showFavoritesOnly = useCarUiStore((state) => state.showFavoritesOnly);
  const setShowFavoritesOnly = useCarUiStore((state) => state.setShowFavoritesOnly);

  const {
    data: cars = [],
    isPending,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.cars,
    queryFn: ({ signal }) => getCars(signal),
  });

  const deleteMutation = useMutation({
    mutationFn: (car: Car) => deleteCar(car.id),
    onSuccess: (_data, deletedCar) => {
      if (id === deletedCar.id) {
        navigate('/cars', { replace: true });
      }

      if (user) {
        removeFavorite(user.id, deletedCar.id);
      }

      queryClient.removeQueries({
        queryKey: queryKeys.car(deletedCar.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.cars,
      });

      toast.success(`Usunięto samochód: ${deletedCar.brand} ${deletedCar.model}`);
    },
    onError: (err, deletedCar) => {
      toast.error(err.message || `Nie udało się usunąć ${deletedCar.brand} ${deletedCar.model}`);
    },
  });

  const isDeletedCurrent = Boolean(id) && deleteMutation.variables?.id === id;

  const isNotFound =
    !isPending &&
    !isFetching &&
    !isError &&
    !isDeletedCurrent &&
    Boolean(id) &&
    !cars.some((car) => car.id === id);

  useEffect(() => {
    if (isNotFound) {
      toast.error('Samochód o podanym ID nie istnieje w Twojej flocie.', {
        id: 'car-not-found',
      });
    }
  }, [isNotFound]);

  const handleDelete = (car: Car) => {
    const confirmed = window.confirm(
      `Czy na pewno chcesz usunąć samochód: ${car.brand} ${car.model}?`,
    );
    if (!confirmed) return;

    deleteMutation.mutate(car);
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
      car.brand.toLowerCase().includes(normalizedSearch) ||
      car.model.toLowerCase().includes(normalizedSearch);

    const matchesFavorite = !showFavoritesOnly || favoriteCarIds.includes(car.id);

    return matchesSearch && matchesFavorite;
  });

  if (isPending) {
    return (
      <div className="page-container loader-container">
        <span className="spinner"></span>
        <p>Pobieranie listy samochodów...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-container">
        <p className="error-message">{error.message}</p>
      </div>
    );
  }

  if (isNotFound) {
    return <NotFoundPage />;
  }

  return (
    <div className="page-container">
      <div className="toolbar-container">
        <div className="search-filter-group">
          <input
            type="search"
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

      <h1 className="page-title" style={{ marginBottom: '1.5rem' }}>
        Posiadane samochody:
      </h1>

      <p>
        Wyświetlono: {visibleCars.length} z {cars.length}
      </p>

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
                        if (user) {
                          toggleFavorite(user.id, car.id);
                        }
                      }}
                      title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
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
                    {isAdmin && (
                      <button
                        type="button"
                        className="btn btn-delete"
                        disabled={deleteMutation.isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(car);
                        }}
                      >
                        Usuń
                      </button>
                    )}
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
