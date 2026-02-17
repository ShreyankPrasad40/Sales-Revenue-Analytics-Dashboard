import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadData, fetchStats, fetchTrends, fetchProductDistribution, fetchRegionDistribution } from '../store/salesSlice';
import { Button, CircularProgress, Typography, Box, Alert, Snackbar } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const FileUploader = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.sales);
    const [open, setOpen] = useState(false);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                await dispatch(uploadData(file)).unwrap();
                setOpen(true);

                dispatch(fetchStats());
                dispatch(fetchTrends({ period: 'monthly' }));
                dispatch(fetchProductDistribution());
                dispatch(fetchRegionDistribution());
            } catch (err) {
                console.error("Upload failed detailed:", err);
                const errorMessage = err.response?.data?.message || err.message || "Unknown error";
                console.error("Error message:", errorMessage);
                alert(`Upload Error: ${errorMessage}`);
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <input
                accept=".csv, .xlsx, .xls"
                style={{ display: 'none' }}
                id="raised-button-file"
                type="file"
                onChange={handleFileChange}
            />
            <label htmlFor="raised-button-file">
                <Button
                    variant="contained"
                    component="span"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                    disabled={loading}
                    sx={{
                        textTransform: 'none',
                        fontSize: '1rem'
                    }}
                >
                    {loading ? 'Uploading...' : 'Import CSV / Excel'}
                </Button>
            </label>
            {error && <Typography color="error" variant="body2">{error}</Typography>}

            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity="success" sx={{ width: '100%' }}>
                    File imported successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default FileUploader;
