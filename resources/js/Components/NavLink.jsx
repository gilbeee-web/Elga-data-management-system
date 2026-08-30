import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    icon,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'flex gap-x-2 items-center text-md p-3 font-semibold leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'font-bold'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900') +
                className
            }
        >
            
            {children}
        </Link>
    );
}
