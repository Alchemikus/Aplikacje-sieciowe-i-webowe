import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import toast from 'react-hot-toast';
import { login } from '../services/authService';
import { useAuthStore } from '../store/useAuthStore';

export default function LoginPage() {
    const navigate = useNavigate();
    const setUser = useAuthStore((state) => state.setUser);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
        setEmail(event.target.value);
    }

    function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
        setPassword(event.target.value);
    }

    async function handleSubmit(event: SyntheticEvent<HTMLFormElement>) {
        event.preventDefault();
        try {
            setIsSubmitting(true);
            const user = await login({
                email,
                password
            });
            setUser(user);
            navigate('/cars');
        }
        catch (caughtError) {
            if (caughtError instanceof Error) {
                toast.error(caughtError.message);
            }
            else {
                toast.error('Nie udało się zalogować.');
            }
        }
        finally {
            setIsSubmitting(false);
        }
    }
    
    return (
        <section className="page-container auth-container">
            <h1 className="page-title text-center">Logowanie</h1>
            
            <form className="auth-form" onSubmit={handleSubmit}>
                <div className="form-group-vertical">
                    <label htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        className="form-control"
                        required
                    />
                </div>
                
                <div className="form-group-vertical">
                    <label htmlFor="password">Hasło</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="form-control"
                        required
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="btn btn-primary auth-submit-btn" 
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Logowanie...' : 'Zaloguj'}
                </button>
                
                <div className="auth-links">
                    <Link to="/forgot-password" className="auth-link">
                        Nie pamiętasz hasła?
                    </Link>
                    <span className="auth-text">
                        Nie masz konta? <Link to="/register" className="auth-link bold">Zarejestruj się</Link>
                    </span>
                </div>
            </form>
        </section>
    );
}