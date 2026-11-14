import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import { forgotPassword } from '../services/authService';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            setIsSubmitting(true);
            await forgotPassword(email);
            setIsSent(true);
            toast.success('Jeśli e-mail istnieje w bazie, wysłano na niego link do resetu hasła.');
        } catch (error) {
            toast.error('Wystąpił błąd podczas próby wysłania linku.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="page-container auth-container">
            <h1 className="page-title text-center">Odzyskaj hasło</h1>
            
            <form className="auth-form" onSubmit={handleSubmit}>
                {!isSent ? (
                    <>
                        <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem' }}>
                            Wprowadź adres e-mail powiązany z Twoim kontem. Prześlemy Ci link do zresetowania hasła.
                        </p>
                        <div className="form-group-vertical">
                            <label htmlFor="email">E-mail</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                className="form-control"
                                required
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            className="btn btn-primary auth-submit-btn" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Wysyłanie...' : 'Wyślij link'}
                        </button>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                        <h3 style={{ color: '#22c55e', marginBottom: '1rem' }}>Wiadomość wysłana!</h3>
                        <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            Sprawdź swoją skrzynkę odbiorczą (oraz folder SPAM).
                        </p>
                    </div>
                )}
                
                <div className="auth-links">
                    <span className="auth-text">
                        Wróć do <Link to="/login" className="auth-link bold">Logowania</Link>
                    </span>
                </div>
            </form>
        </section>
    );
}
