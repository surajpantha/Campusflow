
import { Link } from 'react-router';

function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-slate-900">403</h1>
      <p className="text-slate-600">
        You don't have permission to access this page.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-700"
      >
        Go to dashboard
      </Link>
    </div>
  );
}

export default Unauthorized;
