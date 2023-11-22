// Dependencias
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";

import {
  documentsSearchAll,
  documentsDownload,
} from "../../store/reducers/documents";

import type { AppDispatch } from "../../store";

// Components
import Clientes from "./Clientes";
import Documentos from "./Documentos";

const PerfilContador = () => {
  const [activeTab, setActiveTab] = useState(0);

  const dispatch = useDispatch<AppDispatch>();

  const onSelectTab = (tab) => {
    setActiveTab(tab);
  };

  const onClick = async (username: string) => {
    const res = await dispatch(documentsSearchAll({ username }));

    if (res.meta.requestStatus !== "rejected") {
      setActiveTab(1);
    }
  };

  const onDownload = async (documentId) => {
    await dispatch(documentsDownload({ documentId }));
  };

  return (
    <Tabs selectedIndex={activeTab} onSelect={() => {}}>
      <TabList>
        <Tab>{""}</Tab>
        <Tab>{""}</Tab>
      </TabList>
      <TabPanel>
        <Clientes handleSelectTab={onSelectTab} handleClick={onClick} />
      </TabPanel>
      <TabPanel>
        <Documentos handleSelectTab={onSelectTab} handleDownload={onDownload} />
      </TabPanel>
    </Tabs>
  );
};

export default PerfilContador;
