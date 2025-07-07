import { MathSkillSelector } from '@/components/MathSkillSelector';

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center' as const,
  },
};

export default function Home() {
  return (
    <div style={styles.container}>
      <h1>Choose Your Own Curriculum</h1>
      <p>Select advanced math topics to see their prerequisites.</p>
      <MathSkillSelector />
    </div>
  );
}
