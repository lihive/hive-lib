import { HexOrientation, HexStack, hexToTransform } from '@hive-lib';
import { useTable } from '../table';

interface StackProps {
  stack: HexStack;
}

export const Stack = (props: StackProps) => {
  const table = useTable();
  return (
    <g
      transform={hexToTransform(
        props.stack.coordinate,
        table.hexSize,
        table.hexOrientation
      )}
    >
      {/*<Tile tile={props.stack.tiles[0]} />*/}
      <RoundedHex />
    </g>
  );
};

function hexCornerOffset(
  orientation: HexOrientation,
  size: number,
  corner: number
) {
  const angle = (2 * Math.PI * (orientation.startAngle + corner)) / 6;
  return {
    x: size * Math.cos(angle),
    y: size * Math.sin(angle)
  };
}

export const RoundedHex = () => {
  const table = useTable();
  const corners = [];
  for (let i = 0; i < 6; ++i) {
    corners.push(hexCornerOffset(table.hexOrientation, table.hexSize, i));
  }
  let d = [
    `M${corners[5].x},${corners[5].y}`,
    ...corners.map(({ x, y }) => `L${x},${y}`)
  ];
  return <path stroke='black' fill='none' d={d.join(' ')} />;
};
