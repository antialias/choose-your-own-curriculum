import { MathSkillSelector } from '@/components/MathSkillSelector';
import { initI18n } from '@/i18n';

const styles = {
  container: {
    padding: '2rem',
    textAlign: 'center' as const,
  },
};

export default async function Home() {
  const i18n = await initI18n('en');
  return (
    <div style={styles.container}>
      <h1>{i18n.t('curriculumGenerator')}</h1>
      <p>{i18n.t('selectAdvanced')}</p>
      <MathSkillSelector />
    </div>
  );
}
