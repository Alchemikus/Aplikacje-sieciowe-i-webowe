import { useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteCarPhoto, getCarById } from '../services/carService';
import { queryKeys } from '../queries/queryKeys';
import { useAuthStore } from '../store/useAuthStore';
import CarPhotoUpload from '../components/CarPhotoUpload';

const getFuelTypeName = (type: number) =>
  ['Benzyna', 'Diesel', 'Hybryda', 'Elektryczny', 'LPG'][type] ?? 'Nieznany';

const getBodyTypeName = (type: number) =>
  ['Hatchback', 'Sedan', 'Kombi', 'SUV', 'Roadster'][type] ?? 'Nieznany';

export default function CarDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const carId = id ?? '';
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.roles.includes('Admin') ?? false;

  const {
    data: car,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: queryKeys.car(carId),
    queryFn: ({ signal }) => getCarById(carId, signal),
    enabled: Boolean(id),
  });

  const deletePhotoMutation = useMutation({
    mutationFn: (photoId: string) => deleteCarPhoto(carId, photoId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.car(carId),
      });
      toast.success('Zdjęcie zostało usunięte.');
    },
    onError: (err) => {
      toast.error(err.message || 'Nie udało się usunąć zdjęcia.');
    },
  });

  const handleDeletePhoto = (photoId: string) => {
    const confirmed = window.confirm('Czy na pewno chcesz usunąć to zdjęcie?');
    if (!confirmed) return;

    deletePhotoMutation.mutate(photoId);
  };

  if (isPending) {
    return (
      <div className="car-details-loader">
        <span className="spinner spinner-sm"></span>
      </div>
    );
  }

  if (isError) {
    return <p className="error-message">{error.message}</p>;
  }

  if (!car) return null;

  const mainPhoto = car.photos.find((photo) => photo.isMain) ?? car.photos[0];

  return (
    <div className="car-details">
      {mainPhoto ? (
        <div className="car-details-section">
          <img
            src={mainPhoto.url}
            alt={`${car.brand} ${car.model}`}
            className="car-main-photo"
          />
        </div>
      ) : (
        <div className="car-no-photo">Brak zdjęcia</div>
      )}

      <div className="car-specs-grid">
        <p><strong>ID:</strong> {car.id}</p>
        <p><strong>Poj. silnika:</strong> {car.engineCapacity} cm³</p>
        <p><strong>Marka:</strong> {car.brand}</p>
        <p><strong>Paliwo:</strong> {getFuelTypeName(car.fuelType)}</p>
        <p><strong>Model:</strong> {car.model}</p>
        <p><strong>Data produkcji:</strong> {car.productionDate.substring(0, 10)}</p>
        <p><strong>Śr. spalanie:</strong> {car.averageFuelConsumption} l/100km</p>
        <p><strong>Liczba drzwi:</strong> {car.doorsNumber}</p>
        <p><strong>Poj. bagażnika:</strong> {car.luggageCapacity} litrów</p>
        <p><strong>Nadwozie:</strong> {getBodyTypeName(car.bodyType)}</p>
      </div>

      <div className="car-details-section">
        <h4 className="car-details-heading">Wyposażenie</h4>
        {car.features.length === 0 ? (
          <p className="muted-text">Brak przypisanego wyposażenia.</p>
        ) : (
          <div className="car-features-list">
            {car.features.map((feature) => (
              <span key={feature.id} className="feature-badge">
                {feature.name}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="car-details-section">
        <h4 className="car-details-heading">Galeria zdjęć</h4>
        {car.photos.length === 0 ? (
          <p className="muted-text">Brak zdjęć samochodu.</p>
        ) : (
          <div className="car-photos-grid">
            {car.photos.map((photo) => (
              <div key={photo.id} className="car-photo-card">
                <img
                  src={photo.url}
                  alt={`Zdjęcie ${car.brand} ${car.model}`}
                  className="car-photo-img"
                />
                <div className="car-photo-actions">
                  {photo.isMain && (
                    <span className="photo-main-badge">★ Główne</span>
                  )}
                  {isAdmin && (
                    <button
                      type="button"
                      className="btn btn-delete"
                      disabled={deletePhotoMutation.isPending}
                      onClick={() => handleDeletePhoto(photo.id)}
                    >
                      Usuń
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CarPhotoUpload carId={car.id} />
    </div>
  );
}
