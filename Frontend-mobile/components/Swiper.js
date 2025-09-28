import React from "react";
import Swiper from "react-native-swiper";
import { useCustomThemes } from "../context/useCustomColors";

export default function SwiperView({
  slides = [],
  horizontal = true,
  autoplay = false, 
  autoplayTimeout = 3, 
  ...props
}) {
    const { theme } = useCustomThemes();
  return (
    <Swiper horizontal={horizontal} {...props} autoplay={autoplay} autoplayTimeout={autoplayTimeout} activeDotColor={theme.other}>
      {slides.map((SlideComponent, index) => (
        <React.Fragment key={index}>
          {
            typeof SlideComponent === "function" ? (
              <SlideComponent /> // si es función, la ejecutamos
            ) : (
              SlideComponent
            ) // si es JSX, lo usamos directamente
          }
        </React.Fragment>
      ))}
    </Swiper>
  );
}
