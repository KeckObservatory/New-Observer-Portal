import { Stack, Box, Typography} from '@mui/material';
import NightsStayIcon from '@mui/icons-material/NightsStay';
import Brightness2Icon from '@mui/icons-material/Brightness2';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useEffect, useState } from "react";
import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import type { metricsApiResponse } from './api';


const StatPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(4),
  minHeight: 120,
}));

// updating clock
function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

function MetricItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Stack spacing={0.5} alignItems="center" sx={{ minWidth: 90 }}>
      <Box>{icon}</Box>
      <Typography variant="caption">{label}</Typography>
      <Typography variant="body2" fontWeight="bold">
        {value}
      </Typography>
    </Stack>
  );
}
export function NightMetricsStrip({ data }: { data?: metricsApiResponse }) {
  const now = useClock();

  const ut = now.toISOString().slice(11, 19); // ut time
  const hstDate = new Date(now.getTime() - 10 * 60 * 60 * 1000);
  const hst = hstDate.toISOString().slice(11, 19); //hst time

  if (!data) return null;

  return (
    <StatPaper elevation={3}>
      {/* Big clock section */}
      <Stack alignItems="center">
        <AccessTimeIcon fontSize="large" />
        <Typography variant="h4">{ut}</Typography>
        <Typography variant="body2">UT</Typography>
        <Typography variant="body2">HST: {hst}</Typography>
      </Stack>

      {/* Metrics row */}
      <Stack direction="row" spacing={4} flexWrap="wrap" justifyContent="center">
        <MetricItem icon={<WbSunnyIcon />} label="Sunset" value={data.sunset} />
        <MetricItem icon={<WbSunnyIcon />} label="Sunrise" value={data.sunrise} />
        <MetricItem icon={<NightsStayIcon />} label="Dusk 12°" value={data.dusk_12deg} />
        <MetricItem icon={<NightsStayIcon />} label="Dawn 12°" value={data.dawn_12deg} />
        <MetricItem icon={<NightsStayIcon />} label="Dusk 18°" value={data.dusk_18deg} />
        <MetricItem icon={<NightsStayIcon />} label="Dawn 18°" value={data.dawn_18deg} />
        <MetricItem icon={<NightsStayIcon />} label="Midpoint" value={data.midpoint} />
        <MetricItem icon={<Brightness2Icon />} label="Moonrise" value={data.moonrise} />
        <MetricItem icon={<Brightness2Icon />} label="Moonset" value={data.moonset} />
        <MetricItem icon={<Brightness2Icon />} label="Illumination" value={(data.moonillumination)} />
        {/* moon illumination needs to be a percentage */}
      </Stack>
    </StatPaper>
  );
}