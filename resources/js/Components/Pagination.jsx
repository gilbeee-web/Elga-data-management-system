import { router } from "@inertiajs/react";
import { ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function Pagination({ data, name }) {
    if (!data || data.data.length === 0) {
        return null;
    }

    return (
        <div className="flex justify-between items-center my-8 text-sm text-gray-600">

            <span>
                Showing {data.from ?? 0}–{data.to ?? 0} of {data.total} {name}
            </span>

            <div className="flex gap-1">

                {/* Previous */}
                <button
                    disabled={!data.prev_page_url}
                    onClick={() =>
                        data.prev_page_url &&
                        router.get(
                            data.prev_page_url,
                            {},
                            {
                                preserveState: true,
                                preserveScroll: true,
                            }
                        )
                    }
                    className={`px-3 py-1 rounded flex gap-x-1 ${
                        data.prev_page_url
                            ? "bg-gray-100 hover:bg-gray-200 cursor-pointer"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    
                    <ChevronsLeft size={20}/>
                    <span>Previous</span>
                </button>

                {/* Page Numbers */}
                {Array.from(
                    { length: Math.min(data.last_page, 5) },
                    (_, i) => i + 1
                ).map((page) => (
                    <button
                        key={page}
                        onClick={() =>
                            router.get(
                                data.path,
                                { page },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                }
                            )
                        }
                        className={`px-3 py-1 rounded cursor-pointer ${
                            page === data.current_page
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 hover:bg-gray-200"
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Ellipsis + Last Page */}
                {data.last_page > 5 && (
                    <>
                        <span className="px-2 py-1">
                            ...
                        </span>

                        <button
                            onClick={() =>
                                router.get(
                                    data.path,
                                    { page: data.last_page },
                                    {
                                        preserveState: true,
                                        preserveScroll: true,
                                    }
                                )
                            }
                            className={`px-3 py-1 rounded cursor-pointer ${
                                data.current_page === data.last_page
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-300 hover:bg-gray-200"
                            }`}
                        >
                            {data.last_page}
                        </button>
                    </>
                )}

                {/* Next */}
                <button
                    disabled={!data.next_page_url}
                    onClick={() =>
                        data.next_page_url &&
                        router.get(
                            data.next_page_url,
                            {},
                            {
                                preserveState: true,
                                preserveScroll: true,
                            }
                        )
                    }
                    className={`px-3 py-1 rounded flex gap-x-1 ${
                        data.next_page_url
                            ? "bg-gray-300 hover:bg-gray-200 cursor-pointer"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                >
                    <span>Next</span>
                    <ChevronsRight size={20}/>
                    
                </button>

            </div>
        </div>
    );
}