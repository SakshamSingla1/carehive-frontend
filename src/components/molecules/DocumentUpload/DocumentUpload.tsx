import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  LinearProgress,
  Chip
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import DescriptionIcon from "@mui/icons-material/Description";
import { useUploadService } from "../../../services/useUploadService";
import { getColor } from "../../../utils/helper";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import Button from "../../atoms/Button";
import { HTTP_STATUS } from "../../../utils/types";
import { useSnackbar } from "../../../hooks/useSnackbar";

interface UploadedFile {
  name: string;
  url: string;
  documentId: string;
}

interface DocumentUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  onUploadSuccess: (files: UploadedFile[]) => void;
}

const getFileIcon = (name: string, colors: any) => {
  if (name.endsWith(".pdf")) {
    return <PictureAsPdfIcon sx={{ color: "#EF4444" }} />;
  }
  if (name.match(/\.(jpg|jpeg|png)$/)) {
    return <ImageIcon sx={{ color: colors.primary500 }} />;
  }
  return <DescriptionIcon sx={{ color: colors.neutral400 }} />;
};

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  label = "Upload Documents",
  accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSizeMB = 10,
  multiple = false,
  onUploadSuccess,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadFiles } = useUploadService();
  const { defaultTheme } = useAuthenticatedUser();
  const { showSnackbar } = useSnackbar();

  const colors = {
    primary50: getColor(defaultTheme, "primary50") ?? "#EEF2FF",
    primary100: getColor(defaultTheme, "primary100") ?? "#DBE4FF",
    primary300: getColor(defaultTheme, "primary300") ?? "#A5B4FC",
    primary500: getColor(defaultTheme, "primary500") ?? "#6366F1",
    primary700: getColor(defaultTheme, "primary700") ?? "#4338CA",

    neutral0: getColor(defaultTheme, "neutral0") ?? "#FFFFFF",
    neutral50: getColor(defaultTheme, "neutral50") ?? "#F9FAFB",
    neutral100: getColor(defaultTheme, "neutral100") ?? "#F3F4F6",
    neutral200: getColor(defaultTheme, "neutral200") ?? "#E5E7EB",
    neutral400: getColor(defaultTheme, "neutral400") ?? "#9CA3AF",
    neutral700: getColor(defaultTheme, "neutral700") ?? "#374151",
    neutral800: getColor(defaultTheme, "neutral800") ?? "#1F2937",
  };

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  /* ✅ Append + Deduplicate + Size Validation */
  const handleSelect = (files: FileList) => {
    const incomingFiles = Array.from(files);
    const validFiles: File[] = [];
    const rejectedFiles: string[] = [];

    incomingFiles.forEach((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        rejectedFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (rejectedFiles.length) {
      showSnackbar(
        "warning",
        `These files exceed ${maxSizeMB}MB: ${rejectedFiles.join(", ")}`
      );
    }

    setSelectedFiles((prev) => {
      if (!multiple) {
        return validFiles.slice(0, 1);
      }

      const map = new Map(prev.map((f) => [`${f.name}-${f.size}`, f]));
      validFiles.forEach((file) => {
        map.set(`${file.name}-${file.size}`, file);
      });

      return Array.from(map.values());
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles.length || uploading) return;

    try {
      setUploading(true);
      const response = await uploadFiles(selectedFiles);

      if (response.status === HTTP_STATUS.OK) {
        showSnackbar("success", "Files uploaded successfully");
      }

      const mapped = response.data.data.map((d: any) => ({
        name: d.name,
        url: d.url,
        documentId: d.documentId,
      }));

      onUploadSuccess(mapped);
      setSelectedFiles([]);
    } catch (error) {
      showSnackbar("error", "File upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={600} mb={1} color={colors.neutral800}>
        {label}
      </Typography>

      {/* Upload Card */}
      <Box
        onClick={() => inputRef.current?.click()}
        sx={{
          borderRadius: "16px",
          padding: "28px",
          textAlign: "center",
          cursor: "pointer",
          background: `linear-gradient(135deg, ${colors.neutral50}, ${colors.primary50})`,
          border: `2px dashed ${colors.primary300}`,
          transition: "all 0.25s ease",
          "&:hover": {
            background: `linear-gradient(135deg, ${colors.primary50}, ${colors.primary100})`,
            transform: "translateY(-2px)",
          },
        }}
      >
        <UploadFileIcon sx={{ fontSize: 46, color: colors.primary500 }} />
        <Typography mt={1} fontWeight={500} color={colors.neutral800}>
          Click or drag files here
        </Typography>
        <Typography variant="caption" color={colors.neutral400}>
          {accept} • Max {maxSizeMB}MB
        </Typography>

        <input
          ref={inputRef}
          type="file"
          hidden
          multiple={multiple}
          accept={accept}
          onChange={(e) => e.target.files && handleSelect(e.target.files)}
        />
      </Box>

      {!!selectedFiles.length && (
        <Box mt={2}>
          <Typography variant="subtitle2" color={colors.neutral700}>
            Selected
          </Typography>

          <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
            {selectedFiles.map((file) => (
              <Chip
                key={`${file.name}-${file.size}`}
                icon={getFileIcon(file.name, colors)}
                label={file.name}
                variant="outlined"
                sx={{
                  borderColor: colors.primary300,
                  color: colors.neutral800,
                  backgroundColor: colors.neutral0,
                }}
                deleteIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                onDelete={() =>
                  setSelectedFiles((prev) => prev.filter((f) => f !== file))
                }
              />
            ))}
          </Box>

          <Box mt={3}>
            <Button
              label="Upload Files"
              variant="primaryContained"
              fullWidth
              onClick={handleUpload}
              disabled={uploading || !selectedFiles.length}
            />
          </Box>
        </Box>
      )}

      {uploading && (
        <Box mt={2}>
          <LinearProgress
            sx={{
              borderRadius: 2,
              backgroundColor: colors.neutral100,
              "& .MuiLinearProgress-bar": {
                backgroundColor: colors.primary500,
              },
            }}
          />
          <Typography variant="caption" color={colors.neutral400}>
            Uploading files…
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default DocumentUpload;
