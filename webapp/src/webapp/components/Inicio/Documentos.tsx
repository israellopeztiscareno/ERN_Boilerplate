// Dependencias
import React from "react";
import { useSelector } from "react-redux";
import { ColumnDef } from "@tanstack/react-table";

// Componentes
import Table from "../common/Table";

export type Documentos = {
  documentId: string;
  uploadDate: string;
  title: string;
  description: string;
  tags?: Array<string>;
  sharedWithAccountant?: boolean;
};

interface Props {
  handleSelectTab: (tab: number) => void;
  handleDownload: (documentId: string) => void;
}

const Documentos = ({ handleSelectTab, handleDownload }: Props) => {
  //@ts-ignore
  const user = useSelector((state) => state.user);
  //@ts-ignore
  const { documents } = useSelector((state) => state.documents);

  const columns: ColumnDef<Documentos>[] = [
    {
      header: "Name",
      accessorKey: "title",
      cell: (info) => {
        const { documentId } = info.row.original;
        const val = info.getValue() as string;

        return (
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleDownload(documentId);
            }}
          >
            {/* @ts-ignore */}
            {val}
          </a>
        );
      },
    },
    {
      header: "Date",
      accessorKey: "uploadDate",
      cell: (info) => info.getValue(),
    },
    {
      header: "Notes",
      accessorKey: "description",
      cell: (info) => info.getValue(),
    },
  ];

  if (user?.role === "user") {
    columns.push({
      header: user?.role === "user" ? "Shared" : "Download",
      accessorKey:
        user?.role === "user" ? "sharedWithAccountant" : "documentId",
      cell: (info) => {
        const val = info.getValue();

        if (user?.role === "user") {
          // @ts-ignore
          return val ? (
            <i className="bi bi-check" />
          ) : (
            <i className="bi bi-x" />
          );
        }
      },
      enableSorting: false,
    });
  }

  return (
    <section id="documentos" className="mt-3">
      <div className="d-flex justify-content-between">
        <h1>Documents</h1>
        <div className="d-flex gap-3">
          {user?.role === "user" && (
            <div>
              <button
                type="button"
                className="btn btn-sm btn-dark"
                onClick={() => handleSelectTab(1)}
              >
                New document
              </button>
            </div>
          )}
          {user?.role !== "user" && (
            <div>
              <button
                type="button"
                className="btn btn-sm btn-secondary"
                onClick={() => handleSelectTab(0)}
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
      <Table defaultColumns={columns} defaultData={documents} />
    </section>
  );
};

export default Documentos;
