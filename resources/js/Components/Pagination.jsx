import { router } from "@inertiajs/react";

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
                {data.prev_page_url && (
                    <button
                        onClick={() =>
                            router.get(
                                data.prev_page_url,
                                {},
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                }
                            )
                        }
                        className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
                    >
                        Previous
                    </button>
                )}

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
                {data.next_page_url && (
                    <button
                        onClick={() =>
                            router.get(
                                data.next_page_url,
                                {},
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                }
                            )
                        }
                        className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-200 cursor-pointer"
                    >
                        Next
                    </button>
                )}

            </div>
        </div>
    );
}