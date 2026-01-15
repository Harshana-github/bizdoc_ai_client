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

          // Debug FormData (correct way)
          for (let pair of formData.entries()) {
            // console.log("FormData:", pair[0], pair[1]);
          }

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
    }),
    { name: "OcrStore" }
  )
);

export default useOcrStore;
