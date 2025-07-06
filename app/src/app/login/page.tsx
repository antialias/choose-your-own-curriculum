import * as stylex from '@stylexjs/stylex';
import { LoginButton } from '@/components/LoginButton';

const styles = stylex.create({
  container: {
    padding: '2rem',
    textAlign: 'center',
  },
});

export default function LoginPage() {
  return (
    <div {...stylex.props(styles.container)}>
      <h1>Login</h1>
      <LoginButton />
    </div>
  );
}
