import * as stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: {
    padding: '2rem',
    textAlign: 'center',
  },
});

export default function Home() {
  return (
    <div {...stylex.props(styles.container)}>
      <h1>Choose Your Own Curriculum</h1>
      <p>Welcome! Scaffold under construction.</p>
    </div>
  );
}
