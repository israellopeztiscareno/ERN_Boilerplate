// Dependencias
import React, { useEffect } from "react";
import {
  useReactTable,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

function App({ defaultColumns, defaultData }) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columns] = React.useState(() => [...defaultColumns]);

  const [data, setData] = React.useState(defaultData);

  useEffect(() => {
    setData(defaultData);
  }, [defaultData]);

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return (
    <>
      <DebouncedInput
        value={globalFilter ?? ""}
        onChange={(value) => setGlobalFilter(String(value))}
      />
      <div className="table-responsive small">
        <table className="table table-striped table-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th scope="col" key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            {...{
                              className: header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : "",
                              onClick: header.column.getToggleSortingHandler(),
                            }}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {{
                              asc: (
                                <>
                                  &nbsp;
                                  <i className="bi bi-caret-up-fill" />
                                </>
                              ),
                              desc: (
                                <>
                                  &nbsp;
                                  <i className="bi bi-caret-down-fill" />
                                </>
                              ),
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <nav aria-label="Page table navigation">
        <ul className="pagination justify-content-end">
          <li
            className={`page-item${
              !table.getCanPreviousPage() ? " disabled" : ""
            }`}
          >
            <a className="page-link" onClick={() => table.setPageIndex(0)}>
              Previous
            </a>
          </li>
          <li
            className={`page-item${
              !table.getCanPreviousPage() ? " disabled" : ""
            }`}
          >
            <a
              className="page-link"
              onClick={() => table.previousPage()}
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          <li
            className={`page-item${!table.getCanNextPage() ? " disabled" : ""}`}
          >
            <a
              className="page-link"
              onClick={() => table.nextPage()}
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
          <li
            className={`page-item${!table.getCanNextPage() ? " disabled" : ""}`}
          >
            <a
              className="page-link"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

// Componente input (Buscar)
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <div className="d-flex justify-content-end flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <div className="d-flex gap-3">
        <div className="input-group input-group-sm d-flex align-items-center">
          <span className="input-group-text" id="basic-addon1">
            <i className="bi-search"></i>
          </span>
          <input
            {...props}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            type="text"
            className="form-control form-control-sm"
            placeholder="Buscar"
            aria-label="Buscar"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
