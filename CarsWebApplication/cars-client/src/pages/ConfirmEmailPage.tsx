import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import toast from 'react-hot-toast';
import { confirmEmail } from '../services/authService';

export default function ConfirmEmailPage() {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');
    
    const [message, setMessage] = useState('Potwierdzanie konta...');

    useEffect(() => {
        if (!userId || !token) {
            return;
        }

        async function confirm() {
            try {
                const result = await confirmEmail(userId!, token!);
                setMessage(result);
                toast.success('Konto zostało potwierdzone pomyślnie!');
            } catch (error) {
                setMessage('Nie udało się potwierdzić konta.');
                toast.error('Wystąpił błąd podczas potwierdzania konta.');
            }
        }

        confirm();
    }, [userId, token]);

    if (!userId || !token) {
        return (
            <section className="page-container auth-container">
                <div className="auth-form text-center">
                    <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Nieprawidłowy link</h1>
                    <p style={{ marginBottom: '2rem' }}>Brakuje parametrów wymaganych do weryfikacji.</p>
                    <Link to="/login" className="btn btn-primary">Przejdź do logowania</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="page-container auth-container">
            <div className="auth-form text-center">
                <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Potwierdzenie konta</h1>
                <p style={{ marginBottom: '2rem', color: 'var(--text)' }}>{message}</p>
                <Link to="/login" className="btn btn-primary">Przejdź do logowania</Link>
            </div>
        </section>
    );
}