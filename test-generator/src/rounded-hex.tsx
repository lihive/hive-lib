import { HexOrientation, hexPath } from '@hive-lib';
import { JSX, splitProps } from 'solid-js';

type RoundedHexProps = JSX.PathSVGAttributes<SVGPathElement> & {
  hexSize: number;
  hexOrientation: HexOrientation;
  hexPrecision: number;
  hexPadding?: number;
  hexRounding?: number;
};

export const RoundedHex = (props: RoundedHexProps) => {
  const [ownProps, rest] = splitProps(props, [
    'hexSize',
    'hexOrientation',
    'hexPadding',
    'hexRounding',
    'hexPrecision'
  ]);
  const d = () =>
    hexPath(
      ownProps.hexSize - (ownProps.hexPadding || 0),
      ownProps.hexRounding || 0,
      ownProps.hexPrecision
    );
  return <path {...rest} d={d()} />;
};
