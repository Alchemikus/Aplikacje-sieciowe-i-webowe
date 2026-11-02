import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import toast from 'react-hot-toast';
import type { NewCar } from '../models/Car';
import { getCarById, updateCar } from '../services/carService';
import CarForm from '../components/CarForm';

export default function EditCarPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<NewCar | null>(null);

  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const controller = new AbortController();

    const fetchCar = async () => {
      try {
        const carData = await getCarById(id, controller.signal);
        
        if (isMounted) {
          setInitialData({
            brand: carData.brand,
            model: carData.model,
            doorsNumber: carData.doorsNumber,
            luggageCapacity: carData.luggageCapacity,
            engineCapacity: carData.engineCapacity,
            fuelType: carData.fuelType,
            productionDate: carData.productionDate.substring(0, 10),
            averageFuelConsumption: carData.averageFuelConsumption,
            bodyType: carData.bodyType
          });
          setLoading(false);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError' && isMounted) {
          toast.error('Nie udało się pobrać danych samochodu.');
          navigate('/cars');
        }
      }
    };

    fetchCar();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, navigate]);

  const handleUpdate = async (data: NewCar) => {
    if (!id) return;
    try {
      await updateCar(id, data);
      toast.success('Pomyślnie zaktualizowano dane samochodu!');
      navigate('/cars', { state: { expandedCarId: id } });
    } catch (err) {
      toast.error('Wystąpił błąd podczas aktualizacji. Spróbuj ponownie.');
    }
  };

  if (loading || !initialData) return (
    <div className="page-container loader-container">
      <span className="spinner"></span>
      <p>Wczytywanie danych samochodu...</p>
    </div>
  );

  return (
    <div className="page-container">
      <h1 className="page-title" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        Edytuj samochód
      </h1>
      <CarForm initialValues={initialData} onSubmit={handleUpdate} submitText="Zapisz zmiany" />
    </div>
  );
}