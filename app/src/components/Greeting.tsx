import { useTranslation } from 'react-i18next';

type Props = { name: string };

const styles = {
  root: {
    color: 'blue',
  },
};

export function Greeting({ name }: Props) {
  const { t } = useTranslation();
  return <span style={styles.root}>{t('greeting', { name })}</span>;
}
