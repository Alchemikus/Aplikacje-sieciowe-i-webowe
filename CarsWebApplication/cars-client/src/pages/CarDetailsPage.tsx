import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import type { Car } from '../models/Car';
import { getCarById } from '../services/carService';
import axios from 'axios';

const getFuelTypeName = (type: number) => ['Benzyna', 'Diesel', 'Hybryda', 'Elektryczny', 'LPG'][type] || type;
const getBodyTypeName = (type: number) => ['Hatchback', 'Sedan', 'Kombi', 'SUV', 'Roadster'][type] || type;

export default function CarDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    let isMounted = true;
    const fetchCar = async () => {
      try {
        const data = await getCarById(id);
        if (isMounted) {
          setCar(data);
          setLoading(false);
        }
      } catch (err) {
        if (axios.isCancel(err)) {
          return;
        }
        if (isMounted) {
          toast.error('Nie udało się pobrać szczegółów samochodu.');
          navigate('/cars');
        }
      }
    };

    fetchCar();
    
    return () => { isMounted = false; };
  }, [id, navigate]);

  if (loading) return (
    <div style={{ padding: '1rem', textAlign: 'center' }}>
      <span className="spinner" style={{ width: '24px', height: '24px', borderWidth: '3px' }}></span>
    </div>
  );
  
  if (!car) return null;

  return (
    <div style={{ backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '0.5rem 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', color: 'var(--text)', marginBottom: '1.5rem', fontSize: '1rem' }}>
        <p style={{ margin: 0 }}><strong>ID:</strong> {car.id}</p>
        <p style={{ margin: 0 }}><strong>Poj. silnika:</strong> {car.engineCapacity} cm³</p>
        <p style={{ margin: 0 }}><strong>Marka:</strong> {car.brand}</p>
        <p style={{ margin: 0 }}><strong>Paliwo:</strong> {getFuelTypeName(car.fuelType)}</p>
        <p style={{ margin: 0 }}><strong>Model:</strong> {car.model}</p>
        <p style={{ margin: 0 }}><strong>Data produkcji:</strong> {car.productionDate.substring(0, 10)}</p>
        <p style={{ margin: 0 }}><strong>Śr. spalanie:</strong> {car.averageFuelConsumption} l/100km</p>
        <p style={{ margin: 0 }}><strong>Liczba drzwi:</strong> {car.doorsNumber}</p>
        <p style={{ margin: 0 }}><strong>Poj. bagażnika:</strong> {car.luggageCapacity} litrów</p>
        <p style={{ margin: 0 }}><strong>Nadwozie:</strong> {getBodyTypeName(car.bodyType)}</p>
      </div>
    </div>
  );
}