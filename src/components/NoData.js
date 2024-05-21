import React from "react";
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';

import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';



//marked for deletion
function NoData() {
    return (
        <Container>
            <Card className="tour-card">
                <CardContent>
                <div className="mt-3">
                    <Typography color="green" align="center" variant="h4" style={{ whiteSpace: "break-spaces" }}>
                    NO RESULTS AVAILABLE FOR THIS SEARCH TERM
                    </Typography>
                </div>
                </CardContent>
            </Card>

        </Container>
    );
}

export default NoData