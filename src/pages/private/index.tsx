import { FC } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Route, Routes, useLocation } from "react-router";
import Metaverse from "./metaverse";
import Default from "./default";
import { useMoralis } from "react-moralis";
import _ from "lodash";

const Index: FC = () => {
    const { logout } = useMoralis();
    const { pathname } = useLocation();

    return (
        <Box>
            <Grid container>
                <Grid item xs={6}>
                    <Typography variant="h6"
                        sx={{
                            m: 2,
                            ml: 4,
                        }}
                    >
                        {_.startCase(pathname) || "Metaverse"}
                    </Typography>
                </Grid>
                <Grid item xs={6}
                    sx={{
                        textAlign: "right",
                    }}
                >
                    <Button
                        sx={{
                            m: 2
                        }}
                        onClick={() => {
                            logout();
                        }}
                    >
                        Logout
                    </Button>
                </Grid>
            </Grid>
            <Routes>
                <Route path="/" element={<Metaverse />} />
                <Route path="/default" element={<Default />} />
            </Routes>
        </Box>
    )
}

export default Index
