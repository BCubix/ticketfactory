import React, { useState } from "react";
import { useTheme } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import { Typography, Button } from "@mui/material";
import { Carousel, SlideContainer, ArrowLeft, ArrowRight, Indicators, Indicator, Overlay } from './sc.CmtImageCarousel';

export const CmtImageCarousel = ({ data }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const [slide, setSlide] = useState(0);

  const nextSlide = () => {
    setSlide(slide === data.length - 1 ? 0 : slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide === 0 ? data.length - 1 : slide - 1);
  };

  const openExternalLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <Carousel>
      <ArrowLeft onClick={prevSlide}>
        <ArrowBackIosNewRoundedIcon />
      </ArrowLeft>
      <ArrowRight onClick={nextSlide}>
        <ArrowForwardIosRoundedIcon />
      </ArrowRight>
      {data.map((item, idx) => (
        <SlideContainer
          key={idx}
          hidden={slide !== idx}
          style={{ backgroundImage: `url(${item.src})` }}
        >
          <Overlay>
            <div
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "100%",
                color: "white",
                padding: "50px",
                bottom: "10px",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                textAlign: "left",
              }}
            >
              <Typography
                sx={{
                  ...theme.typography.h1,
                  color: theme.palette.primary.dark,
                  fontSize: { xs: '15px', sm: '25px' },
                }}
              >
                {item.title}
              </Typography>
              <Typography
                sx={{
                  ...theme.typography.subtitle1,
                  color: theme.palette.primary.dark,
                  fontSize: { xs: '8px', sm: '12px' },
                }}
              >
                {item.shortDescription}
                <Button variant="text" size="small" onClick={() => openExternalLink(item.link)}>Voir plus</Button>
              </Typography>
            </div>
          </Overlay>
        </SlideContainer>
      ))}
      <Indicators>
        {data.map((_, idx) => (
          <Indicator
            key={idx}
            active={slide === idx}
            onClick={() => setSlide(idx)}
          />
        ))}
      </Indicators>
    </Carousel>
  );
};
