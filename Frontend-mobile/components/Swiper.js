import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Swiper from "react-native-swiper";
import { useCustomThemes } from "../context/useCustomColors";

const SwiperView = forwardRef(({
  slides = [],
  horizontal = true,
  autoplay = false,
  autoplayTimeout = 3,
  controlledSwipe = false,
  ...props
}, ref) => {
  const { theme } = useCustomThemes();
  const swiperRef = useRef(null);

  // 🔹 Exponemos métodos al padre solo si controlledSwipe = true
  useImperativeHandle(ref, () => ({
    scrollBy: (n, animated = true) => {
      if (controlledSwipe && swiperRef.current) {
        swiperRef.current.scrollBy(n, animated);
      }
    },
    scrollTo: (index, animated = true) => {
      if (controlledSwipe && swiperRef.current) {
        swiperRef.current.scrollTo(index, animated);
      }
    },
    getIndex: () => swiperRef.current?.state?.index ?? 0,
  }), [controlledSwipe]);

  return (
    <Swiper
      ref={swiperRef}
      horizontal={horizontal}
      autoplay={autoplay}
      autoplayTimeout={autoplayTimeout}
      activeDotColor={theme.other}
      {...props}
    >
      {slides.map((SlideComponent, index) => (
        <React.Fragment key={index}>
          {typeof SlideComponent === "function" ? (
            <SlideComponent />
          ) : (
            SlideComponent
          )}
        </React.Fragment>
      ))}
    </Swiper>
  );
});

export default SwiperView;