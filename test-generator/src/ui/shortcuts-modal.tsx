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
            <div>
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
            <div>Select up/down/left/right</div>
            <div>
              <kbd>↑</kbd>
              <kbd>↓</kbd>
              <kbd>←</kbd>
              <kbd>→</kbd>
            </div>
          </Shortcut>
          <Shortcut>
            <div>Save current selection to test suite</div>
            <div>
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
