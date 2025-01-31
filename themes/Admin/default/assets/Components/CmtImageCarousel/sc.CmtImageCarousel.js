import styled from '@emotion/styled';

export const Carousel = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 800px;
  height: 60vh;
  margin: auto;
`;

export const SlideContainer = styled.div`
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  box-shadow: 0 0.5rem 1.25rem #EBF1FF;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  display: ${props => (props.hidden ? 'none' : 'block')};
`;

export const Arrow = styled.div`
  position: absolute;
  filter: drop-shadow(0px 0px 5px #555);
  width: 2rem;
  height: 2rem;
  color: white;
  z-index: 10;
  cursor: pointer;
`;

export const ArrowLeft = styled(Arrow)`
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
`;

export const ArrowRight = styled(Arrow)`
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
`;

export const Indicators = styled.span`
  display: flex;
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
`;

export const Indicator = styled.button`
  background-color: ${props => (props.active ? 'white' : 'rgb(126, 129, 161)')};
  width: 0.2rem;
  height: 0.7rem;
  border-radius: 50%;
  border: none;
  outline: none;
  box-shadow: 0 0.5rem 1.25rem #EBF1FF;
  margin: 0 0.2rem;
  cursor: pointer;
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(234, 240, 255, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
`;
