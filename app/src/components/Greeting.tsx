type Props = { name: string };

const styles = {
  root: {
    color: 'blue',
  },
};

export function Greeting({ name }: Props) {
  return <span style={styles.root}>Hello {name}</span>;
}
