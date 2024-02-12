import { z } from 'zod';

export const registerSchema = z.object({
    username: z.string({
        required_error: 'El nombre de usuario es requerido'
    }).min(6, {
        message: 'El nombre de usuario debe contener 6 o más caracteres'
    }).max(16, {
        message: 'El nombre de usuario debe contener 16 o menos caracteres'
    }),
    password: z.string({
        required_error: 'La contraseña es requerida'
    }).min(8, {
        message: 'La contraseña debe contener 8 o más caracteres'
    }).max(23, {
        message: 'La contraseña debe contener 23 o menos caracteres'
    }),
    passwordConfirmation: z.string({
        required_error: 'La confirmación de la contraseña es requerida'
    }),
}).refine(data => data.password === data.passwordConfirmation, {
    message: 'Las contraseñas no coinciden',
    path: ['passwordConfirmation']
});

export const loginSchema = z.object({
    username: z.string({
        required_error: 'El nombre de usuario es requerido'
    }),
    password: z.string({
        required_error: 'La contraseña es requerida'
    })
});