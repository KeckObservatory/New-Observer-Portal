import { Paper } from "@mui/material";
import type { userInfoApiResponse } from "./api";
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
//import { styled } from '@mui/material/styles';
//import Grid from "@mui/material";
//import Grid from '@mui/material/Grid';





// export function ObserverInfo() {
//   return (
//     <Paper elevation={3} sx={{ width: "100%", p: 2 }}>
//       <Stack spacing={2}>
//         {/* First row */}
//         <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
//           <Typography>My Observing Schedule:</Typography>
//         </Box>

//         {/* Second row */}
//         <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
//           <Typography>My Observing Logs:</Typography>
//         </Box>

//         {/* Third row */}
//         <Box sx={{ p: 2 }}>
//           <Typography>My Proposals:</Typography>
//         </Box>
//       </Stack>
//     </Paper>
//   );
// }

 interface ObserverInfoProps {
  user: userInfoApiResponse;
}

export default function UserTable({ user }: ObserverInfoProps) {
  const fullName = [user.FirstName, user.MiddleName, user.LastName]
    .filter(Boolean)
    .join(" ");

  const fullAddress = [user.Street, user.City, user.State, user.Zip, user.Country]
    .filter(Boolean)
    .join(", ");

  return (
    <TableContainer component={Paper}
    sx={{
    //height: 350, // Set your desired fixed height (px, e.g. 300)
    maxHeight: 331, // set max height, so when new items are added it will scroll
    //minHeight: 300,
    }}
    >
      <Table size="small" stickyHeader></Table>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell><b>Name</b></TableCell>
            <TableCell>{fullName}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>ID</b></TableCell>
            <TableCell>{user.Id}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Email</b></TableCell>
            <TableCell>{user.Email}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Affiliation</b></TableCell>
            <TableCell>{user.Affiliation}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Work Area</b></TableCell>
            <TableCell>{user.WorkArea}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Interests</b></TableCell>
            <TableCell>{user.Interests}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Address</b></TableCell>
            <TableCell>{fullAddress}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>Phone</b></TableCell>
            <TableCell>{user.Phone}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell><b>URL</b></TableCell>
            <TableCell>
              <a href={user.URL} target="_blank" rel="noopener noreferrer">
                {user.URL}
              </a>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}