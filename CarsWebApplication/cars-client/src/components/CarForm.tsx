import { Link } from 'react-router';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { getFeatures } from '../services/carService';
import { queryKeys } from '../queries/queryKeys';
import type { CarFormValues } from '../models/CarFormValues';

interface CarFormProps {
  initialValues?: CarFormValues;
  onSubmit: (data: CarFormValues) => void | Promise<void>;
  submitText: string;
  isPending?: boolean;
}

export default function CarForm({
  initialValues = {
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
  },
  onSubmit,
  submitText,
  isPending = false,
}: CarFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CarFormValues>({
    defaultValues: initialValues,
  });

  const {
    data: features = [],
    isPending: featuresPending,
    isError: featuresError,
  } = useQuery({
    queryKey: queryKeys.features,
    queryFn: ({ signal }) => getFeatures(signal),
  });

  const today = new Date().toISOString().split('T')[0];

  const handleFormSubmit: SubmitHandler<CarFormValues> = async (data) => {
    await onSubmit(data);
  };

  const isBusy = isSubmitting || isPending;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="car-form" noValidate>
      <div className="form-group">
        <label htmlFor="brand" className="form-label">Marka:</label>
        <input
          type="text"
          id="brand"
          className="form-control"
          {...register('brand', {
            required: 'Marka jest wymagana.',
            minLength: {
              value: 2,
              message: 'Marka musi mieć co najmniej 2 znaki.',
            },
          })}
        />
        {errors.brand && <p className="error-message">{errors.brand.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="model" className="form-label">Model:</label>
        <input
          type="text"
          id="model"
          className="form-control"
          {...register('model', {
            required: 'Model jest wymagany.',
          })}
        />
        {errors.model && <p className="error-message">{errors.model.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="doorsNumber" className="form-label">Liczba drzwi:</label>
        <input
          type="number"
          id="doorsNumber"
          className="form-control"
          {...register('doorsNumber', {
            valueAsNumber: true,
            required: 'Podaj liczbę drzwi.',
            min: { value: 2, message: 'Minimum 2 drzwi.' },
            max: { value: 5, message: 'Maksimum 5 drzwi.' },
          })}
        />
        {errors.doorsNumber && <p className="error-message">{errors.doorsNumber.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="luggageCapacity" className="form-label">Pojemność bagażnika (l):</label>
        <input
          type="number"
          id="luggageCapacity"
          className="form-control"
          {...register('luggageCapacity', {
            valueAsNumber: true,
            required: 'Podaj pojemność bagażnika.',
            min: { value: 0, message: 'Wartość nie może być ujemna.' },
          })}
        />
        {errors.luggageCapacity && <p className="error-message">{errors.luggageCapacity.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="engineCapacity" className="form-label">Pojemność silnika (cm³):</label>
        <input
          type="number"
          id="engineCapacity"
          className="form-control"
          {...register('engineCapacity', {
            valueAsNumber: true,
            required: 'Podaj pojemność silnika.',
            min: { value: 1, message: 'Wartość musi być dodatnia.' },
          })}
        />
        {errors.engineCapacity && <p className="error-message">{errors.engineCapacity.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="fuelType" className="form-label">Rodzaj paliwa:</label>
        <select
          id="fuelType"
          className="form-control"
          {...register('fuelType', { valueAsNumber: true })}
        >
          <option value={0}>Benzyna (Petrol)</option>
          <option value={1}>Diesel</option>
          <option value={2}>Hybryda</option>
          <option value={3}>Elektryczny</option>
          <option value={4}>LPG</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="productionDate" className="form-label">Data produkcji:</label>
        <input
          type="date"
          id="productionDate"
          max={today}
          className="form-control"
          {...register('productionDate', {
            required: 'Podaj datę produkcji.',
            validate: (value) => value <= today || 'Data produkcji nie może być z przyszłości.',
          })}
        />
        {errors.productionDate && <p className="error-message">{errors.productionDate.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="averageFuelConsumption" className="form-label">Średnie spalanie (l/100km):</label>
        <input
          type="number"
          id="averageFuelConsumption"
          className="form-control"
          step="0.1"
          {...register('averageFuelConsumption', {
            valueAsNumber: true,
            required: 'Podaj średnie spalanie.',
            min: { value: 0.1, message: 'Wartość musi być dodatnia.' },
          })}
        />
        {errors.averageFuelConsumption && (
          <p className="error-message">{errors.averageFuelConsumption.message}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="bodyType" className="form-label">Typ nadwozia:</label>
        <select
          id="bodyType"
          className="form-control"
          {...register('bodyType', { valueAsNumber: true })}
        >
          <option value={0}>Hatchback</option>
          <option value={1}>Sedan</option>
          <option value={2}>Kombi</option>
          <option value={3}>SUV</option>
          <option value={4}>Roadster</option>
        </select>
      </div>

      <div className="form-group">
        <span className="form-label">Wyposażenie:</span>
        {featuresPending ? (
          <p>Ładowanie wyposażenia...</p>
        ) : featuresError ? (
          <p className="error-message">Nie udało się pobrać listy wyposażenia.</p>
        ) : (
          <div className="features-grid">
            {features.map((feature) => (
              <label key={feature.id} className="checkbox-label">
                <input
                  type="checkbox"
                  value={feature.id}
                  className="checkbox-input"
                  {...register('featureIds')}
                />
                {feature.name}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-green" disabled={isBusy}>
          {isBusy ? 'Zapisywanie...' : submitText}
        </button>
        <Link
          to="/cars"
          className="btn btn-edit"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid var(--border)',
            color: 'var(--text)',
          }}
        >
          Anuluj
        </Link>
      </div>
    </form>
  );
}
