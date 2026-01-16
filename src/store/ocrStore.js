import { create } from "zustand";
import { devtools } from "zustand/middleware";
import customFetch from "../utils/axios";

const useOcrStore = create(
  devtools(
    (set, get) => ({
      file: null,
      result: null,
      isLoading: false,
      savedOcrId: null,
      error: null,

      processCount: {
        total: 0,
        user: 0,
      },
      processCountLoading: false,

      setFile: (file) => set({ file }),

      clearFile: () =>
        set({
          file: null,
          result: null,
          error: null,
          savedOcrId: null,
        }),

      processOcr: async () => {
        const { file } = get();

        if (!file) {
          set({ error: "No file selected" });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const formData = new FormData();
          formData.append("document", file, file.name);

          const response = await customFetch.post("/ocr/process", formData, {
            skipDefaultContentType: true,
          });

          set({
            result: response.data,
            isLoading: false,
            savedOcrId: null,
          });

          return response.data;
        } catch (err) {
          let message = "Upload failed";

          if (err?.response?.data?.message) {
            message = err.response.data.message;
          } else if (err?.message) {
            message = err.message;
          }

          set({
            error: message,
            isLoading: false,
          });

          throw err;
        }
      },

      clearError: () => set({ error: null }),

      saveOcrResult: async (updatedData = null) => {
        const { result, savedOcrId } = get();

        if (!result?.file?.stored_path) {
          set({ error: "File path not found. Please re-upload." });
          return;
        }

        set({ isLoading: true, error: null });

        try {
          const payload = {
            id: savedOcrId ?? null,
            file_path: result.file.stored_path,
            ocr_data: updatedData ?? result.ocr,
          };

          const response = await customFetch.post("/ocr/save", payload);

          set({
            isLoading: false,
            savedOcrId: response.data.data.id,
          });

          return response.data;
        } catch (err) {
          set({
            error:
              err?.response?.data?.message || err?.message || "Save failed",
            isLoading: false,
          });

          throw err;
        }
      },

      fetchHistory: async () => {
        set({ historyLoading: true, error: null });

        try {
          const response = await customFetch.get("/ocr/history");

          set({
            history: response?.data?.data?.data ?? [],
            historyLoading: false,
          });
        } catch (err) {
          set({
            history: [],
            error: err?.message || "Failed to load history",
            historyLoading: false,
          });
        }
      },

      loadOcrById: async (id) => {
        set({ isLoading: true, error: null });

        try {
          const response = await customFetch.get(`/ocr/${id}`);

          set({
            result: {
              file: {
                stored_path: response.data.data.file_path,
              },
              ocr: response.data.data.data,
            },
            savedOcrId: response.data.data.id,
            isLoading: false,
          });

          return response.data.data;
        } catch (err) {
          set({
            error: err?.message || "Failed to load OCR",
            isLoading: false,
          });
          throw err;
        }
      },

      fetchProcessCount: async () => {
        set({ processCountLoading: true, error: null });

        try {
          const response = await customFetch.get("/ocr/process-count");

          set({
            processCount: response.data.count,
            processCountLoading: false,
          });

          return response.data.count;
        } catch (err) {
          set({
            processCountLoading: false,
            error: err?.message || "Failed to load process count",
          });
        }
      },

      exportOcr: async ({ doc, lang, type }) => {
        try {
          const response = await customFetch.post(
            "/ocr/export",
            {
              doc,
              lang,
              type,
            },
            {
              responseType: "blob",
            }
          );

          return response.data;
        } catch (err) {
          throw err;
        }
      },
    }),
    { name: "OcrStore" }
  )
);

export default useOcrStore;
