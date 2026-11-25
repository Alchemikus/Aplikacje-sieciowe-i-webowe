import axios from 'axios';

import type { Car } from '../models/Car';
import type { CarFormValues } from '../models/CarFormValues';
import type { CarPhoto } from '../models/CarPhoto';
import type { Feature } from '../models/Feature';

import { apiClient } from '../api/apiClient';

function createServiceError(error: unknown, message: string): Error {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            return new Error(
                `${message} Status HTTP: ${error.response.status}.`, { cause: error },
            );
        }

        if (error.request) {
            return new Error(
                `${message} Brak odpowiedzi z serwera.`, { cause: error },
            );
        }

        return new Error(
            `${message} ${error.message}`, { cause: error },
        );
    }

    if (error instanceof Error) {
        return error;
    }

    return new Error(
        message, { cause: error },
    );
}

export async function getCars(signal?: AbortSignal): Promise<Car[]> {
    try {
        const response = await apiClient.get<Car[]>(
            `/cars`, { signal },
        );

        return response.data;
    }
    catch (error) {
        if (axios.isCancel(error)) { throw error }

        throw createServiceError(error, 'Nie udało się pobrać samochodów.');
    }
}

export async function getCarById(id: string, signal?: AbortSignal): Promise<Car> {
    try {
        const response = await apiClient.get<Car>(
            `/cars/${id}`, { signal },
        );

        return response.data;
    }
    catch (error) {
        if (axios.isCancel(error)) { throw error }

        throw createServiceError(error, 'Nie udało się pobrać samochodu.');
    }
}

export async function getFeatures(signal?: AbortSignal): Promise<Feature[]> {
    try {
        const response = await apiClient.get<Feature[]>(
            `/features`, { signal },
        );

        return response.data;
    }
    catch (error) {
        if (axios.isCancel(error)) { throw error }

        throw createServiceError(error, 'Nie udało się pobrać wyposażenia.');
    }
}

export async function createCar(values: CarFormValues): Promise<Car> {
    try {
        const { featureIds, ...carData } = values;

        const response = await apiClient.post<Car>(`/cars`, carData);
        const createdCar = response.data;

        await updateCarFeatures(createdCar.id, featureIds);

        return await getCarById(createdCar.id);
    }
    catch (error) {
        throw createServiceError(error, 'Nie udało się dodać samochodu.');
    }
}

export async function updateCar(id: string, values: CarFormValues): Promise<void> {
    try {
        const { featureIds, ...carData } = values;

        await apiClient.put(`/cars/${id}`, carData);
        await updateCarFeatures(id, featureIds);
    }
    catch (error) {
        throw createServiceError(error, 'Nie udało się zaktualizować samochodu.');
    }
}

export async function deleteCar(id: string): Promise<void> {
    try {
        await apiClient.delete(`/cars/${id}`);
    }
    catch (error) {
        throw createServiceError(error, 'Nie udało się usunąć samochodu.');
    }
}

export async function updateCarFeatures(carId: string, featureIds: string[]): Promise<void> {
    try {
        await apiClient.put(`/cars/${carId}/features`, { featureIds });
    }
    catch (error) {
        throw createServiceError(error, 'Nie udało się zaktualizować wyposażenia.');
    }
}

export async function uploadCarPhoto(carId: string, file: File): Promise<CarPhoto> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await apiClient.post<CarPhoto>(
            `/cars/${carId}/photos`, formData,
        );

        return response.data;
    }
    catch (error) {
        throw createServiceError(error, 'Nie udało się wysłać zdjęcia.');
    }
}

export async function deleteCarPhoto(carId: string, photoId: string): Promise<void> {
    try {
        await apiClient.delete(`/cars/${carId}/photos/${photoId}`);
    }
    catch (error) {
        throw createServiceError(error, 'Nie udało się usunąć zdjęcia.');
    }
}
