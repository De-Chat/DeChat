declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

declare module '*.jpeg' {
  const content: any;
  export default content;
}

declare module 'react-blockies' {
  import React from 'react';
  interface BlockiesProps {
    seed: string;
    size?: number;
    scale?: number;
    color?: string;
    bgColor?: string;
    spotColor?: string;
    className?: string;
  }
  const Blockies: React.FC<BlockiesProps>;

  export default Blockies;
}
