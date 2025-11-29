import { useTheme, useMediaQuery } from "@mui/material";
import React from "react";

export default function getCajonDireccion(breakpoints) {
    const theme = useTheme();

    const dirLeft = 'rotate(-90deg)';
    const dirRight = 'rotate(90deg)';

    const isXs = useMediaQuery(theme.breakpoints.only("xs")); // 0 - 599px
    const isSm = useMediaQuery(theme.breakpoints.only("sm")); // 600 - 899px
    const isMd = useMediaQuery(theme.breakpoints.only("md")); // 900 - 1199px
    const isLg = useMediaQuery(theme.breakpoints.up("lg")); // 1200 - 1535px

    const calcularDireccion = React.useMemo(() => {
        if (isXs) {
            switch (breakpoints.xs) {
                //[1, 2, 4, 5],
                case 1:
                case 4:
                    return dirLeft;
                case 2:
                case 5:
                    return dirRight;
            }
        }
        if (isSm) {
            switch (breakpoints.sm) {
                //[2, 3, 5, 6],
                case 2:
                case 5:
                    return dirLeft;
                case 3:
                case 6:
                    return dirRight;
            }
        }
        if (isMd) {
            switch (breakpoints.md) {
                //[1, 3, 4, 6, 7, 9]
                case 3:
                case 6:
                case 9:
                    return dirLeft;
                case 1:
                case 4:
                case 7:
                    return dirRight;
            }
        }
        if (isLg) {
            switch (breakpoints.lg) {
                //[1, 3, 4, 6, 7, 9],
                case 3:
                case 6:
                case 9:
                    return dirLeft;
                case 1:
                case 4:
                case 7:
                    return dirRight;
            }
        }
    }, [isXs, isSm, isMd, isLg]);

    return calcularDireccion;
}