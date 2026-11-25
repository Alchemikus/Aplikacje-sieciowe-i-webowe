import { Link, useNavigate, useParams } from 'react-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { CarFormValues } from '../models/CarFormValues';
import { getCarById, updateCar } from '../services/carService';
import { queryKeys } from '../queries/queryKeys';
import CarForm from '../components/CarForm';

export default function EditCarPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const carId = id ?? '';

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

  const updateMutation = useMutation({
    mutationFn: (values: CarFormValues) => updateCar(carId, values),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.cars }),
        queryClient.invalidateQueries({ queryKey: queryKeys.car(carId) }),
      ]);
      toast.success('Pomyślnie zaktualizowano dane samochodu!');
      navigate(`/cars/${carId}`);
    },
    onError: (err) => {
      toast.error(err.message || 'Wystąpił błąd podczas aktualizacji. Spróbuj ponownie.');
    },
  });

  const handleUpdate = (data: CarFormValues) => {
    updateMutation.mutate(data);
  };

  if (!id) {
    return (
      <div className="page-container">
        <p className="error-message">Brak identyfikatora samochodu.</p>
        <Link to="/cars" className="btn btn-edit">
          Wróć do listy
        </Link>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="page-container loader-container">
        <span className="spinner"></span>
        <p>Wczytywanie danych samochodu...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page-container">
        <p className="error-message">{error.message}</p>
        <Link to="/cars" className="btn btn-edit">
          Wróć do listy
        </Link>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="page-container">
        <p className="error-message">Nie znaleziono samochodu.</p>
        <Link to="/cars" className="btn btn-edit">
          Wróć do listy
        </Link>
      </div>
    );
  }

  const initialValues: CarFormValues = {
    brand: car.brand,
    model: car.model,
    doorsNumber: car.doorsNumber,
    luggageCapacity: car.luggageCapacity,
    engineCapacity: car.engineCapacity,
    fuelType: car.fuelType,
    productionDate: car.productionDate.substring(0, 10),
    averageFuelConsumption: car.averageFuelConsumption,
    bodyType: car.bodyType,
    featureIds: car.features.map((feature) => feature.id),
  };

  return (
    <div className="page-container">
      <h1 className="page-title" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        Edytuj samochód
      </h1>
      <CarForm
        key={car.id}
        initialValues={initialValues}
        onSubmit={handleUpdate}
        submitText="Zapisz zmiany"
        isPending={updateMutation.isPending}
      />
    </div>
  );
}
