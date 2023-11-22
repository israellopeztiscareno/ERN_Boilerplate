// Dependencias
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";

import type { AppDispatch } from "../../store";

// Componentes
import Documentos from "./Documentos";
import NuevoDocumento from "./NuevoDocumento";

import {
  documentsUpload,
  documentsSearchAll,
  documentsDownload,
} from "../../store/reducers/documents";

const PerfilBasico = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [refresh, setRefresh] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();

  const onSelectTab = (tab) => {
    setActiveTab(tab);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();

    formData.append("file", values.file);
    formData.append("notes", values.notes);
    formData.append("share", values.share);

    const res = await dispatch(documentsUpload(formData));

    if (res.meta.requestStatus !== "rejected") {
      /**
       * Reset form
       */

      setActiveTab(0);
      setRefresh(true);
    }
  };

  const onDownload = async (documentId) => {
    await dispatch(documentsDownload({ documentId }));
  };

  useEffect(() => {
    if (refresh) {
      dispatch(documentsSearchAll({}));
      setRefresh(false);
    }
  }, [refresh]);

  return (
    <Tabs selectedIndex={activeTab} onSelect={() => {}}>
      <TabList>
        <Tab>{""}</Tab>
        <Tab>{""}</Tab>
      </TabList>
      <TabPanel>
        <Documentos handleSelectTab={onSelectTab} handleDownload={onDownload} />
      </TabPanel>
      <TabPanel>
        <NuevoDocumento handleSelectTab={onSelectTab} onSubmit={handleSubmit} />
      </TabPanel>
    </Tabs>
  );
};

export default PerfilBasico;
