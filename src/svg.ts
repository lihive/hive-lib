import { CartesianCoordinate } from './types';
import { _M_PI } from './constants';

/**
 * Generate a SVG path data string that represents a hexagon.
 *
 * @remarks
 * The `size` of a hexagon is its width, measured between any two opposing
 * corners. A hexagon with rounded corners can be drawn by passing a positive
 * `rounding` value. The `rounding` value is proportional to the length of the
 * hexagon's edges (the non-rounded portion), where the edge length
 * (`size` - `rounding`) / 2. Therefore the `rounding` value should fall in the
 * range [0, `size`].
 *
 * @param size - The size of the hexagon, in pixels.
 * @param rounding - The amount of corner rounding, in the range [0, `size`].
 * @param precision - The floating point precision to use for numeric values.
 * @returns A string that can be used to define an SVG path.
 *
 * @public
 */
export function hexPath(
  size: number,
  rounding: number,
  precision: number
): string {
  const corners: CartesianCoordinate[] = [];
  for (let i = 0; i < 6; ++i) {
    const angle = (2 * _M_PI * i) / 6;
    corners.push({
      x: size * Math.cos(angle),
      y: size * Math.sin(angle)
    });
  }

  if (rounding === 0) {
    return (
      [
        moveTo(corners[5], precision),
        ...corners.map((corner) => lineTo(corner, precision))
      ].join(' ') + 'z'
    );
  }

  const edgePoints = generateEdgePoints(corners, rounding / 2);
  const pathPoints = groupEdgePointsForPathRendering(edgePoints);
  const commands = convertPathPointGroupsToCommands(pathPoints, precision);
  return commands.join(' ') + 'z';
}

function moveTo(point: CartesianCoordinate, precision: number): string {
  return `M${point.x.toFixed(precision)} ${point.y.toFixed(precision)}`;
}

function lineTo(point: CartesianCoordinate, precision: number): string {
  return `L${point.x.toFixed(precision)} ${point.y.toFixed(precision)}`;
}

function curveTo(
  control: CartesianCoordinate,
  point: CartesianCoordinate,
  precision: number
): string {
  return `Q ${control.x.toFixed(precision)} ${control.y.toFixed(precision)}, ${point.x.toFixed(precision)} ${point.y.toFixed(precision)}`;
}

function toPaddedPair(
  pair: CartesianCoordinate[],
  pad: number
): CartesianCoordinate[] {
  const p0 = pair[0];
  const p1 = pair[1];
  const dx = p1.x - p0.x;
  const dy = p1.y - p0.y;
  const mag = Math.hypot(dx, dy);
  return [
    {
      x: p0.x + (pad * dx) / mag,
      y: p0.y + (pad * dy) / mag
    },
    {
      x: p1.x - (pad * dx) / mag,
      y: p1.y - (pad * dy) / mag
    }
  ];
}

function generateEdgePoints(corners: CartesianCoordinate[], padding: number) {
  const edgePoints = corners.map((corner, index) => {
    const nextCorner =
      index === corners.length - 1 ? corners[0] : corners[index + 1];
    return [corner, ...toPaddedPair([corner, nextCorner], padding)];
  });

  const first = edgePoints[0];
  const last = edgePoints[edgePoints.length - 1];
  return [last, ...edgePoints, first];
}

function groupEdgePointsForPathRendering(
  edgePoints: CartesianCoordinate[][]
): CartesianCoordinate[][] {
  let cPrev: CartesianCoordinate | null = null;
  const groups: CartesianCoordinate[][] = [];
  edgePoints.forEach(([a, b, c]) => {
    if (cPrev) {
      groups.push([cPrev, a, b]);
    }
    cPrev = c;
  });
  return groups;
}

function convertPathPointGroupsToCommands(
  groups: CartesianCoordinate[][],
  precision: number
): string[] {
  let commands: string[] = [];
  const lastIndex = groups.length - 1;
  groups.forEach(([a, b, c], index) => {
    if (index === 0) {
      commands.push(moveTo(a, precision));
    } else {
      commands.push(lineTo(a, precision));
    }
    if (index !== lastIndex) {
      commands.push(curveTo(b, c, precision));
    }
  });
  return commands;
}
