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
                    ? 'bg-[#F2CDD5] text-gray-900 focus:border-indigo-700 text-white '
                    : 'border-transparent hover:bg-[#DF9BAA] hover:text-white focus:border-gray-300 focus:text-gray-700 ') +
                className
            }
        >
            <img 
                src={icon} 
                alt="icon" 
                className={
                    'object-contain w-5 h-5 ' +
                    (active ? 'invert' : '') +
                    className
                }
            />

            {children}
        </Link>
    );
}
