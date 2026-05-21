import './bootstrap';


import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx')

        console.log(pages)
        console.log(name)

        return pages[`./Pages/${name}.jsx`]()
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />)
    },
})