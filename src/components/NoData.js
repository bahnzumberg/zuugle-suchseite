import React from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';



//marked for deletion
function NoData() {
    return (
      <Card className="tour-card">
        <CardContent>
          <div className="mt-3">
            <Typography variant="h4" style={{ whiteSpace: "break-spaces" }}>
              NO DATA AVAILABLE FOR THIS SEARCH
            </Typography>
          </div>
        </CardContent>
      </Card>
    );
}

export default NoData