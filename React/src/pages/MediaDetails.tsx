/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Alert,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Trash2, Calendar, Info, ArrowLeft, Clock } from "lucide-react";
import { format } from "date-fns";
import { useAuth } from "../contexts/AuthContext";

import {
  deleteMediaApi,
  fetchExpiredMediaApibyID,
} from "../@core/api/CommonApi";

interface MediaDetails {
  id: number;
  title: string;
  media_url: string;
  media_type: string;
  media_expiration: string;
  createdAt: string;
  media_size: number;
}

const MediaDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [media, setMedia] = useState<MediaDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const fetchMediaDetails = async () => {
    try {
      await fetchExpiredMediaApibyID(id).then((response) => {
        if (response.status) {
          setMedia(response.data);
        } else {
          throw new Error(response.message);
        }
      });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch media details");
    } finally {
      setLoading(false);
    }
  };

  console.log(media);

  useEffect(() => {
    if (id) {
      fetchMediaDetails();
    }
  }, [id]);

  const handleDeleteConfirm = async () => {
    if (!media) return;
    setDeleteLoading(true);

    await deleteMediaApi(id)
      .then((response) => {
        if (response.status) {
          setOpenDeleteDialog(false);
          navigate(user?.role === "admin" ? "/admin" : "/gallery");
        } else {
          setDeleteError(response.message);
        }
      })
      .catch((err: any) => {
        setDeleteError(err.response?.data?.message || "Failed to delete media");
      });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " bytes";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getTimeRemaining = (expiryTimeStr: string) => {
    const media_expiration = new Date(expiryTimeStr).getTime();
    const now = new Date().getTime();
    const timeRemaining = media_expiration - now;

    // Calculate days, hours, minutes
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );

    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else if (minutes > 0) {
      return `${minutes}m remaining`;
    } else {
      return "Expiring soon";
    }
  };

  const getChipColor = (expiryTimeStr: string) => {
    const media_expiration = new Date(expiryTimeStr).getTime();
    const now = new Date().getTime();
    const timeRemaining = media_expiration - now;
    const dayInMs = 1000 * 60 * 60 * 24;

    if (timeRemaining < dayInMs) {
      return "error"; // Less than 1 day
    } else if (timeRemaining < dayInMs * 3) {
      return "warning"; // Less than 3 days
    } else {
      return "success";
    }
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowLeft size={18} />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <CircularProgress />
        </Box>
      ) : media ? (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                mb: 4,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              {media.media_type.startsWith("image/") ? (
                <Box
                  component="img"
                  src={media.media_url}
                  alt={media.title}
                  sx={{
                    width: "100%",
                    maxHeight: "600px",
                    objectFit: "contain",
                    borderRadius: 1,
                  }}
                />
              ) : media.media_type.startsWith("video/") ? (
                <Box
                  component="video"
                  src={media.media_url}
                  controls
                  sx={{
                    width: "100%",
                    maxHeight: "600px",
                    borderRadius: 1,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    height: "300px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "background.default",
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body1" color="text.secondary">
                    Preview not available for this file type
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                {media.title}
              </Typography>

              <Box sx={{ my: 2 }}>
                <Chip
                  icon={<Clock size={16} />}
                  label={getTimeRemaining(media.media_expiration)}
                  color={getChipColor(media.media_expiration) as any}
                  sx={{ borderRadius: "4px" }}
                />
              </Box>

              <Box sx={{ my: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Calendar
                        size={18}
                        style={{ marginRight: "8px", opacity: 0.7 }}
                      />
                      <Typography variant="body2">
                        Uploaded on:{" "}
                        <strong>
                          {format(
                            new Date(media.createdAt),
                            "MMM d, yyyy - h:mm a"
                          )}
                        </strong>
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Calendar
                        size={18}
                        style={{ marginRight: "8px", opacity: 0.7 }}
                      />
                      <Typography variant="body2">
                        Expires on:{" "}
                        <strong>
                          {format(
                            new Date(media.media_expiration),
                            "MMM d, yyyy - h:mm a"
                          )}
                        </strong>
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                      <Info
                        size={18}
                        style={{ marginRight: "8px", opacity: 0.7 }}
                      />
                      <Typography variant="body2">
                        File type: <strong>{media.media_type}</strong>
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Info
                        size={18}
                        style={{ marginRight: "8px", opacity: 0.7 }}
                      />
                      <Typography variant="body2">
                        File size:{" "}
                        <strong>{formatFileSize(media.media_size)}</strong>
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              <Box
                sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}
              >
                {user && user.role === "admin" && (
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Trash2 size={18} />}
                    onClick={() => setOpenDeleteDialog(true)}
                    fullWidth
                  >
                    Delete
                  </Button>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Alert severity="info">Media not found or has expired</Alert>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{media?.title}"? This action cannot
            be undone.
          </DialogContentText>

          {deleteError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {deleteError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            color="error"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
            startIcon={deleteLoading && <CircularProgress size={16} />}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MediaDetails;
