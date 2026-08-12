import { useState, useRef, useEffect } from 'react';

export default function ExportButton({ filters }) {

    const [isExport, setIsExport] = useState(false);
    const dropdownRef = useRef(null);

    // close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsExport(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExportPdf = () => {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== '')
        );

        const params = new URLSearchParams(cleanFilters).toString();
        window.open(route('report.export.pdf') + '?' + params, '_blank');
        setIsExport(false);
    };

    const handleExportExcel = () => {
        const cleanFilters = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== null && value !== undefined && value !== '')
        );

        const params = new URLSearchParams(cleanFilters).toString();
        window.location.href = route('report.export.excel') + '?' + params;
        setIsExport(false);
    };

    // const handleExportPdf = () => {
    //     const params = new URLSearchParams(filters).toString();
    //     window.open(route('report.export.pdf') + '?' + params, '_blank');
    //     setIsExport(false);
    // };

    // const handleExportExcel = () => {
    //     const params = new URLSearchParams(filters).toString();
    //     window.location.href = route('report.export.excel') + '?' + params;
    //     setIsExport(false);
    // };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                className="bg-blue-500 text-white px-3 py-2 rounded-md cursor-pointer hover:bg-blue-600 flex gap-x-2 items-center"
                onClick={() => setIsExport(!isExport)}
            >
                <img src="/images/icons/export.svg" alt="Export icon" className="object-contain w-4 h-4" />
                <span className='font-semibold'>Export</span>
            </button>

            {isExport && (
                <div className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-lg border border-gray-200 py-1 w-40 z-20">
                    <h1 className="px-3 py-1.5 text-xs font-semibold text-gray-500 uppercase">
                        Export as
                    </h1>
                    <button 
                        onClick={handleExportPdf}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                        PDF
                    </button>
                    <button 
                        onClick={handleExportExcel}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                        Excel
                    </button>
                </div>
            )}
        </div>
    );
}