import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/header/Header';
import { Button } from '../components/ui/button/Button';
import './register-login.css';

function Login() {

  const { register, handleSubmit, formState: { errors } } = useForm();
  const { signIn, errors: authError, isAuth } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth) {
      navigate('/')
    }
  }, [isAuth])

  const onSubmit = (data) => {
    signIn(data);
  }

  return (
    <>
      <Header />
      <div className='register-login-box-container'>
        <div className='register-login-box'>
          <div className={`auth-error ${authError.length > 0 ? 'slide-in' : ''}`}>
            {Array.isArray(authError) && authError.map((error, index) => (
              <div key={index} className='auth-error-message'>
                {error}
              </div>
            ))}
          </div>
          <form
            className='register-login-form'
            onSubmit={handleSubmit(onSubmit)}>
            <div className='register-login-title'>
              <h1>Inicia sesión</h1>
            </div>
            <div className='register-login-input'>
              <div className='my-[3px]'>
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
                type="password"
                autoComplete='off'
                {...register('password', { required: true })} />
              {errors.password && (
                <p className='register-login-error'>
                  La contraseña es requerida
                </p>
              )}
            </div>
            <div className='go-to-login'>
              <span>
                ¿No tienes una cuenta?{' '}
                <Link to='/registrarse'>Crea una</Link>
              </span>
            </div>
            <Button className='register-login-submit-button'>INGRESAR</Button>
          </form>
        </div>
      </div>
    </>
  )
};

export default Login