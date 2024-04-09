import styles from './shortcuts-modal.module.css';
import { JSX, ParentProps } from 'solid-js';
import { createShortcut } from '@solid-primitives/keyboard';

interface ShortcutsModalProps {
  close: () => void;
}

export const ShortcutsModal = (props: ShortcutsModalProps) => {
  createShortcut(['escape'], props.close);

  return (
    <div class={styles.modalContainer} onClick={props.close}>
      <div class={styles.shortcutsModal}>
        <div class={styles.header}>Keyboard Shortcuts</div>
        <div class={styles.shortcutsGrid}>
          <Shortcut>
            <div>
              <kbd>Bug</kbd> keys
            </div>
            <div class={styles.inlineTight}>
              <kbd title='Ant'>A</kbd>
              <kbd title='Beetle'>B</kbd>
              <kbd title='Grasshopper'>G</kbd>
              <kbd title='Ladybug'>L</kbd>
              <kbd title='Mosquito'>M</kbd>
              <kbd title='Pillbug'>P</kbd>
              <kbd title='Queen'>Q</kbd>
              <kbd title='Spider'>S</kbd>
              <kbd title='Blank Tile'>X</kbd>
            </div>
          </Shortcut>
          <Shortcut>
            <div>Toggle active player color</div>
            <kbd>C</kbd>
          </Shortcut>
          <Shortcut>
            <div>Toggle hex orientation</div>
            <kbd>O</kbd>
          </Shortcut>
          <Shortcut>
            <div>Set top tile bug, toggle tile color</div>
            <kbd>Bug</kbd>
          </Shortcut>
          <Shortcut>
            <div>Add tile (active player's color)</div>
            <div class={styles.inline}>
              <kbd>Shift</kbd>
              <div>+</div>
              <kbd>Bug</kbd>
            </div>
          </Shortcut>
          <Shortcut>
            <div>Remove top tile</div>
            <kbd>-</kbd>
          </Shortcut>
          <Shortcut>
            <div>Set tile as last move (placement)</div>
            <div class={styles.inline}>
              <kbd>Shift</kbd>
              <div>+</div>
              <Mouse />
              <div>tile</div>
            </div>
          </Shortcut>
          <Shortcut>
            <div>Move selected and set as last move</div>
            <div class={styles.inline}>
              <kbd>Shift</kbd>
              <div>+</div>
              <Mouse />
              <div>grid</div>
            </div>
          </Shortcut>
          <Shortcut>
            <div>Clear selected item, clear last move</div>
            <kbd>Esc</kbd>
          </Shortcut>
          <Shortcut>
            <div>Select up/down/left/right</div>
            <div class={styles.inlineTight}>
              <kbd>↑</kbd>
              <kbd>↓</kbd>
              <kbd>←</kbd>
              <kbd>→</kbd>
            </div>
          </Shortcut>
          <Shortcut>
            <div>Save current selection to test suite</div>
            <div class={styles.inlineTight}>
              <kbd>⌘</kbd>
              <kbd>S</kbd>
            </div>
          </Shortcut>
          <Shortcut>
            <div>Show/hide keyboard shortcuts</div>
            <kbd>?</kbd>
          </Shortcut>
        </div>
      </div>
    </div>
  );
};

interface ShortcutProps {
  children: [JSX.Element, JSX.Element];
}

const Shortcut = (props: ParentProps<ShortcutProps>) => {
  return (
    <div class={styles.row}>
      <div class={styles.cell}>{props.children[0]}</div>
      <div class={styles.cell}>{props.children[1]}</div>
    </div>
  );
};

const Mouse = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 320 512'
    width={14}
    height={14}
  >
    <path d='M0 55.2V426c0 12.2 9.9 22 22 22c6.3 0 12.4-2.7 16.6-7.5L121.2 346l58.1 116.3c7.9 15.8 27.1 22.2 42.9 14.3s22.2-27.1 14.3-42.9L179.8 320H297.9c12.2 0 22.1-9.9 22.1-22.1c0-6.3-2.7-12.3-7.4-16.5L38.6 37.9C34.3 34.1 28.9 32 23.2 32C10.4 32 0 42.4 0 55.2z' />
  </svg>
);
