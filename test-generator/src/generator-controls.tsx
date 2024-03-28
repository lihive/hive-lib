import styles from './generator-controls.module.css';
import { createSignal, Match, Switch } from 'solid-js';
import { LoadView } from './ui/load-view';
import { SaveView } from './ui/save-view';
import { SuiteView } from './ui/suite-view';

export const GeneratorControls = () => {
  const [view, setView] = createSignal<'default' | 'save' | 'load'>('default');

  return (
    <div class={styles.generatorControls}>
      <Switch>
        <Match when={view() === 'save'}>
          <SaveView close={() => setView('default')} />
        </Match>
        <Match when={view() === 'load'}>
          <LoadView close={() => setView('default')} />
        </Match>
        <Match when={view() === 'default'}>
          <SuiteView
            load={() => setView('load')}
            save={() => setView('save')}
          />
        </Match>
      </Switch>
    </div>
  );
};
