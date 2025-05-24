/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { format } from "date-fns";
import { Trash2, Clock } from "lucide-react";

import { deleteMediaApi, fetchExpiredMediaApi } from "../@core/api/CommonApi";

interface MediaItem {
  media_id: number;
  title: string;
  media_type: string;
  media_expiration: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [expiredMedia, setExpiredMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      await fetchExpiredMediaApi()
        .then((response) => {
          if (response.status) {
            setExpiredMedia(response.data);
          } else {
            setError(response.message);
          }
        })
        .catch((err: any) => {
          setError(err.response?.data?.message || "Failed to fetch media");
        });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMedia();
  }, []);

  const handleDeleteClick = (media: MediaItem) => {
    setSelectedMedia(media);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedMedia) return;
    setDeleteLoading(true);

    await deleteMediaApi(selectedMedia.media_id)
      .then((response) => {
        if (response.status) {
          setExpiredMedia(
            expiredMedia.filter(
              (item) => item.media_id !== selectedMedia.media_id
            )
          );
          setError(null);
          setDeleteDialogOpen(false);
          setSelectedMedia(null);
        } else {
          setError(response.message);
        }
      })
      .catch((err: any) => {
        setError(err.response?.data?.message || "Failed to delete media");
      });
  };

  const getTimeSinceExpiry = (expiryTimeStr: string) => {
    const media_expiration = new Date(expiryTimeStr).getTime();
    const now = new Date().getTime();
    const timeSince = now - media_expiration;
    const days = Math.floor(timeSince / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeSince % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    if (days > 0) {
      return `${days}d ${hours}h ago`;
    } else {
      return `${hours}h ago`;
    }
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell>Expired</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {expiredMedia.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          sx={{ py: 4 }}
                        >
                          No expired media found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    expiredMedia.map((media) => (
                      <TableRow key={media.media_id}>
                        <TableCell>{media.title}</TableCell>
                        <TableCell>{media.media_type.split("/")[0]}</TableCell>
                        <TableCell>
                          {format(new Date(media.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            icon={<Clock size={14} />}
                            label={getTimeSinceExpiry(media.media_expiration)}
                            color="error"
                            sx={{ borderRadius: "4px" }}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(media)}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}
      </Paper>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedMedia?.title}"? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialogOpen(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button
            color="error"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={20} /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;
