import type { Feature } from "./Feature";
import type { CarPhoto } from "./CarPhoto";

export interface Car {
    id: string;
    brand: string;
    model: string;
    doorsNumber: number;
    luggageCapacity: number;
    engineCapacity: number;
    fuelType: number;
    productionDate: string;
    averageFuelConsumption: number;
    bodyType: number;
    photos: CarPhoto[];
    features: Feature[];
}

export type NewCar = Omit<Car, 'id'>;
