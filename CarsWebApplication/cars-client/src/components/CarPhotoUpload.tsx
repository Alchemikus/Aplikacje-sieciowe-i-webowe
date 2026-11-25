import { useRef, useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { uploadCarPhoto } from '../services/carService';
import { queryKeys } from '../queries/queryKeys';

interface CarPhotoUploadProps {
  carId: string;
}

export default function CarPhotoUpload({ carId }: CarPhotoUploadProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const uploadMutation = useMutation({
    mutationFn: (selectedFile: File) => uploadCarPhoto(carId, selectedFile),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.car(carId),
      });
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      toast.success('Zdjęcie zostało dodane!');
    },
    onError: (err) => {
      toast.error(err.message || 'Nie udało się wysłać zdjęcia.');
    },
  });

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setFile(selectedFile);
  };

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    uploadMutation.mutate(file);
  };

  return (
    <form className="photo-upload-form" onSubmit={handleSubmit}>
      <h3>Dodaj zdjęcie</h3>
      <div className="form-group">
        <input
          ref={fileInputRef}
          className="form-control"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
        />
      </div>
      <button
        type="submit"
        className="btn btn-green"
        disabled={!file || uploadMutation.isPending}
      >
        {uploadMutation.isPending ? 'Wysyłanie...' : 'Wyślij zdjęcie'}
      </button>
    </form>
  );
}
