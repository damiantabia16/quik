import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/header/Header';

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
    <div className='w-full h-full m-auto'>
        <div className='flex flex-col items-center justify-center h-screen m-auto'>
            <div className={`fixed bottom-0 left-0 p-[20px] mx-[10px] mb-[10px] bg-transparent border border-[#98ff98] rounded-md transition-transform duration-100 ${authError.length > 0 ? 'translate-x-0 visible' : '-translate-x-full invisible'}`}>
            {authError.map((error, index) => (
                <div key={index} className='flex top-0 right-0 text-[14px]'>
                {error}
                </div>
            ))}
            </div>
            <form
            className='flex flex-col p-[20px] rounded-md border border-[#c0c0c0] w-[350px] h-auto'
            onSubmit={onSubmit}>
                <div className='my-[15px]'>
                    <h1 className='text-4xl font-bold text-center'>Registrate</h1>
                </div>
                <div className='my-[15px]'>
                    <div className='my-[3px]'>
                        <label htmlFor="username">Nombre de usuario:</label>
                    </div>
                    <input id='username' className='w-full rounded outline-none px-[5px] py-[4px] bg-[#202520] text-[14px]' type="text" autoComplete='off' {...register('username', {required: true})} />
                    {errors.username && (
                        <p className='text-[13px] text-[#ff3333] my-[3px]'>
                            El nombre de usuario es requerido
                        </p>
                    )}
                </div>
                <div className='my-[15px]'>
                    <div className='my-[3px]'>
                        <label htmlFor="password">Contraseña:</label>
                    </div>
                    <input id='password' className='w-full rounded outline-none px-[5px] py-[4px] bg-[#202520] text-[14px]' placeholder='Entre 8 y 23 caracteres' type="password" {...register('password', {required: true})} />
                    {errors.password && (
                        <p className='text-[13px] text-[#ff3333] my-[3px]'>
                            La contraseña es requerida
                        </p>
                    )}
                </div>
                <div className='my-[15px]'>
                    <div className='my-[3px]'>
                        <label htmlFor="passwordConfirmation">Confirmar contraseña:</label>
                    </div>
                    <input id='passwordConfirmation' className='w-full rounded outline-none px-[5px] py-[4px] bg-[#202520] text-[14px]' placeholder='Repita su contraseña' type="password" {...register('passwordConfirmation', {required: true})} />
                    {errors.passwordConfirmation && (
                        <p className='text-[13px] text-[#ff3333] my-[3px]'>
                            Debes confirmar la contraseña
                        </p>
                    )}
                </div>
                <div>
                    <span className='text-[14px]'>
                        ¿Ya tienes una cuenta? <Link to='/ingresar' className='text-[#98ff98] underline'>Inicia sesión</Link>
                    </span>
                </div>
                <div className='flex items-center justify-center my-auto py-[20px]'>
                    <button type='submit' className='bg-[#98ff98] text-[#202520] rounded px-[10px] py-[6px] w-full font-medium transition duration-150 hover:bg-[#b8ffb8]'>CREAR CUENTA</button>
                </div>
            </form>
        </div>
    </div>
    </>
  )
};

export default Register