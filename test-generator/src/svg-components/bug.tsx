import { BugId, Color, hexHeight, hexWidth } from '@hive-lib';
import { useTable } from '../table-provider';

interface BugProps {
  bug: BugId;
  color: Color;
}

export const Bug = (props: BugProps) => {
  const [table] = useTable();
  const width = () => hexWidth(table.hexSize);
  const height = () => hexHeight(table.hexSize);
  const x = () => -width() / 2;
  const y = () => -height() / 2;
  return (
    <>
      <use
        href={`#${props.bug}-base`}
        width={width()}
        height={height()}
        x={x()}
        y={y()}
        stroke='none'
        fill={getBugColor(props.bug, props.color)}
      />
      <use
        href={`#${props.bug}-accent`}
        width={width()}
        height={height()}
        x={x()}
        y={y()}
        stroke='none'
        fill={getAccentColor(props.color)}
      />
    </>
  );
};

function getAccentColor(color: Color): string {
  return color === 'b' ? '#222' : 'white';
}

function getBaseColor(color: Color): string {
  return color === 'b' ? 'white' : '#222';
}

function getBugColor(bugLetter: string, color: Color): string {
  switch (bugLetter) {
    case 'A':
      return '#0fa9f0';
    case 'B':
      return '#8779b9';
    case 'G':
      return '#2fbc3d';
    case 'L':
      return '#d72833';
    case 'M':
      return '#a6a6a6';
    case 'P':
      return '#49ad92';
    case 'Q':
      return '#fcb336';
    case 'S':
      return '#9f622d';
  }
  return getBaseColor(color);
}