import { MathSkillSelector } from '@/components/MathSkillSelector';

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center' as const,
  },
};

export default function CurriculumGeneratorPage() {
  return (
    <div style={styles.container}>
      <h1>Curriculum Generator</h1>
      <p>Select advanced math topics to see their prerequisites.</p>
      <MathSkillSelector />
    </div>
  );
}
