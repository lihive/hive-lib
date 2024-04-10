import styles from './suite-view.module.css';
import { useBoard } from '../board-provider';
import { Show } from 'solid-js';
import {
  HexCoordinate,
  isMoveMovement,
  isMovePlacement,
  TileMovement,
  TilePlacement
} from '@hive-lib';

export const GridRowLastMove = () => {
  const { lastMove } = useBoard();
  return (
    <div class={styles.rowSpan}>
      <div class={styles.rowText}>Last move</div>
      <Show when={lastMove()} keyed>
        {(lastMove) => {
          return (
            <>
              <Show when={isMovePlacement(lastMove)}>
                <PlacementMove move={lastMove as TilePlacement} />
              </Show>
              <Show when={isMoveMovement(lastMove)}>
                <MovementMove move={lastMove as TileMovement} />
              </Show>
            </>
          );
        }}
      </Show>
    </div>
  );
};

interface PlacementMoveProps {
  move: TilePlacement;
}

const PlacementMove = (props: PlacementMoveProps) => {
  return (
    <div>
      {props.move.tileId} → {coordinateText(props.move.to)}
    </div>
  );
};

interface MovementMoveProps {
  move: TileMovement;
}

const MovementMove = (props: MovementMoveProps) => {
  return (
    <div class={styles.highlightedPurple}>
      {coordinateText(props.move.from)} → {coordinateText(props.move.to)}
    </div>
  );
};

const coordinateText = (coordinate: HexCoordinate) => {
  return `(${coordinate.q}, ${coordinate.r})`;
};
