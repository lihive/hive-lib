import { HexOrientation, hexPath } from '@hive-lib';
import { Accessor, JSX, splitProps } from 'solid-js';

type RoundedHexProps = JSX.PathSVGAttributes<SVGPathElement> & {
  hexSize: number;
  hexOrientation: HexOrientation;
  hexPrecision: number;
  hexPadding?: number | Accessor<number>;
  hexRounding?: number | Accessor<number>;
};

export const RoundedHex = (props: RoundedHexProps) => {
  const [ownProps, rest] = splitProps(props, [
    'hexSize',
    'hexOrientation',
    'hexPadding',
    'hexRounding',
    'hexPrecision'
  ]);
  const d = () => {
    const padding =
      typeof ownProps.hexPadding === 'function'
        ? ownProps.hexPadding()
        : ownProps.hexPadding;
    const rounding =
      typeof ownProps.hexRounding === 'function'
        ? ownProps.hexRounding()
        : ownProps.hexRounding;
    return hexPath(
      ownProps.hexSize - (padding || 0),
      rounding || 0,
      ownProps.hexPrecision
    );
  };
  return <path {...rest} d={d()} />;
};
