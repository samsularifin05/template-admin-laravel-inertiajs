import React from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
/**
 * @param {Object} props
 * @param {Array<Object>} props.columns
 * @param {Array<Object>} props.data
 * @param {Object} props.pagination
 * @param {Function} props.onPageChange
 * @param {boolean} props.isLoading
 * @param {string} props.emptyMessage
 */
const DataTable = ({
    columns,
    data,
    pagination,
    onPageChange,
    isLoading,
    emptyMessage = "No data found",
}) => {
    // Helper to render cell content (supports values or render functions)
    const renderCell = (item, column) => {
        if (column.render) {
            return column.render(item);
        }

        const value = column.key
            ?.split(".")
            .reduce((obj, key) => obj?.[key], item);
        return value || "-";
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-theme-50/50 text-gray-600 font-semibold text-sm uppercase tracking-wider">
                        <tr>
                            {columns.map((col, idx) => (
                                <th
                                    key={idx}
                                    className={`p-4 ${col.className || ""}`}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            Array(5)
                                .fill(0)
                                .map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        {columns.map((_, colIdx) => (
                                            <td key={colIdx} className="p-4">
                                                <div className="h-4 bg-gray-100 rounded w-full"></div>
                                            </td>
                                        ))}
                                    </tr>
                                ))
                        ) : data.length > 0 ? (
                            data.map((item, rowIndex) => (
                                <tr
                                    key={item.id || rowIndex}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {columns.map((col, colIdx) => (
                                        <td
                                            key={colIdx}
                                            className={`p-4 ${
                                                col.className || ""
                                            }`}
                                        >
                                            {renderCell(item, col)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="p-10 text-center text-gray-400"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {!isLoading && pagination && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing{" "}
                        <span className="font-medium">
                            {pagination.from || 0}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium">
                            {pagination.to || 0}
                        </span>{" "}
                        of{" "}
                        <span className="font-medium">{pagination.total}</span>{" "}
                        results
                    </div>
                    <div className="flex gap-2">
                        {pagination.links?.map((link, idx) => {
                            // Simple Previous/Next + Numbers rendering
                            // Or just simple Prev/Next buttons if links structure is complex
                            // Laravel pagination links usually come as array of objects { url, label, active }

                            // Let's filter for just Prev/Next for simplicity or render all
                            // If it's a number, render simplified

                            // Handling "Previous" and "Next" labels which might contain HTML entities
                            const label =
                                link.label
                                    .replace("&laquo; Previous", "")
                                    .replace("Next &raquo;", "")
                                    .trim() ||
                                (link.label.includes("Previous") ? "<" : ">");
                            const isPrev = link.label.includes("Previous");
                            const isNext = link.label.includes("Next");

                            if (!link.url && !link.active) return null; // Spacer dots?

                            return (
                                <button
                                    key={idx}
                                    onClick={() => requestPage(link.url)}
                                    disabled={!link.url}
                                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                        link.active
                                            ? "bg-theme-500 text-white"
                                            : !link.url
                                              ? "text-gray-300 cursor-not-allowed"
                                              : "text-gray-600 hover:bg-gray-100 border border-gray-200"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Custom Pagination if pagination object is simple (current_page, last_page) */}
            {!isLoading && pagination && !pagination.links && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Page {pagination.current_page} of {pagination.last_page}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() =>
                                onPageChange(pagination.current_page - 1)
                            }
                            disabled={pagination.current_page === 1}
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <IconChevronLeft size={16} />
                        </button>
                        <button
                            onClick={() =>
                                onPageChange(pagination.current_page + 1)
                            }
                            disabled={
                                pagination.current_page === pagination.last_page
                            }
                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <IconChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    function requestPage(url) {
        if (!url) return;
        const urlObj = new URL(url);
        const page = urlObj.searchParams.get("page");
        if (page) onPageChange(page);
    }
};

export default DataTable;
