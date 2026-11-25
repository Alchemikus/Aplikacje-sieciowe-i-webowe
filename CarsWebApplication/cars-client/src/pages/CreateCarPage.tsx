import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { Car } from '../models/Car';
import { createCar } from '../services/carService';
import { queryKeys } from '../queries/queryKeys';
import CarForm from '../components/CarForm';
import type { CarFormValues } from '../models/CarFormValues';

const defaultNewCar: CarFormValues = {
  brand: '',
  model: '',
  doorsNumber: 5,
  luggageCapacity: 400,
  engineCapacity: 1600,
  fuelType: 0,
  productionDate: '',
  averageFuelConsumption: 6.5,
  bodyType: 0,
  featureIds: [],
};

export default function CreateCarPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createCar,
    onSuccess: (createdCar) => {
      queryClient.setQueryData<Car[]>(queryKeys.cars, (oldCars) =>
        oldCars ? [...oldCars, createdCar] : [createdCar],
      );
      queryClient.invalidateQueries({
        queryKey: queryKeys.cars,
      });
      toast.success('Pomyślnie dodano samochód!');
      navigate(`/cars/${createdCar.id}`);
    },
    onError: (err) => {
      toast.error(err.message || 'Wystąpił błąd podczas dodawania. Spróbuj ponownie.');
    },
  });

  const handleCreate = (data: CarFormValues) => {
    createMutation.mutate(data);
  };

  return (
    <div className="page-container">
      <h1 className="page-title" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        Dodaj nowy samochód
      </h1>
      <CarForm
        initialValues={defaultNewCar}
        onSubmit={handleCreate}
        submitText="Dodaj i Zapisz"
        isPending={createMutation.isPending}
      />
    </div>
  );
}
