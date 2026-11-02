import { Link } from 'react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import type { NewCar } from '../models/Car';

interface CarFormProps {
  initialValues: NewCar;
  onSubmit: (data: NewCar) => Promise<void>;
  submitText: string;
}

export default function CarForm({ initialValues, onSubmit, submitText }: CarFormProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { isSubmitting } 
  } = useForm<NewCar>({
    defaultValues: initialValues
  });

  const handleFormSubmit: SubmitHandler<NewCar> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="car-form">
      <div className="form-group">
        <label htmlFor="brand" className="form-label">Marka:</label>
        <input type="text" id="brand" className="form-control" required {...register('brand')} />
      </div>

      <div className="form-group">
        <label htmlFor="model" className="form-label">Model:</label>
        <input type="text" id="model" className="form-control" required {...register('model')} />
      </div>

      <div className="form-group">
        <label htmlFor="doorsNumber" className="form-label">Liczba drzwi:</label>
        <input type="number" id="doorsNumber" className="form-control" min="1" required {...register('doorsNumber', { valueAsNumber: true })} />
      </div>

      <div className="form-group">
        <label htmlFor="luggageCapacity" className="form-label">Pojemność bagażnika (l):</label>
        <input type="number" id="luggageCapacity" className="form-control" min="0" required {...register('luggageCapacity', { valueAsNumber: true })} />
      </div>

      <div className="form-group">
        <label htmlFor="engineCapacity" className="form-label">Pojemność silnika (cm³):</label>
        <input type="number" id="engineCapacity" className="form-control" min="0" required {...register('engineCapacity', { valueAsNumber: true })} />
      </div>

      <div className="form-group">
        <label htmlFor="fuelType" className="form-label">Rodzaj paliwa:</label>
        <select id="fuelType" className="form-control" {...register('fuelType', { valueAsNumber: true })}>
          <option value={0}>Benzyna (Petrol)</option>
          <option value={1}>Diesel</option>
          <option value={2}>Hybryda</option>
          <option value={3}>Elektryczny</option>
          <option value={4}>LPG</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="productionDate" className="form-label">Data produkcji:</label>
        <input type="date" id="productionDate" className="form-control" required {...register('productionDate')} />
      </div>

      <div className="form-group">
        <label htmlFor="averageFuelConsumption" className="form-label">Średnie spalanie (l/100km):</label>
        <input type="number" id="averageFuelConsumption" className="form-control" step="0.1" min="0" required {...register('averageFuelConsumption', { valueAsNumber: true })} />
      </div>

      <div className="form-group">
        <label htmlFor="bodyType" className="form-label">Typ nadwozia:</label>
        <select id="bodyType" className="form-control" {...register('bodyType', { valueAsNumber: true })}>
          <option value={0}>Hatchback</option>
          <option value={1}>Sedan</option>
          <option value={2}>Kombi</option>
          <option value={3}>SUV</option>
          <option value={4}>Roadster</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-green" disabled={isSubmitting}>
          {isSubmitting ? 'Zapisywanie...' : submitText}
        </button>
        <Link to="/cars" className="btn btn-edit" style={{ backgroundColor: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}>
          Anuluj
        </Link>
      </div>
    </form>
  );
}