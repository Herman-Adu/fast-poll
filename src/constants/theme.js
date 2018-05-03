const white = '#ffffff';
const blue = '#08aeea';
const green = '#2af598';
const purple = '#A213E5';
const black = '#3D3131';
const lightGray = '#E5E5E5';
const darkGray = '#8C8E9B';
const red = '#FF2525';

const primaryGradient = `linear-gradient(100deg, ${blue} 0%, ${green} 100%)`;
const secondaryGradient = `linear-gradient(100deg, ${blue} 0%, ${purple} 100%)`;

export default {
  fonts: {
    heading: `'Lato', sans-serif`,
    default: `'Open Sans', sans-serif`,
  },
  colors: {
    white,
    blue,
    green,
    purple,
    black,
    lightGray,
    darkGray,
    primary: green,
    secondary: blue,
    positive: green,
    negative: red,
  },
  gradients: {
    primary: primaryGradient,
    secondary: secondaryGradient,
    positive: primaryGradient,
    negative: `linear-gradient(100deg, ${red} 33%, ${purple} 100%)`,
  },
};