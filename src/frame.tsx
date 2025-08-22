import React from "react";
import { styled } from "@mui/material/styles";

const drawerWidth = 240;
const topBarHeight = 64; 

interface ObjectProps {
  url: string;
  open?: boolean;
}

const StyledObject = styled("object", {
  shouldForwardProp: (prop) => prop !== "open",
})<{
  open?: boolean;
}>(({ open }) => ({
  position: "absolute",
  top: topBarHeight,
  left: open ? drawerWidth : 0,
  // vw => viewport width and height (percentage of screen)
  width: open ? `calc(100vw - ${drawerWidth}px)` : "100vw",
  height: `calc(100vh - ${topBarHeight}px)`,

}));

const ObjectEmbed: React.FC<ObjectProps> = ({
  url,
  open = false,
}) => {
  return (
    <StyledObject data={url} open={open}>
      <p>Could not load content. Please check the link.</p>
    </StyledObject>
  );
};

export default ObjectEmbed;
