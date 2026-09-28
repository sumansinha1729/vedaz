import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { validateUsername } from '../utils/validation';
import { USERNAME_MAX_LENGTH } from '../utils/constants';
import Button from '../components/ui/Button';
import Logo from '../components/ui/Logo';

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await login(username.trim());
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <Logo size="lg" />
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Welcome to Relay</h1>
          <p className="mt-1.5 text-sm text-muted">Pick a username to join the conversation.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-line bg-surface p-6 shadow-sm"
        >
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (error) setError(null);
            }}
            placeholder="e.g. ravi_kumar"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            autoFocus
            maxLength={USERNAME_MAX_LENGTH}
            aria-invalid={Boolean(error)}
            aria-describedby="username-help"
            className={`mt-2 h-11 w-full rounded-xl border bg-app px-3.5 text-base outline-none transition placeholder:text-muted/70 focus:ring-4 ${
              error
                ? 'border-danger focus:ring-danger/15'
                : 'border-line focus:border-primary focus:ring-primary/15'
            }`}
          />
          <p
            id="username-help"
            role={error ? 'alert' : undefined}
            className={`mt-2 text-xs ${error ? 'text-danger' : 'text-muted'}`}
          >
            {error ?? '3–20 characters: letters, numbers and underscores.'}
          </p>

          <Button type="submit" loading={submitting} className="mt-5 w-full">
            {submitting ? 'Joining…' : 'Join chat'}
            {!submitting && <ArrowRight className="size-4" aria-hidden="true" />}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted">
          No password needed. Your username is your identity.
        </p>
      </div>
    </main>
  );
}
