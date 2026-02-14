import React, { useMemo, useState, Fragment } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    IconChevronLeft,
    IconChevronRight,
    IconSelector,
    IconChevronUp,
    IconChevronDown,
    IconSearch,
    IconDots,
    IconTrash,
    IconArrowBackUp,
    IconX,
    IconDotsVertical,
    IconDownload,
    IconFileSpreadsheet,
    IconFileTypePdf,
    IconPrinter,
} from "@tabler/icons-react";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Table, THead, TBody, Tr, Th, Td } from "@/components/ui/Table";
import Button from "@/components/common/Button";

const TableSortIcon = ({ sorted }) => {
    if (sorted === "asc")
        return <IconChevronUp size={14} className="text-primary" />;
    if (sorted === "desc")
        return <IconChevronDown size={14} className="text-primary" />;
    return <IconSelector size={14} className="text-muted opacity-30" />;
};

const IndeterminateCheckbox = ({ indeterminate, className, ...rest }) => {
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (typeof indeterminate === "boolean") {
            ref.current.indeterminate = !rest.checked && indeterminate;
        }
    }, [ref, indeterminate, rest.checked]);

    return (
        <input
            type="checkbox"
            ref={ref}
            className={clsx(
                "size-5 rounded-md border-2 border-slate-200 bg-white cursor-pointer transition-all",
                "checked:bg-orange-600 checked:border-orange-600",
                "focus:ring-orange-600/20",
                className,
            )}
            {...rest}
        />
    );
};

const AdvancedDataTable = ({
    columns,
    data,
    isLoading,
    emptyMessage = "No data found",
    showSearch = true,
    pagination = true,
    onBulkDelete,
}) => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
            sorting,
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const selectedRows = table.getSelectedRowModel().rows;
    const selectedCount = selectedRows.length;

    return (
        <div className="space-y-4">
            {/* Toolbar Top */}
            <div className="flex items-center justify-between gap-4 px-1">
                <div className="flex-1">
                    {showSearch && (
                        <div className="relative max-w-sm">
                            <input
                                type="text"
                                value={globalFilter ?? ""}
                                onChange={(e) =>
                                    setGlobalFilter(e.target.value)
                                }
                                placeholder="Search subscriptions..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all shadow-sm"
                            />
                            <IconSearch
                                size={16}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-200 text-slate-500 transition-all bg-white shadow-sm">
                        <IconDownload size={20} />
                    </button>
                    <button className="p-2.5 rounded-xl hover:bg-slate-50 border border-slate-200 text-slate-500 transition-all bg-white shadow-sm">
                        <IconDotsVertical size={20} />
                    </button>
                </div>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden relative">
                {/* Selection Toolbar (Internal) */}
                {selectedCount > 0 && (
                    <div className="absolute top-0 left-0 right-0 z-20 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="bg-[#1e293b] px-6 py-1 flex items-center justify-between text-white">
                            <div className="flex items-center gap-4">
                                <span className="text-[11px] font-black uppercase tracking-[0.15em] text-white/90">
                                    {selectedCount} Selected from {data.length}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 h-9">
                                <button
                                    onClick={() =>
                                        onBulkDelete &&
                                        onBulkDelete(selectedRows)
                                    }
                                    className="flex items-center h-7 w-auto gap-2 px-6 py-2 bg-[#f05228] hover:bg-[#d9441e] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-orange-950/20"
                                >
                                    <IconTrash size={16} />
                                    Delete
                                </button>
                                <button
                                    onClick={() => table.resetRowSelection()}
                                    className="flex items-center h-7 w-auto gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all border border-white/10"
                                >
                                    <IconArrowBackUp size={16} />
                                    Cancel
                                </button>

                                <Menu
                                    as="div"
                                    className="relative inline-block text-left"
                                >
                                    <Menu.Button as="div">
                                        <button className="flex h-7 w-auto items-center gap-2 px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all border border-white/10">
                                            <IconDots size={18} />
                                            <span>More</span>
                                        </button>
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 top-full mt-2 w-48 origin-top-right bg-white text-slate-900 border border-slate-200 rounded-xl shadow-2xl focus:outline-none divide-y divide-slate-100 overflow-hidden z-50">
                                            <div className="px-1 py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            className={clsx(
                                                                "group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors",
                                                                active
                                                                    ? "bg-slate-50 text-orange-600"
                                                                    : "text-slate-600",
                                                            )}
                                                        >
                                                            <IconFileSpreadsheet
                                                                size={16}
                                                            />{" "}
                                                            Export CSV
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            className={clsx(
                                                                "group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-black uppercase tracking-widest transition-colors",
                                                                active
                                                                    ? "bg-slate-50 text-orange-600"
                                                                    : "text-slate-600",
                                                            )}
                                                        >
                                                            <IconFileTypePdf
                                                                size={16}
                                                            />{" "}
                                                            Export PDF
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            </div>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <Table className="w-full">
                        <THead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <Tr
                                    key={headerGroup.id}
                                    className="border-b border-slate-100 bg-slate-50/50"
                                >
                                    <Th className="w-14 px-6 py-3.5">
                                        <div className="flex items-center justify-center">
                                            <IndeterminateCheckbox
                                                {...{
                                                    checked:
                                                        table.getIsAllRowsSelected(),
                                                    indeterminate:
                                                        table.getIsSomeRowsSelected(),
                                                    onChange:
                                                        table.getToggleAllRowsSelectedHandler(),
                                                }}
                                            />
                                        </div>
                                    </Th>

                                    {headerGroup.headers.map((header) => (
                                        <Th
                                            key={header.id}
                                            className="px-6 py-3.5 font-black text-[10px] uppercase tracking-[0.15em] text-slate-400 opacity-80"
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={clsx(
                                                        "flex items-center gap-2",
                                                        header.column.getCanSort() &&
                                                            "cursor-pointer select-none",
                                                    )}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext(),
                                                    )}
                                                    {header.column.getCanSort() && (
                                                        <TableSortIcon
                                                            sorted={header.column.getIsSorted()}
                                                        />
                                                    )}
                                                </div>
                                            )}
                                        </Th>
                                    ))}
                                </Tr>
                            ))}
                        </THead>
                        <TBody>
                            {isLoading ? (
                                Array(5)
                                    .fill(0)
                                    .map((_, idx) => (
                                        <Tr key={idx}>
                                            <Td className="px-6 py-6 w-14 border-r border-slate-100">
                                                <div className="size-5 bg-slate-100 animate-pulse rounded mx-auto" />
                                            </Td>
                                            {columns.map((_, colIdx) => (
                                                <Td
                                                    key={colIdx}
                                                    className="px-6 py-6"
                                                >
                                                    <div className="h-4 bg-slate-50 animate-pulse rounded-full w-full max-w-[120px]" />
                                                </Td>
                                            ))}
                                        </Tr>
                                    ))
                            ) : table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <Tr
                                        key={row.id}
                                        className={clsx(
                                            "border-b border-slate-100 last:border-0 transition-all duration-150 group relative",
                                            row.getIsSelected()
                                                ? "bg-[#fffaf0]"
                                                : "hover:bg-slate-50/50",
                                        )}
                                    >
                                        <Td className="px-6 py-5 w-14 relative">
                                            {row.getIsSelected() && (
                                                <div className="absolute inset-y-0 left-0 w-1.5 bg-orange-500 z-10" />
                                            )}
                                            <div className="flex items-center justify-center">
                                                <IndeterminateCheckbox
                                                    {...{
                                                        checked:
                                                            row.getIsSelected(),
                                                        disabled:
                                                            !row.getCanSelect(),
                                                        indeterminate:
                                                            row.getIsSomeSelected(),
                                                        onChange:
                                                            row.getToggleSelectedHandler(),
                                                    }}
                                                />
                                            </div>
                                        </Td>

                                        {row.getVisibleCells().map((cell) => (
                                            <Td
                                                key={cell.id}
                                                className="px-6 py-5 text-slate-700 font-medium"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </Td>
                                        ))}
                                    </Tr>
                                ))
                            ) : (
                                <Tr>
                                    <Td
                                        colSpan={columns.length + 1}
                                        className="py-32 text-center text-slate-400"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <IconX size={40} stroke={1.5} />
                                            <span className="text-sm font-semibold">
                                                {emptyMessage}
                                            </span>
                                        </div>
                                    </Td>
                                </Tr>
                            )}
                        </TBody>
                    </Table>
                </div>

                {/* Pagination */}
                {pagination && table.getPageCount() > 0 && (
                    <div className="px-8 py-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between bg-white gap-4">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            Showing{" "}
                            {table.getState().pagination.pageIndex *
                                table.getState().pagination.pageSize +
                                1}{" "}
                            -{" "}
                            {Math.min(
                                (table.getState().pagination.pageIndex + 1) *
                                    table.getState().pagination.pageSize,
                                data.length,
                            )}{" "}
                            of {data.length} entries
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
                            >
                                <IconChevronLeft size={20} />
                            </button>
                            <div className="flex items-center gap-1">
                                <button className="w-10 h-10 rounded-lg text-sm font-bold bg-orange-600 text-white shadow-lg shadow-orange-600/20">
                                    {table.getState().pagination.pageIndex + 1}
                                </button>
                            </div>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-30 transition-all"
                            >
                                <IconChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvancedDataTable;
