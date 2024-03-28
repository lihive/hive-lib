import styles from './text-button.module.css';
import { JSX } from 'solid-js';

export const TextButton = (props: JSX.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div {...props} class={styles.textButton}>
      {props.children}
    </div>
  );
};
