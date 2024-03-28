import styles from './generator-controls.module.css';
import { createSignal, Match, Show, Switch } from 'solid-js';
import { LoadView } from './ui/load-view';
import { SaveView } from './ui/save-view';
import { SuiteView } from './ui/suite-view';
import { createShortcut } from '@solid-primitives/keyboard';
import { ShortcutsModal } from './ui/shortcuts-modal';

export const GeneratorControls = () => {
  const [view, setView] = createSignal<'suite' | 'save' | 'load'>('suite');
  const [showShortcuts, setShowShortcuts] = createSignal(false);

  createShortcut(['Shift', '?'], () => {
    setShowShortcuts((show) => !show);
  });

  return (
    <div class={styles.generatorControls}>
      <Switch>
        <Match when={view() === 'suite'}>
          <SuiteView
            load={() => setView('load')}
            save={() => setView('save')}
          />
        </Match>
        <Match when={view() === 'save'}>
          <SaveView close={() => setView('suite')} />
        </Match>
        <Match when={view() === 'load'}>
          <LoadView close={() => setView('suite')} />
        </Match>
      </Switch>
      <Show when={showShortcuts()}>
        <ShortcutsModal close={() => setShowShortcuts(false)} />
      </Show>
    </div>
  );
};
