import { cva } from 'class-variance-authority';
import './button.css'

const buttonVariants = cva(
    'button',
    {
        variants: {
            variant: {
                default: 'primary',
                outline: 'secondary',
                danger: 'danger',
                transparent: 'transparent'
            },
            size: {
                sm: 'sm',
                md: 'md',
                default: 'default',
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
)

function Button({ className, size, variant, ...props }) {

    const buttonClass = buttonVariants({ variant, size, className });

    return (
        <button className={buttonClass} {...props} />
    )
}

export { Button, buttonVariants }