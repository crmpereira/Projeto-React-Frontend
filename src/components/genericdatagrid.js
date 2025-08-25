import React from "react";
import { Paper, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const GenericDataGrid = ({ rows, columns, pageSize = 5, highlightRow, getRowId }) => {
  const theme = useTheme();

  return (
    <Paper sx={{ height: 400, width: "100%", p: 1, overflowX: "auto" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[5, 10, 20]}
        disableRowSelectionOnClick
        components={{ Toolbar: GridToolbar }}
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
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            fontWeight: "bold",
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
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
        }}
      />
    </Paper>
  );
};

export default GenericDataGrid;
