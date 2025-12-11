import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from "@tanstack/react-table";
import {
    IconSearch,
    IconFilter,
    IconChevronLeft,
    IconChevronRight,
    IconArrowUp,
    IconArrowDown,
    IconPlus,
    IconDotsVertical,
} from "@tabler/icons-react";
import { useIsMobile } from "@/utils/isMobile";
import { Link, router } from "@inertiajs/react";

const ActionDropdown = ({ actions, row, rowIndex }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const buttonRef = useRef(null);
    const dropdownRef = useRef(null);
    const timeoutRef = useRef(null);
    const isMobile = useIsMobile();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                buttonRef.current &&
                !buttonRef.current.contains(event.target) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        const handleScroll = () => {
            if (isOpen) setIsOpen(false);
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            window.addEventListener("scroll", handleScroll, true); // Capture scroll events
            window.addEventListener("resize", handleScroll);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
            window.removeEventListener("resize", handleScroll);
        };
    }, [isOpen]);

    const updatePosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right + window.scrollX - 192, // 192px is w-48 (12rem)
            });
        }
    };

    const handleMouseEnter = () => {
        if (isMobile) return;
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
        updatePosition();
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        if (isMobile) return;
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 100);
    };

    const toggleOpen = () => {
        if (!isOpen) {
            updatePosition();
        }
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleOpen}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="p-1 rounded-full cursor-pointer hover:bg-gray-100 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
                <IconDotsVertical className="h-5 w-5" />
            </button>

            {isOpen &&
                createPortal(
                    <div
                        ref={dropdownRef}
                        className="absolute z-9999 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1"
                        style={{
                            top: `${position.top}px`,
                            left: `${position.left}px`,
                        }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => {
                                    action.onClick(row.original, rowIndex);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 ${
                                    action.variant === "destructive"
                                        ? "text-red-600 hover:bg-red-50"
                                        : "text-gray-700"
                                } ${action.className || ""}`}
                                disabled={action.disabled?.(row)}
                            >
                                {action.icon && (
                                    <span className="h-4 w-4">
                                        {action.icon}
                                    </span>
                                )}
                                {action.label}
                            </button>
                        ))}
                    </div>,
                    document.body
                )}
        </>
    );
};

const DataTable = ({ data, columns, onAdd, title, actions = [] }) => {
    const [sorting, setSorting] = useState([]);

    // Get search param from URL if exists
    const searchParams = new URLSearchParams(window.location.search);
    const initialSearch = searchParams.get("search") || "";
    const [globalFilter, setGlobalFilter] = useState(initialSearch);

    // Handle server-side pagination detection
    const isServerSide =
        !Array.isArray(data) && data?.data && (data?.links || data?.meta);
    const tableData = isServerSide ? data.data : data;
    const pagination = isServerSide ? data : null;

    // Debounced search for server-side
    useEffect(() => {
        if (isServerSide) {
            const delayDebounceFn = setTimeout(() => {
                if (globalFilter !== initialSearch) {
                    router.get(
                        window.location.pathname,
                        { search: globalFilter },
                        {
                            preserveState: true,
                            preserveScroll: true,
                            replace: true,
                        }
                    );
                }
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        }
    }, [globalFilter, isServerSide]);

    const table = useReactTable({
        data: tableData,
        columns,
        manualFiltering: isServerSide,
        manualPagination: isServerSide,
        pageCount: isServerSide ? data.last_page : undefined,
        state: {
            sorting,
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const isMobile = useIsMobile();

    const rowActions = actions.filter((action) => !action.isAdd);
    const addAction = actions.find((action) => action.isAdd);

    return (
        <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Header / Toolbar */}
            <h3 className="text-lg p-4 font-semibold">{title}</h3>

            <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <IconSearch className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 sm:text-sm transition duration-150 ease-in-out"
                            placeholder="Cari"
                        />
                    </div>
                    <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <IconFilter className="h-4 w-4 mr-2 text-gray-500" />
                        Filter
                    </button>
                </div>

                {addAction && (
                    <button
                        type="button"
                        onClick={addAction.onClick} // Assuming addAction has onClick, or handle it if it's just a link/modal trigger
                        className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue hover:bg-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <IconPlus className="h-4 w-4 mr-2" />
                        {addAction.label || "Tambah"}
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th
                                        key={header.id}
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none group"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <div className="flex items-center gap-1">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                            {header.column.getIsSorted() ===
                                            "asc" ? (
                                                <IconArrowUp className="h-3 w-3 text-gray-400" />
                                            ) : header.column.getIsSorted() ===
                                              "desc" ? (
                                                <IconArrowDown className="h-3 w-3 text-gray-400" />
                                            ) : null}
                                        </div>
                                    </th>
                                ))}

                                {actions.length !== 0 && (
                                    <th
                                        className={`px-6 py-3 items-center flex justify-center text-xs font-semibold tracking-wider text-gray-600 uppercase`}
                                    >
                                        Action
                                    </th>
                                )}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row, index) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                    {rowActions.length > 0 && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-center">
                                                <ActionDropdown
                                                    actions={rowActions}
                                                    row={row}
                                                    rowIndex={index}
                                                />
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan={columns.length + 1}
                                    className="px-6 py-10 text-center text-sm text-gray-500"
                                >
                                    Tidak ada data yang ditemukan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {/* Pagination */}
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                {isServerSide ? (
                    // Server-side Pagination
                    <>
                        <div className="flex-1 flex justify-between sm:hidden">
                            <Link
                                href={pagination.prev_page_url || "#"}
                                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                                    !pagination.prev_page_url
                                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                                        : ""
                                }`}
                            >
                                Previous
                            </Link>
                            <Link
                                href={pagination.next_page_url || "#"}
                                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
                                    !pagination.next_page_url
                                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                                        : ""
                                }`}
                            >
                                Next
                            </Link>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing{" "}
                                    <span className="font-medium">
                                        {pagination.from || 0}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-medium">
                                        {pagination.to || 0}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium">
                                        {pagination.total}
                                    </span>{" "}
                                    results
                                </p>
                            </div>
                            <div>
                                <nav
                                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                    aria-label="Pagination"
                                >
                                    {pagination.links.map((link, i) => (
                                        <Link
                                            key={i}
                                            href={link.url || "#"}
                                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                link.active
                                                    ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                                            } ${
                                                !link.url
                                                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                                                    : ""
                                            } ${
                                                i === 0 ? "rounded-l-md" : ""
                                            } ${
                                                i ===
                                                pagination.links.length - 1
                                                    ? "rounded-r-md"
                                                    : ""
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </>
                ) : (
                    // Client-side Pagination (Existing)
                    <>
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    <span className="font-medium">
                                        {table.getState().pagination.pageIndex *
                                            table.getState().pagination
                                                .pageSize +
                                            1}
                                    </span>{" "}
                                    -{" "}
                                    <span className="font-medium">
                                        {Math.min(
                                            (table.getState().pagination
                                                .pageIndex +
                                                1) *
                                                table.getState().pagination
                                                    .pageSize,
                                            table.getFilteredRowModel().rows
                                                .length
                                        )}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-medium">
                                        {
                                            table.getFilteredRowModel().rows
                                                .length
                                        }
                                    </span>{" "}
                                    items
                                </p>
                            </div>
                            <div>
                                <nav
                                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                    aria-label="Pagination"
                                >
                                    <button
                                        onClick={() => table.previousPage()}
                                        disabled={!table.getCanPreviousPage()}
                                        className="relative cursor-pointer inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">
                                            Previous
                                        </span>
                                        <IconChevronLeft
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </button>
                                    <button
                                        onClick={() => table.nextPage()}
                                        disabled={!table.getCanNextPage()}
                                        className="relative cursor-pointer inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="sr-only">Next</span>
                                        <IconChevronRight
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DataTable;
