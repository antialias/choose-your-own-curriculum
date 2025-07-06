import * as stylex from '@stylexjs/stylex';

type Props = {name: string};

const styles = stylex.create({
  root: {
    color: 'blue',
  },
});

export function Greeting({name}: Props) {
  return <span {...stylex.props(styles.root)}>Hello {name}</span>;
}
