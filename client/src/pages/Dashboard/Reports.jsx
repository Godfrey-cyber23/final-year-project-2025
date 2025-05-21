import React, { useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import {
  Grid,
  Paper,
  Typography,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  useTheme,
} from "@mui/material";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DataGrid } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers";
import { useDetection } from "../../contexts/DetectionContext";
import { Download, PictureAsPdf, TableChart } from "@mui/icons-material";
import { format } from "date-fns";

const Reports = () => {
  const theme = useTheme();
  const { detections } = useDetection();
  const [dateRange, setDateRange] = useState([null, null]);
  const [severityFilter, setSeverityFilter] = useState("all");
  const [reportType, setReportType] = useState("summary");

  // Process data based on filters
  const filteredData = detections.filter((d) => {
    const [start, end] = dateRange;
    const dateMatch =
      !start ||
      !end ||
      (new Date(d.timestamp) >= start && new Date(d.timestamp) <= end);
    const severityMatch =
      severityFilter === "all" || d.severity === severityFilter;
    return dateMatch && severityMatch;
  });

  const severityColorMap = {
    high: theme.palette.error,
    medium: theme.palette.warning,
    low: theme.palette.success,
  };

  // Severity distribution data for pie chart
  const severityData = [
    {
      name: "High",
      value: filteredData.filter((d) => d.severity === "high").length,
    },
    {
      name: "Medium",
      value: filteredData.filter((d) => d.severity === "medium").length,
    },
    {
      name: "Low",
      value: filteredData.filter((d) => d.severity === "low").length,
    },
  ];

  // Detection type distribution for bar chart
  const typeData = filteredData.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {});

  // Data Grid columns
  const columns = [
    {
      field: "timestamp",
      headerName: "Date/Time",
      width: 180,
      valueFormatter: (params) =>
        format(new Date(params.value), "dd/MM/yyyy HH:mm"),
    },
    { field: "type", headerName: "Detection Type", width: 180 },
    {
      field: "severity",
      headerName: "Severity",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            color: severityColorMap[params.value]?.contrastText,
            bgcolor: severityColorMap[params.value]?.main,
            px: 1,
            borderRadius: 1,
          }}
        >
          {params.value}
        </Box>
      ),
    },
    { field: "location", headerName: "Location", width: 150 },
    { field: "description", headerName: "Description", width: 250 },
  ];

  // CSV Export
  const handleExportCSV = () => {
    const csvContent = [
      ["Timestamp", "Type", "Severity", "Location", "Description"],
      ...filteredData.map((d) => [
        format(new Date(d.timestamp), "yyyy-MM-dd HH:mm"),
        d.type,
        d.severity,
        d.location,
        d.description,
      ]),
    ]
      .map((e) => e.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `detections_report_${format(new Date(), "yyyyMMdd")}.csv`;
    a.click();
  };

  return (
    <Grid container spacing={3} sx={{ p: 3 }}>
      {/* Report Controls */}
      <Grid item xs={12}>
        <Paper sx={{ p: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
          <DatePicker
            label="Start Date"
            value={dateRange[0]}
            onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
          />
          <DatePicker
            label="End Date"
            value={dateRange[1]}
            onChange={(newValue) => setDateRange([dateRange[0], newValue])}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Severity</InputLabel>
            <Select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              label="Severity"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              label="Report Type"
            >
              <MenuItem value="summary">Summary</MenuItem>
              <MenuItem value="detailed">Detailed</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<PictureAsPdf />}
            onClick={() => {
              /* PDF export implementation */
            }}
          >
            Export PDF
          </Button>
        </Paper>
      </Grid>

      {/* Summary Reports */}
      {reportType === "summary" && (
        <>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Severity Distribution
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={severityData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {severityData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          severityColorMap[entry.name.toLowerCase()]?.main ||
                          theme.palette.grey[500]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: 400 }}>
              <Typography variant="h6" gutterBottom>
                Detection Types
              </Typography>
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={Object.entries(typeData).map(([type, count]) => ({
                    type,
                    count,
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill={theme.palette.primary.main}
                    name="Detection Count"
                  />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </>
      )}

      {/* Detailed Report */}
      {reportType === "detailed" && (
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 600 }}>
            <Typography variant="h6" gutterBottom>
              Detailed Detection Log
            </Typography>
            <DataGrid
              rows={filteredData}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10, 25, 50]}
              checkboxSelection
              disableSelectionOnClick
            />
          </Paper>
        </Grid>
      )}

      {/* Statistics Summary */}
      <Grid item xs={12}>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">Total Detections</Typography>
              <Typography variant="h3">{filteredData.length}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">High Severity</Typography>
              <Typography variant="h3" color="error.main">
                {severityData.find((d) => d.name === "High")?.value || 0}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">Avg. Daily</Typography>
              <Typography variant="h3">
                {(filteredData.length / 30).toFixed(1)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: "center" }}>
              <Typography variant="h6">Response Time</Typography>
              <Typography variant="h3">2.4m</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Reports;
