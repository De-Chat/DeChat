import {
  type ThemeConfig,
  ComponentStyleConfig,
  extendTheme,
  StyleFunctionProps,
} from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const colorScheme = 'green';
const defaultColor = `${colorScheme}.400`;

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

// THERE ARE 2 STEPS TO BE DONE IN ORDER TO APPLY STYLING TO COMPONENT

// 1. add styling for components
// note that Box and Flex can't be styled
// work around: create a wrapper component, i.e. src/Card.tsx for Box
// Refs:
// how to write theme: https://chakra-ui.com/docs/styled-system/customize-theme#customizing-single-components
// color palette: https://chakra-ui.com/docs/styled-system/theme

const Input: ComponentStyleConfig = {
  defaultProps: {
    colorScheme,
    focusBorderColor: defaultColor,
  },
};

const Checkbox: ComponentStyleConfig = {
  defaultProps: {
    colorScheme,
  },
};

const Button: ComponentStyleConfig = {
  defaultProps: {
    size: 'lg', // default is md
    fontWeight: 'bold',
    colorScheme, // default is gray
  },
};

const Text: ComponentStyleConfig = {
  baseStyle: (props: StyleFunctionProps) => ({
    color: mode('black', 'white')(props),
  }),
};

const Select: ComponentStyleConfig = {
  defaultProps: {
    colorScheme,
    focusBorderColor: defaultColor,
  },
};

// 2. add your styled setting to the following object
const theme = extendTheme({
  config,
  colors: {
    primary: '#1FF48E',
    primaryDark: '#0adb76',
    primaryDarker: '#09c369',
    secondary: '#333639',
    secondaryDark: '#1F1F1F',
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bg: mode('white', 'blackAlpha.900')(props),
        lineHeight: 'base',
      },
    }),
  },
  components: {
    Input,
    Button,
    Checkbox,
    Text,
    Select,
  },
});

export default theme;
