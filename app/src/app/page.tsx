import * as stylex from '@stylexjs/stylex';
import { MathSkillSelector } from '@/components/MathSkillSelector';

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
      <p>Select advanced math topics to see their prerequisites.</p>
      <MathSkillSelector />
    </div>
  );
}
