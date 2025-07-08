import { MathSkillSelector } from '@/components/MathSkillSelector';
import i18n from '@/i18n';

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center' as const,
  },
};

export default function Home() {
  return (
    <div style={styles.container}>
      <h1>{i18n.t('curriculumGenerator.title')}</h1>
      <p>{i18n.t('curriculumGenerator.description')}</p>
      <MathSkillSelector />
    </div>
  );
}
