import { Stack, Box, Typography } from "@mui/material";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import Brightness2Icon from "@mui/icons-material/Brightness2";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import type { metricsApiResponse } from "./api";
import { getShiftedDate } from './api';


/**
 * Styled Paper component for the night metrics strip.
 */
const StatPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(4),
  minHeight: 120,
}));

/**
 * Displays a single metric with icon, label/name, and value.
 */
function MetricItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Stack spacing={0.5} alignItems="center" sx={{ minWidth: 90 }}>
      <Box>{icon}</Box>
      <Typography variant="subtitle1">{label}</Typography>
      <Typography variant="body1" fontWeight="bold">
        {value}
      </Typography>
    </Stack>
  );
}

export function OrderedNightMetricsStrip({ data }: { data?: metricsApiResponse }) {
  if (!data) return null;
  const shiftedDate = getShiftedDate();


  return (
    <StatPaper elevation={3}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-evenly", // evenly spread across the paper
          alignItems: "center",
          width: "100%",
        }}
      >

      {/* Night of shifted date */}
        <Box sx={{ minWidth: 0, px: 1, textAlign: "right" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            Night of {shiftedDate} UT
          </Typography>
        </Box>
        


        {/* Sunset */}
        <MetricItem icon={<WbSunnyIcon />} label="Sunset" value={data.sunset} />

        {/* Dusk 12° + 18° */}
        <MetricItem
          icon={<NightsStayIcon />}
          label="Dusk"
          value={
            <>
              <Typography variant="body1" fontWeight="bold">{`12°: ${data.dusk_12deg}`}</Typography>
              <Typography variant="body1" fontWeight="bold">{`18°: ${data.dusk_18deg}`}</Typography>
            </>
          }
        />

        {/* Midpoint */}
        <MetricItem icon={<NightsStayIcon />} label="Midpoint" value={data.midpoint}  />

        {/* Dawn 18° + 12° */}
        <MetricItem
          icon={<NightsStayIcon />}
          label="Dawn"
          value={
            <>
              <Typography variant="body1" fontWeight="bold">{`18°: ${data.dawn_18deg}`}</Typography>
              <Typography variant="body1" fontWeight="bold">{`12°: ${data.dawn_12deg}`}</Typography>
            </>
          }
        />

        {/* Sunrise */}
        <MetricItem icon={<WbSunnyIcon />} label="Sunrise" value={data.sunrise} />

                {/* Moonrise */}
        <MetricItem icon={<Brightness2Icon />} label="Moonrise" value={data.moonrise} />

        {/* Moonset */}
        <MetricItem icon={<Brightness2Icon />} label="Moonset" value={data.moonset} />

        {/* Illumination */}
        <MetricItem
          icon={<Brightness2Icon />}
          label="Illumination"
          value={`${Math.round(Number(data.moonillumination) * 100)}%`}
        />


      </Box>
    </StatPaper>
  );
}
