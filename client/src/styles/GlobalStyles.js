import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  :root {
    --sky-blue: #87CEEB;
    --red: #FF6347;
    --yellow: #FFDA63;
    --gray: #B0B0B0;
    --light-gray: #F5F5F5;
    --white: #FFFFFF;
    --text-dark: #333333;
    --text-light: #FFFFFF;
    --text-gray: #777777;

    --transition-speed-fast: 0.3s;
    --transition-speed-medium: 0.5s;
    --transition-speed-slow: 0.8s;
    --easing-standard: ease-in-out;
    --easing-bounce: cubic-bezier(0.68, -0.6, 0.32, 1.6);
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Noto Sans KR', 'Poppins', sans-serif;
  }

  html, body {
    height: 100%;
    overflow: hidden;
  }

  body {
    background-color: #eef1f5;
  }

  .app-container {
    width: 100%;
    height: 100%;
    background-color: var(--white);
    display: flex;
    overflow: hidden;
    position: relative;
  }

  /* Left Panel */
  .left-panel {
    width: 35%;
    height: 100%;
    position: relative;
  }

  .panel-background {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    transition: background-color var(--transition-speed-slow) var(--easing-standard);
    background-color: var(--sky-blue);
    z-index: 0;
    background-image: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0.05) 100%);
  }

  /* Palette Styles */
  .palette-container {
    position: absolute;
    top: 50px;
    left: 60px;
    width: 65px;
    height: 65px;
    z-index: 10;
    filter: drop-shadow(0 5px 10px rgba(0,0,0,0.2));
  }

  .palette {
    width: 100%;
    height: 100%;
    transform-origin: center;
    transition: transform var(--transition-speed-slow) var(--easing-bounce);
  }

  .palette-segment {
    cursor: pointer;
    transition: opacity var(--transition-speed-fast) ease,
                transform var(--transition-speed-fast) ease;
    transform-origin: center;
  }

  .palette-segment:hover {
    opacity: 0.8;
    transform: scale(1.05);
  }

  /* Blob Animation */
  .blob {
    position: absolute;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
    border-radius: 50%;
    z-index: 1;
    filter: blur(15px);
    transition: transform 1s ease-in-out;
    pointer-events: none;
  }

  .blob-1 {
    width: 25vw;
    height: 25vw;
    top: 55%;
    left: -5%;
    animation: float 10s ease-in-out infinite;
  }

  .blob-2 {
    width: 15vw;
    height: 15vw;
    top: 15%;
    left: 60%;
    animation: float 12s ease-in-out infinite 1s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(3deg); }
  }

  /* Right Panel */
  .right-panel {
    width: 65%;
    padding: 50px 60px;
    position: relative;
    background-color: var(--white);
    display: flex;
    flex-direction: column;
  }

  .right-content-container {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px 10px 20px 20px;
    position: relative;
    margin-bottom: 80px;
  }

  .right-content-container::-webkit-scrollbar {
    width: 6px;
  }

  .right-content-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  .right-content-container::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 3px;
  }

  .right-content-container::-webkit-scrollbar-thumb:hover {
    background: #aaa;
  }

  /* Content Transitions */
  .right-content {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 30px;
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--transition-speed-medium) ease,
                visibility 0s linear var(--transition-speed-medium);
    pointer-events: none;
    padding-bottom: 20px;
  }

  .right-content.active {
    opacity: 1;
    visibility: visible;
    transition: opacity var(--transition-speed-medium) ease 0.1s,
                visibility 0s linear 0.1s;
    pointer-events: auto;
  }
`; 