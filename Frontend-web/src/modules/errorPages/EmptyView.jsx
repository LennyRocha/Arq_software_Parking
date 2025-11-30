import React from "react";
import "./emptyView.css";
import { Typography } from "@mui/material";

export default function EmptyView({ message, customIcon }) {
  return (
    <div className="empty_view">
      {customIcon}
      <Typography variant="subtitle1" className="empty_gray_text">
        {message}
      </Typography>
    </div>
  );
}
