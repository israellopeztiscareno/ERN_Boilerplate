// Dependencias
import { createSlice } from "@reduxjs/toolkit";
import { Base64 } from "js-base64";

import HTTPService from "../../helpers/api/api.client";

import { asyncThunkHandleError } from "../../helpers/utils";

type Document = {
  documentId: string;
  uploadDate: string;
  title: string;
  description: string;
  tags: Array<string>;
  sharedWithAccountant: boolean;
};

/**
 * Initial state
 */

interface Documents {
  documents: Array<Document>;
}

const initialState: Documents = {
  documents: [],
};

type DocumentsSearch = {
  username?: string;
};

type DocumentsResponse = {
  documents: Array<Document>;
};

export const documentsSearchAll = asyncThunkHandleError<
  DocumentsSearch,
  DocumentsResponse
>(
  "documents/searchAll",
  async (formValues) =>
    await HTTPService("POST", "/api/documents-get-all", formValues),
);

export const documentsUpload = asyncThunkHandleError(
  "documents/upload",
  async (formData) =>
    await HTTPService("POST", "/api/documents-upload", formData),
);

export const documentsDownload = asyncThunkHandleError(
  "documents/download",
  async (formData) =>
    await HTTPService("POST", "/api/documents-download", formData),
);

const userSlice = createSlice({
  name: "documents",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(documentsSearchAll.fulfilled, (state, action) => {
      const { documents } = action.payload;

      state.documents = documents;
    });

    builder.addCase(documentsDownload.fulfilled, (_state, action) => {
      const data = action.payload;
      const fileName: string = data.filename;
      const cleanedFileName = fileName.substring(
        fileName.indexOf("[") + 1,
        fileName.lastIndexOf("]"),
      );
      const arrayBuffer = Base64.toUint8Array(data.content);
      const fileLink = document.createElement("a");

      fileLink.href = window.URL.createObjectURL(new Blob([arrayBuffer]));
      fileLink.setAttribute("download", cleanedFileName);

      document.body.appendChild(fileLink);

      fileLink.click();
      fileLink.remove();
    });
  },
});

export default userSlice;
