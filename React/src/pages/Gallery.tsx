/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Skeleton,
  Alert,
  Chip,
  InputAdornment,
  TextField,
  FormControl,
  MenuItem,
  Select,
  InputLabel,
} from "@mui/material";
import { format } from "date-fns";
import { Search, CalendarClock, FileType2 } from "lucide-react";

import { fetchActiveMediaApi } from "../@core/api/CommonApi";

interface MediaItem {
  media_id: number;
  title: string;
  media_url: string;
  media_type: string;
  media_expiration: string;
  uploadedBy: string;
  createdAt: string;
}

const Gallery: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();

  const fetchMedia = async () => {
    try {
      await fetchActiveMediaApi()
        .then((response) => {
          if (response.status) {
            setMediaItems(response.data);
          } else {
            setError(response.message);
          }
        })
        .catch((err: any) => {
          setError(err.response?.data?.message || "Failed to fetch media");
        });
      setLoading(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch media");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMedia();
  }, []);

  const handleMediaClick = (media_id: number) => {
    navigate(`/media/${media_id}`);
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

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <FileType2 size={18} />;
    } else if (fileType.startsWith("video/")) {
      return <FileType2 size={18} />;
    } else {
      return <FileType2 size={18} />;
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

  const filteredMedia = mediaItems
    .filter((item) => {
      // Apply search filter
      if (searchQuery) {
        return item.title.toLowerCase().includes(searchQuery.toLowerCase());
      }
      return true;
    })
    .filter((item) => {
      // Apply type filter
      if (filterType === "all") return true;
      if (filterType === "image") return item.media_type.startsWith("image/");
      if (filterType === "video") return item.media_type.startsWith("video/");
      return true;
    });

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <TextField
          label="Search media"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ flexGrow: 1, minWidth: "200px" }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl sx={{ minWidth: "150px" }}>
          <InputLabel id="filter-type-label">Media Type</InputLabel>
          <Select
            labelId="filter-type-label"
            id="filter-type"
            value={filterType}
            label="Media Type"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="image">Images</MenuItem>
            <MenuItem value="video">Videos</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="40%" />
                </CardContent>
                <CardActions>
                  <Skeleton variant="rectangular" width={120} height={36} />
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : filteredMedia.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 10,
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No media found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Try adjusting your search or filters
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredMedia.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.media_id}>
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                    borderColor: "primary.light",
                  },
                }}
              >
                <CardMedia
                  component={
                    item.media_type.startsWith("video/") ? "video" : "img"
                  }
                  image={item.media_url}
                  alt={item.title}
                  sx={{
                    height: 200,
                    objectFit: "cover",
                    backgroundColor: "#f5f5f5",
                    cursor: "pointer",
                  }}
                  onClick={() => handleMediaClick(item.media_id)}
                />

                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Chip
                      size="small"
                      icon={getFileTypeIcon(item.media_type)}
                      label={item.media_type.split("/")[0]}
                      sx={{
                        borderRadius: "4px",
                        bgcolor: "background.default",
                        fontSize: "0.75rem",
                      }}
                    />
                    <Chip
                      size="small"
                      icon={<CalendarClock size={16} />}
                      label={getTimeRemaining(item.media_expiration)}
                      color={getChipColor(item.media_expiration) as any}
                      sx={{ borderRadius: "4px", fontSize: "0.75rem" }}
                    />
                  </Box>

                  <Typography gutterBottom variant="h6" component="div" noWrap>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Expires:{" "}
                    {format(
                      new Date(item.media_expiration),
                      "MMM d, yyyy - h:mm a"
                    )}
                  </Typography>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleMediaClick(item.media_id)}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Gallery;
