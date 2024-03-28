import styles from './suite-view.module.css';
import { Color, HexCoordinate, hexCoordinateKey, hexesEqual } from '@hive-lib';
import { useTable } from '../table-provider';
import { useBoard } from '../board-provider';
import { TextButton } from './text-button';
import { useGenerator } from '../generator-provider';

export interface ValidMoveSet {
  color: Color;
  target: HexCoordinate;
  valid: HexCoordinate[];
}

interface GridRowValidMoveSetProps {
  board: string;
  validMoveSet: ValidMoveSet;
}

export const GridRowValidMoveSet = (props: GridRowValidMoveSetProps) => {
  const { table, setSelectedCoordinate } = useTable();
  const { setPlayerColor } = useBoard();
  const { deleteTarget } = useGenerator();

  const isActiveCase = () =>
    hexesEqual(table.selectedCoordinate, props.validMoveSet.target);

  const classList = () => ({
    [styles.validMoveSet]: true,
    [styles.bold]: isActiveCase()
  });

  const labelText = () =>
    `${props.validMoveSet.color} (${props.validMoveSet.target.q}, ${props.validMoveSet.target.r}) ${props.validMoveSet.valid.length} valid moves`;

  const onClickTarget = () => {
    setPlayerColor(props.validMoveSet.color);
    setSelectedCoordinate(props.validMoveSet.target);
  };

  const onClickDelete = () => {
    deleteTarget(
      props.board,
      props.validMoveSet.color,
      hexCoordinateKey(props.validMoveSet.target)
    );
  };

  return (
    <>
      <div classList={classList()} onClick={onClickTarget}>
        {labelText()}
      </div>
      <TextButton onClick={onClickDelete}>x</TextButton>
    </>
  );
};
