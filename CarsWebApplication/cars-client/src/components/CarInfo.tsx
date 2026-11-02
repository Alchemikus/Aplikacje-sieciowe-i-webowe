import type { Car } from '../models/Car';

interface CarInfoProps {
  car: Car;
}

export default function CarInfo({ car }: CarInfoProps) {
  return (
    <div style={{ 
      color: 'var(--text)', 
      padding: '0.5rem 0 0.5rem 5%' /* 5% wcięcia od lewej, symulujące tabulator względem nagłówka auta */
    }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'max-content max-content', /* Gwarantuje, że kolumny dopasują się do tekstu i go nie ugną */
        columnGap: '5%', /* Procentowy odstęp między etykietą a wartością */
        rowGap: '0.5rem', 
        textAlign: 'left',
        whiteSpace: 'nowrap' /* Zapobiega łamaniu zawartości (np. daty) na dwie linie */
      }}>
        <div><strong>Liczba drzwi:</strong></div> <div>{car.doorsNumber}</div>
        <div><strong>Pojemność bagażnika:</strong></div> <div>{car.luggageCapacity} l</div>
        <div><strong>Pojemność silnika:</strong></div> <div>{car.engineCapacity} cm³</div>
        <div><strong>Rodzaj paliwa:</strong></div> <div>{car.fuelType}</div>
        <div><strong>Data produkcji:</strong></div> <div>{car.productionDate}</div>
        <div><strong>Średnie spalanie:</strong></div> <div>{car.averageFuelConsumption} l/100km</div>
        <div><strong>Typ nadwozia:</strong></div> <div>{car.bodyType}</div>
      </div>
    </div>
  );
}