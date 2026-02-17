import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats, fetchTrends, fetchProductDistribution, fetchRegionDistribution } from '../store/salesSlice';
import {
    Grid,
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button
} from '@mui/material';
import RevenueChart from '../components/Charts/RevenueChart';
import ProductChart from '../components/Charts/ProductChart';
import RegionChart from '../components/Charts/RegionChart';
import FileUploader from '../components/FileUploader';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTheme, IconButton } from '@mui/material';
import { useColorMode } from '../ColorModeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Dashboard = () => {
    const theme = useTheme();
    const { toggleColorMode } = useColorMode();
    const dispatch = useDispatch();
    const { stats, trends, productData, regionData, loading } = useSelector((state) => state.sales);


    const [period, setPeriod] = useState('monthly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [category, setCategory] = useState('');
    const [region, setRegion] = useState('');

    const fetchData = () => {
        const filters = { startDate, endDate, category, region };

        const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));

        dispatch(fetchStats({ period, ...cleanFilters }));
        dispatch(fetchTrends({ period, ...cleanFilters }));
        dispatch(fetchProductDistribution({ period, ...cleanFilters }));
        dispatch(fetchRegionDistribution({ period, ...cleanFilters }));
    };


    useEffect(() => {
        fetchData();
    }, [dispatch, period]);

    const handleApplyFilters = () => {
        fetchData();
    };


    const avgOrderValue = stats?.total_quantity > 0
        ? (Number(stats.total_revenue) / Number(stats.total_quantity)).toFixed(2)
        : '0.00';

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                    Analytics Dashboard
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconButton onClick={toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                    <FileUploader />
                </div>
            </Box>

            <Box sx={{ mb: 4, p: 2, bgcolor: 'background.paper', borderRadius: 2, display: 'flex', gap: 2, alignItems: 'end', flexWrap: 'wrap' }}>
                <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    size="small"
                />
                <TextField
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    size="small"
                />
                <TextField
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    size="small"
                    placeholder="e.g. Electronics"
                />
                <TextField
                    label="Region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    size="small"
                    placeholder="e.g. North"
                />
                <Button
                    variant="contained"
                    startIcon={<FilterListIcon />}
                    onClick={handleApplyFilters}
                    disabled={loading}
                    sx={{ height: 40 }}
                >
                    Apply Filters
                </Button>
                <Button
                    variant="outlined"
                    onClick={() => {
                        setStartDate('');
                        setEndDate('');
                        setCategory('');
                        setRegion('');

                        dispatch(fetchStats({}));
                        dispatch(fetchTrends({ period }));
                        dispatch(fetchProductDistribution({}));
                        dispatch(fetchRegionDistribution({}));
                    }}
                    disabled={loading}
                    sx={{ height: 40 }}
                >
                    Clear
                </Button>
            </Box>


            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#667eea', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <CurrencyRupeeIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Total Revenue</Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="bold">
                                ₹{Number(stats?.total_revenue || 0).toLocaleString('en-IN')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#11998e', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <ShoppingCartIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Total Sales</Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="bold">
                                {Number(stats?.total_quantity || 0).toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ bgcolor: '#ff9966', color: 'white' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <TrendingUpIcon sx={{ mr: 1 }} />
                                <Typography variant="h6">Avg Order Value</Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="bold">
                                ₹{Number(avgOrderValue).toLocaleString('en-IN')}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
                <Grid item xs={12} lg={8}>
                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                        <Typography variant="body1" sx={{ mr: 2 }}>Period:</Typography>
                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                sx={{ height: 40 }}
                            >
                                <MenuItem value="daily">Daily</MenuItem>
                                <MenuItem value="weekly">Weekly</MenuItem>
                                <MenuItem value="monthly">Monthly</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <RevenueChart data={trends} />
                </Grid>
                <Grid item xs={12} lg={4}>
                    <RegionChart data={regionData} />
                </Grid>

                <Grid item xs={12}>
                    <ProductChart data={productData} />
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
