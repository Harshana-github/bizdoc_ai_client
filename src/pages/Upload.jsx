import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useOcrStore from "../store/ocrStore";
import "./Upload.scss";

const Upload = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [previewFile, setPreviewFile] = useState(null);

  const { file, setFile, processOcr, isLoading, error } = useOcrStore();

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewFile(selectedFile);
  };

  const handleClearAll = () => {
    setFile(null);
    setPreviewFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleProcess = async () => {
    try {
      await processOcr();
      navigate("/review");
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const getPreviewUrl = (file) => URL.createObjectURL(file);

  return (
    <div className="upload-container">
      <h2 className="upload-title">{t("upload.title")}</h2>
      <p className="upload-subtitle">{t("upload.subtitle")}</p>

      <div className="upload-layout">
        {/* LEFT */}
        <div className="upload-card">
          <div className="upload-dropzone">
            <div className="upload-icon">📄</div>
            <p className="upload-text">{t("upload.dragDrop")}</p>
            <span className="upload-hint">{t("upload.formats")}</span>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="upload-input"
              onChange={handleFileChange}
            />

            <button
              type="button"
              className="upload-btn"
              onClick={handleBrowseClick}
            >
              {t("upload.browse")}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="preview-card">
          <div className="preview-header">
            <span>{t("upload.preview")}</span>

            {file && (
              <button className="clear-btn" onClick={handleClearAll}>
                {t("upload.clear")}
              </button>
            )}
          </div>

          {!previewFile && (
            <p className="preview-placeholder">{t("upload.previewHint")}</p>
          )}

          {previewFile && previewFile.type.startsWith("image") && (
            <img
              src={getPreviewUrl(previewFile)}
              alt="Preview"
              className="preview-image"
            />
          )}

          {previewFile && previewFile.type === "application/pdf" && (
            <iframe
              src={getPreviewUrl(previewFile)}
              title="PDF Preview"
              className="preview-pdf"
            />
          )}
        </div>
      </div>

      <div className="upload-actions">
        {!isLoading && (
          <button
            className="process-btn"
            disabled={!file}
            onClick={handleProcess}
          >
            {t("upload.process")}
          </button>
        )}

        {isLoading && (
          <div className="processing-bar">
            <div className="processing-bar-fill" />
          </div>
        )}
      </div>

      {error && <p className="upload-error">{error}</p>}
    </div>
  );
};

export default Upload;
