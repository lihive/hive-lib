import { JSX, splitProps } from 'solid-js';
import { hexHeight, hexWidth } from '@hive-lib/hex';

type HexProps = JSX.HTMLAttributes<SVGUseElement> & {
  size: number;
};

export const Hex = (props: HexProps) => {
  const [ownProps, rest] = splitProps(props, ['size']);
  const width = () => hexWidth(ownProps.size);
  const height = () => hexHeight(ownProps.size);
  return (
    <use
      {...rest}
      href='#hex'
      width={width()}
      height={height()}
      x={-width() / 2}
      y={-height() / 2}
    />
  );
};
