import { Box, IconButton, Typography } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Icon from "@mdi/react";
import { mdiCarHatchback, mdiCarPickup, mdiMotorbike } from "@mdi/js";

export default function CajonItem({ cajon, index, remove }) {
  const ReturnIcon = ({ id }) => {
    switch (id) {
      case 1:
        return <Icon path={mdiCarHatchback} size={1.5} color="var(--other)" />;
      case 2:
        return <Icon path={mdiCarPickup} size={1.5} color="var(--other)" />;
      case 3:
        return <Icon path={mdiMotorbike} size={1.5} color="var(--other)" />;
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 1
        }}
      >
        <ReturnIcon id={cajon.tipoVehiculo.id} />
        <Typography variant="body1">{cajon.name}</Typography>
      </Box>
      <IconButton color="error" onClick={() => remove(index)} >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
}
