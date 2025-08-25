import React from "react";
import { Paper, useTheme, LinearProgress } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const GenericDataGrid = ({ rows, columns, pageSize = 5, highlightRow, getRowId, loading = false }) => {
  const theme = useTheme();

  return (
    <Paper 
      sx={{ 
        height: 400, 
        width: "100%", 
        p: 1, 
        overflowX: "auto",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        components={{
          Toolbar: GridToolbar,
          LoadingOverlay: LinearProgress,
        }}
        loading={loading}
        getRowId={getRowId} // ID único passado pelo componente pai
        getRowClassName={(params) =>
          highlightRow && highlightRow(params.row)
            ? "linha-destaque"
            : params.indexRelativeToCurrentPage % 2 === 0
            ? "linha-par"
            : "linha-impar"
        }
        sx={{
          backgroundColor: "#f0f4f8",
          border: "none",
          borderRadius: 1,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: "bold",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          },
          "& .MuiDataGrid-toolbarContainer": {
            padding: 1,
          },
          "& .MuiButton-root": {
            borderRadius: 8,
          },
          "& .linha-impar": {
            backgroundColor: "#ffffff",
          },
          "& .linha-par": {
            backgroundColor: "#e8f0fe",
          },
          "& .linha-destaque": {
            backgroundColor: "#d1ffd6",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "#cce4ff",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
          },
          "& .MuiDataGrid-columnSeparator": {
            display: "none",
          },
        }}
      />
    </Paper>
  );
};

export default GenericDataGrid;
