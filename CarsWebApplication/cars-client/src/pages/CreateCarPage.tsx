import { useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import type { NewCar } from '../models/Car';
import { createCar } from '../services/carService';
import CarForm from '../components/CarForm';

const defaultNewCar: NewCar = {
  brand: '', model: '', doorsNumber: 5, luggageCapacity: 0,
  engineCapacity: 0, fuelType: 0, productionDate: '',
  averageFuelConsumption: 0, bodyType: 0
};

export default function CreateCarPage() {
  const navigate = useNavigate();

  const handleCreate = async (data: NewCar) => {
    try {
      await createCar(data);
      toast.success('Pomyślnie dodano samochód!');
      navigate('/cars');
    } catch (err) {
      toast.error('Wystąpił błąd podczas dodawania. Spróbuj ponownie.');
    }
  };

  return (
    <div className="page-container">
      <h1 className="page-title" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        Dodaj nowy samochód
      </h1>
      <CarForm initialValues={defaultNewCar} onSubmit={handleCreate} submitText="Dodaj i Zapisz" />
    </div>
  );
}