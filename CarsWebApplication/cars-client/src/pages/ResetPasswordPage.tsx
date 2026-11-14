import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import toast from 'react-hot-toast';
import { resetPassword } from '../services/authService';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const token = searchParams.get('token');
    
    const [newPassword, setNewPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setNewPassword(event.target.value);
    }

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        
        if (!email || !token) {
            return;
        }
        
        try {
            setIsSubmitting(true);
            const result = await resetPassword(email, token, newPassword);
            toast.success(result);
        } catch (caughtError) {
            if (caughtError instanceof Error) {
                toast.error(caughtError.message);
            }
            else {
                toast.error('Nie udało się zmienić hasła.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!email || !token) {
        return (
            <section className="page-container auth-container">
                <div className="auth-form text-center">
                    <h1 className="page-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>Nieprawidłowy link</h1>
                    <p style={{ marginBottom: '2rem' }}>Link do zmiany hasła jest niekompletny lub uszkodzony.</p>
                    <Link to="/login" className="btn btn-primary">Wróć do logowania</Link>
                </div>
            </section>
        );
    }

    return (
        <section className="page-container auth-container">
            <h1 className="page-title text-center">Ustaw nowe hasło</h1>
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group-vertical">
                    <label htmlFor="newPassword">Nowe hasło (min. 8 znaków, duża i mała litera, cyfra)</label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={handlePasswordChange}
                        className="form-control"
                        required
                        minLength={8}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Hasło musi mieć co najmniej 8 znaków i zawierać przynajmniej jedną cyfrę, jedną małą i jedną dużą literę."
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="btn btn-primary auth-submit-btn" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Zapisywanie...' : 'Zmień hasło'}
                </button>
            </form>
        </section>
    );
}