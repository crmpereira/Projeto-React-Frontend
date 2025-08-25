import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const GenericDataGrid = ({ rows, columns, pageSize = 5, getRowId, loading = false }) => {
  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={rows || []}
        columns={columns || []}
        initialState={{
          pagination: {
            paginationModel: { pageSize: pageSize },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        getRowId={getRowId}
        loading={loading}
        hideFooter={false}
        disableColumnMenu={false}
        disableColumnFilter={false}
        disableColumnSelector={false}
        disableDensitySelector={false}
        sx={{
          '& .MuiDataGrid-columnHeaders': {
            minHeight: '56px !important',
            maxHeight: '56px !important',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: 'bold',
          }
        }}
      />
    </div>
  );
};

export default GenericDataGrid;
