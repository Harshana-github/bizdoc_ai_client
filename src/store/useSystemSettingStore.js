import { create } from "zustand";
import { devtools } from "zustand/middleware";
import customFetch from "../utils/axios";

const useSystemSettingStore = create(
  devtools(
    (set) => ({
      companyName: "",
      documentTypes: [],
      isLoading: false,
      error: null,
      success: null,

      clearMessages: () =>
        set({
          error: null,
          success: null,
        }),

      /* ---------------- Fetch Company Name ---------------- */
      fetchCompanyName: async () => {
        set({ isLoading: true });

        try {
          const response = await customFetch.get("/system-settings");

          set({
            companyName: response.data.data.company_name,
            isLoading: false,
          });
        } catch (err) {
          set({
            isLoading: false,
            error: "Failed to load company name",
          });
        }
      },

      /* ---------------- Update Company Name ---------------- */
      updateCompanyName: async (company_name) => {
        set({ isLoading: true, error: null, success: null });

        try {
          const response = await customFetch.post("/system-settings", {
            company_name,
          });

          set({
            companyName: response.data.data.company_name,
            isLoading: false,
            success: response.data.message,
          });

          return response.data;
        } catch (err) {
          set({
            isLoading: false,
            error:
              err?.response?.data?.message ||
              err?.message ||
              "Failed to update company name",
          });

          throw err;
        }
      },

      /* ---------------- Clear OCR History ---------------- */
      clearOcrHistory: async () => {
        set({ isLoading: true, error: null, success: null });

        try {
          const response = await customFetch.get("/clear-ocr-history");

          set({
            isLoading: false,
            success: response.data.message,
          });

          return response.data;
        } catch (err) {
          set({
            isLoading: false,
            error:
              err?.response?.data?.message ||
              err?.message ||
              "Failed to clear OCR history",
          });

          throw err;
        }
      },

      /* ---------------- Clear Laravel Cache ---------------- */
      clearCache: async () => {
        set({ isLoading: true, error: null, success: null });

        try {
          await customFetch.get("/clear-cache");

          set({
            isLoading: false,
            success: "Cache cleared successfully",
          });
        } catch (err) {
          set({
            isLoading: false,
            error:
              err?.response?.data?.message ||
              err?.message ||
              "Failed to clear cache",
          });

          throw err;
        }
      },

      /* ---------------- Run Migrations ---------------- */
      runMigrations: async () => {
        set({ isLoading: true, error: null, success: null });

        try {
          const response = await customFetch.get("/run-migrations");

          set({
            isLoading: false,
            success: response.data.message,
          });

          return response.data;
        } catch (err) {
          set({
            isLoading: false,
            error:
              err?.response?.data?.message ||
              err?.message ||
              "Migration failed",
          });

          throw err;
        }
      },

      fetchDocumentTypes: async () => {
        try {
          const res = await customFetch.get("/document-types");
          set({ documentTypes: res.data.data });
        } catch (err) {}
      },

      uploadTemplate: async ({ document_type_id, file }) => {
        set({ isLoading: true, error: null, success: null });

        try {
          const formData = new FormData();
          formData.append("document_type_id", document_type_id);
          formData.append("file", file);

          const res = await customFetch.post("/templates", formData, {
            skipDefaultContentType: true,
          });

          set({
            isLoading: false,
            success: "Template uploaded successfully",
          });

          return res.data;
        } catch (err) {
          set({
            isLoading: false,
            error: err?.response?.data?.message || "Upload failed",
          });

          throw err;
        }
      },
    }),
    { name: "SystemSettingStore" },
  ),
);

export default useSystemSettingStore;
