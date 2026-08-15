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
                    ? 'bg-[#DF9BAA] text-white focus:border-indigo-700'
                    : 'border-transparent hover:bg-[#DF9BAA] hover:text-white focus:border-gray-300 focus:text-gray-700 ') +
                className
            }
        >
            
            {children}
        </Link>
    );
}
