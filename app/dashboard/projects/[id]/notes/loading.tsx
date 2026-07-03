'use client'
import React from 'react';
import styled from 'styled-components';
import { useTheme } from "next-themes";

const Loader = () => {
  const { resolvedTheme } = useTheme(); // "light" | "dark"

  const mode: "light" | "dark" =
    resolvedTheme === "dark" ? "dark" : "light";

  return (
    <StyledWrapper $mode={mode}>
      <div className="loader">
        <div className="circle circle-1" />
        <div className="circle circle-2" />
        <div className="circle circle-3" />
        <div className="circle circle-4" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $mode: "light" | "dark" }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;

  background-color: ${({ $mode }) =>
    $mode === 'dark' ? '#000000' : '#ffffff'};

  .loader {
    position: relative;
    width: 600px;
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .circle {
    position: absolute;
    border-radius: 50%;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
  }

  .circle-1 {
    width: 60px;
    height: 60px;
    background: ${({ $mode }) =>
      $mode === 'dark'
        ? 'linear-gradient(109.8deg, rgba(52, 248, 35, 0.1855) 0%, rgba(68, 253, 38, 0.196) 100%)'
        : 'linear-gradient(109.8deg, rgba(0, 150, 255, 0.2) 0%, rgba(0, 180, 255, 0.25) 100%)'};
    animation-name: circle-1-animation;
  }

  .circle-3 {
    width: 40px;
    height: 40px;
    background: ${({ $mode }) =>
      $mode === 'dark'
        ? 'linear-gradient(109.8deg, rgba(52, 248, 35, 0.265) 0%, rgba(68, 253, 38, 0.28) 100%)'
        : 'linear-gradient(109.8deg, rgba(0, 150, 255, 0.3) 0%, rgba(0, 180, 255, 0.35) 100%)'};
    animation-name: circle-3-animation;
  }

  .circle-4 {
    width: 20px;
    height: 20px;
    background: ${({ $mode }) =>
      $mode === 'dark'
        ? 'linear-gradient(109.8deg, rgba(52, 248, 35, 0.265) 0%, rgba(68, 253, 38, 0.28) 100%)'
        : 'linear-gradient(109.8deg, rgba(0, 150, 255, 0.3) 0%, rgba(0, 180, 255, 0.35) 100%)'};
    animation-name: circle-4-animation;
  }

  @keyframes circle-1-animation {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  @keyframes circle-2-animation {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  @keyframes circle-3-animation {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  @keyframes circle-4-animation {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
`;

export default Loader;
