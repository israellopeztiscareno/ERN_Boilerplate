// Dependencias
import React from "react";
import { useSelector } from "react-redux";
import { ColumnDef } from "@tanstack/react-table";

import Table from "../common/Table";

export type Clientes = {
  username: string;
  firstName: string;
  lastName: string;
  description: string;
  email: string;
  creationDate: string;
};

interface Props {
  handleSelectTab: (tab: number) => void;
  handleClick: (username: string) => void;
}

const Clientes = ({ handleSelectTab, handleClick }: Props) => {
  // @ts-ignore
  const { users } = useSelector((state) => state.users);

  const columns: ColumnDef<Clientes>[] = [
    {
      header: "Name",
      accessorKey: "firstName",
      cell: (info) => info.getValue(),
    },
    {
      header: "Last name",
      accessorKey: "lastName",
      cell: (info) => info.getValue(),
    },
    {
      header: "Date added",
      accessorKey: "creationDate",
      cell: (info) => info.getValue(),
    },
    {
      header: "Review",
      accessorKey: "username",
      cell: (info) => (
        <button
          className="btn btn-sm btn-dark"
          onClick={() => handleClick(info.getValue() as string)}
        >
          <i className="bi bi-folder" />
        </button>
      ),
      enableSorting: false,
    },
  ];

  return (
    <section id="clientes" className="mt-3">
      <h1>Clientes</h1>
      <Table defaultColumns={columns} defaultData={users} />
    </section>
  );
};

export default Clientes;
