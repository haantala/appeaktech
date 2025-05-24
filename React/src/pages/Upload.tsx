/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
  FormHelperText,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { FileUp, Type } from "lucide-react";
import dayjs, { Dayjs } from "dayjs";
import { uploadMediaApi } from "../@core/api/CommonApi";

const Upload: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    expiryTime: dayjs().add(7, "day"),
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState({
    title: "",
    file: "",
    expiryTime: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      setFilePreview(null);
      return;
    }

    const file = e.target.files[0];

    // Check if file is an image or video
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      setFormErrors({
        ...formErrors,
        file: "Only image or video files are allowed",
      });
      return;
    }

    // Check file size (limit to 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setFormErrors({
        ...formErrors,
        file: "File size should not exceed 10MB",
      });
      return;
    }

    setSelectedFile(file);
    setFormErrors({
      ...formErrors,
      file: "",
    });

    // Create preview URL
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      setFilePreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      });
    }
  };

  const handleExpiryTimeChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setFormData({
        ...formData,
        expiryTime: newValue,
      });

      const now = dayjs();
      if (newValue.isBefore(now)) {
        setFormErrors({
          ...formErrors,
          expiryTime: "Expiry time must be in the future",
        });
      } else {
        setFormErrors({
          ...formErrors,
          expiryTime: "",
        });
      }
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...formErrors };

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      valid = false;
    }

    if (!selectedFile) {
      newErrors.file = "Please select a file to upload";
      valid = false;
    }

    if (formData.expiryTime <= dayjs()) {
      newErrors.expiryTime = "Expiry time must be in the future";
      valid = false;
    }

    setFormErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const formDataToSend: any = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("expiryTime", formData.expiryTime);
      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      await uploadMediaApi(formDataToSend)
        .then((res) => {
          if (res.status) {
            setSuccess(true);
          } else {
            setError("Upload failed. Please try again.");
          }
        })
        .catch((err) => {
          setError(
            err.response?.data?.message || "Upload failed. Please try again."
          );
        });
      setFormData({
        title: "",
        expiryTime: dayjs(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
      });

      setSelectedFile(null);
      setFilePreview(null);
      setTimeout(() => {
        navigate("/gallery");
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Upload failed. Please try again."
      );
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Media uploaded successfully! Redirecting to gallery...
        </Alert>
      )}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Upload New Media
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="title"
                name="title"
                label="Media Title"
                value={formData.title}
                onChange={handleChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Type size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Expiry Date and Time"
                  value={formData.expiryTime}
                  onChange={handleExpiryTimeChange}
                  minDate={dayjs()}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <input
                type="file"
                accept="image/*,video/*"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={loading}
              />

              <Button
                variant="outlined"
                onClick={triggerFileInput}
                disabled={loading}
                startIcon={<FileUp size={20} />}
                sx={{ mb: 2 }}
              >
                Select File
              </Button>

              {formErrors.file && (
                <FormHelperText error>{formErrors.file}</FormHelperText>
              )}

              {selectedFile && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Selected file: {selectedFile.name} (
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </Typography>
                </Box>
              )}

              {filePreview && (
                <Box
                  sx={{
                    mt: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    p: 1,
                    maxWidth: "100%",
                    height: "auto",
                    maxHeight: "300px",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {selectedFile?.type.startsWith("image/") ? (
                    <img
                      src={filePreview}
                      alt="Preview"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                        objectFit: "contain",
                      }}
                    />
                  ) : (
                    <video
                      src={filePreview}
                      controls
                      style={{
                        maxWidth: "100%",
                        maxHeight: "300px",
                      }}
                    />
                  )}
                </Box>
              )}
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} />
                  ) : (
                    <FileUp size={20} />
                  )
                }
              >
                {loading ? "Uploading..." : "Upload Media"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default Upload;
