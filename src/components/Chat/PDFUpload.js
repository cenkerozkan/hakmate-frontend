import React, { useState, useRef } from "react";
import {
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  Snackbar,
  Box,
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { ChatAPI } from "../../api/apiChat";

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const PDFUpload = ({ chatId, disabled = false, onUploadSuccess, onUploadError }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      setError("Sadece PDF dosyaları yüklenebilir");
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError(`PDF dosyası çok büyük! Maksimum 10MB olmalıdır. Dosya boyutu: ${formatFileSize(file.size)}`);
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      const result = await ChatAPI.uploadPDF({
        chatId,
        file,
        fileName: file.name,
      });

      if (result.success) {
        setSuccess(`PDF başarıyla yüklendi: ${file.name}`);
        if (onUploadSuccess) {
          onUploadSuccess(result);
        }
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error(result.message || "Yükleme başarısız");
      }
    } catch (error) {
      const errorMessage = error.message || "PDF yükleme hatası";
      setError(errorMessage);
      if (onUploadError) {
        onUploadError(error);
      }
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleCloseError = () => {
    setError("");
  };

  const handleCloseSuccess = () => {
    setSuccess("");
  };

  const getTooltipText = () => {
    if (disabled) return "Önce bir chat seçin";
    if (uploading) return "PDF yükleniyor...";
    return "PDF Yükle (Maksimum 10MB)";
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
      
      <Tooltip title={getTooltipText()}>
        <Box>
          <IconButton
            onClick={handleUploadClick}
            disabled={disabled || uploading}
            color="primary"
            sx={{
              opacity: disabled ? 0.5 : 1,
              "&:hover": {
                backgroundColor: "rgba(139, 24, 24, 0.1)",
              },
            }}
          >
            {uploading ? (
              <CircularProgress size={20} />
            ) : (
              <UploadFileIcon />
            )}
          </IconButton>
        </Box>
      </Tooltip>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PDFUpload; 