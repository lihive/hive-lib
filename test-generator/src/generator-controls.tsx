import styles from './generator-controls.module.css';
import { createSignal, Match, Show, Switch } from 'solid-js';
import { LoadSuiteView } from './ui/load-suite-view';
import { SaveView } from './ui/save-view';
import { SuiteView } from './ui/suite-view';
import { createShortcut } from '@solid-primitives/keyboard';
import { ShortcutsModal } from './ui/shortcuts-modal';
import { MouseCoordinates } from './mouse-coordinates';
import { LoadBoardView } from './ui/load-board-view';

type ControlsView = 'suite' | 'save' | 'load-suite' | 'load-board';

export const GeneratorControls = () => {
  const [view, setView] = createSignal<ControlsView>('suite');
  const [showShortcuts, setShowShortcuts] = createSignal(false);

  createShortcut(['Shift', '?'], () => {
    setShowShortcuts((show) => !show);
  });

  return (
    <div class={styles.generatorControls}>
      <Switch>
        <Match when={view() === 'suite'}>
          <SuiteView
            loadBoard={() => setView('load-board')}
            loadSuite={() => setView('load-suite')}
          />
        </Match>
        <Match when={view() === 'save'}>
          <SaveView close={() => setView('suite')} />
        </Match>
        <Match when={view() === 'load-board'}>
          <LoadBoardView close={() => setView('suite')} />
        </Match>
        <Match when={view() === 'load-suite'}>
          <LoadSuiteView close={() => setView('suite')} />
        </Match>
      </Switch>
      <Show when={showShortcuts()}>
        <ShortcutsModal close={() => setShowShortcuts(false)} />
      </Show>
      <MouseCoordinates />
    </div>
  );
};
