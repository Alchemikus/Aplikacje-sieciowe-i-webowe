import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { register } from '../services/authService';

export default function RegisterPage() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            setIsSubmitting(true);
            await register({ email, userName, password });
            toast.success('Konto zostało utworzone! Na Twój adres e-mail został wysłany link do potwierdzenia rejestracji.');
            navigate('/login');
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error('Rejestracja nie powiodła się.');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="page-container auth-container">
            <h1 className="page-title text-center">Rejestracja</h1>
            
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group-vertical">
                    <label htmlFor="userName">Nazwa użytkownika</label>
                    <input
                        id="userName"
                        type="text"
                        value={userName}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setUserName(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>

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
                
                <div className="form-group-vertical">
                    <label htmlFor="password">Hasło (min. 8 znaków, duża i mała litera, cyfra)</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
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
                    {isSubmitting ? 'Wysyłanie...' : 'Załóż konto'}
                </button>
                
                <div className="auth-links">
                    <span className="auth-text">
                        Masz już konto? <Link to="/login" className="auth-link bold">Zaloguj się</Link>
                    </span>
                </div>
            </form>
        </section>
    );
}
