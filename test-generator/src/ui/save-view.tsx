import styles from './save-view.module.css';
import { TextButton } from './text-button';
import { useGenerator } from '../generator-provider';

interface SaveViewProps {
  close: () => void;
}

export const SaveView = (props: SaveViewProps) => {
  const { cases } = useGenerator();

  const onBack = () => {
    props.close();
  };
  return (
    <>
      <div class={styles.buttons}>
        <TextButton onClick={onBack}>Back</TextButton>
      </div>
      <div class={styles.suiteText}>{JSON.stringify(cases)}</div>
    </>
  );
};
