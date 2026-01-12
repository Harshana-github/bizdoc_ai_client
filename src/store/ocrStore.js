import { create } from "zustand";
import { devtools } from "zustand/middleware";
import customFetch from "../utils/axios";

const useOcrStore = create(
  devtools(
    (set, get) => ({
      file: null,
      result: null,
      isLoading: false,
      error: null,

      setFile: (file) => set({ file }),

      clearFile: () =>
        set({
          file: null,
          result: null,
          error: null,
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
            // same trick you used before (IMPORTANT)
            skipDefaultContentType: true,
          });

          set({
            result: response.data,
            isLoading: false,
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
    }),
    { name: "OcrStore" }
  )
);

export default useOcrStore;
