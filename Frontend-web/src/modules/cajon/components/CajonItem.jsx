import { Box, Card, IconButton, Typography } from "@mui/material";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Icon from "@mdi/react";
import { mdiCarHatchback, mdiCarPickup, mdiMotorbike } from "@mdi/js";

export default function CajonItem({ cajon, index, remove }) {
  const ReturnIcon = ({ id }) => {
    switch (id) {
      case 1:
        return <Icon path={mdiCarHatchback} size={2} color="var(--other)" />;
      case 2:
        return <Icon path={mdiCarPickup} size={2} color="var(--other)" />;
      case 3:
        return <Icon path={mdiMotorbike} size={2} color="var(--other)" />;
    }
  };
  return (
    <Card
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        px: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
        }}
      >
        <Box>
          <ReturnIcon id={cajon.tipoVehiculo.id} />
        </Box>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1px",
          }}
        >
          <Typography variant="body2" sx={{ textAlign: "left" }}>
            {cajon.name}
          </Typography>
          <Typography variant="caption" color="gray" sx={{ textAlign: "left", textWrap: "wrap", textOverflow: "clip", lineBreak: "anywhere" }}>
            {cajon.ubicacion}
          </Typography>
        </div>
      </Box>
      <IconButton color="error" onClick={() => remove(index)}>
        <DeleteIcon />
      </IconButton>
    </Card>
  );
}
