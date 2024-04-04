import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/header/Header';
import { Button } from '../components/ui/button/Button';
import './register-login.css';

function Register() {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signUp, isAuth, errors: authError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuth) {
            navigate('/')
        }
    }, [isAuth])

    const onSubmit = handleSubmit(async (values) => {
        signUp(values);
    });

    return (
        <>
            <Header />
            <div className='register-login-box-container'>
                <div className='register-login-box'>
                    <div className={`auth-error ${authError.length > 0 ? 'slide-in' : ''}`}>
                        {authError.map((error, index) => (
                            <div key={index} className='auth-error-message'>
                                {error}
                            </div>
                        ))}
                    </div>
                    <form
                        className='register-login-form'
                        onSubmit={onSubmit}>
                        <div className='register-login-title'>
                            <h1>Registrate</h1>
                        </div>
                        <div className='register-login-input'>
                            <div className='register-login-input-label'>
                                <label htmlFor="username">Nombre de usuario:</label>
                            </div>
                            <input
                                id='username'
                                type="text"
                                autoComplete='off'
                                {...register('username', { required: true })} />
                            {errors.username && (
                                <p className='register-login-error'>
                                    El nombre de usuario es requerido
                                </p>
                            )}
                        </div>
                        <div className='register-login-input'>
                            <div className='register-login-input-label'>
                                <label htmlFor="password">Contraseña:</label>
                            </div>
                            <input
                                id='password'
                                placeholder='Entre 8 y 23 caracteres'
                                type="password"
                                autoComplete='off'
                                {...register('password', { required: true })} />
                            {errors.password && (
                                <p className='register-login-error'>
                                    La contraseña es requerida
                                </p>
                            )}
                        </div>
                        <div className='register-login-input'>
                            <div className='register-login-input-label'>
                                <label htmlFor="passwordConfirmation">Confirmar contraseña:</label>
                            </div>
                            <input
                                id='passwordConfirmation'
                                placeholder='Repita su contraseña'
                                type="password"
                                autoComplete='off'
                                {...register('passwordConfirmation', { required: true })} />
                            {errors.passwordConfirmation && (
                                <p className='register-login-error'>
                                    Debes confirmar la contraseña
                                </p>
                            )}
                        </div>
                        <div className='go-to-login'>
                            <span>
                                ¿Ya tienes una cuenta?{' '}
                                <Link to='/ingresar'>Inicia sesión</Link>
                            </span>
                        </div>
                        <Button className='register-login-submit-button'>CREAR CUENTA</Button>
                    </form>
                </div>
            </div>
        </>
    )
};

export default Register