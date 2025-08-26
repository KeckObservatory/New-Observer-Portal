import { Paper, Stack, Box, Typography } from "@mui/material";

export function ObserverInfo() {
  return (
    <Paper elevation={3} sx={{ width: "100%", p: 2 }}>
      <Stack spacing={2}>
        {/* First row */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography>My Observing Schedule:</Typography>
        </Box>

        {/* Second row */}
        <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography>My Observing Logs:</Typography>
        </Box>

        {/* Third row */}
        <Box sx={{ p: 2 }}>
          <Typography>My Proposals:</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
