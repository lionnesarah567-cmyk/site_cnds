import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.login({ username, password });
      if (data.token && data.admin) {
        login(data.token, data.admin);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Identifiants invalides');
      }
    } catch (err) {
      setError(err.message || 'Échec de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-cnds-offwhite">
      <div className="max-w-md w-full bg-cnds-white p-8 sm:p-10 rounded-[14px] border border-cnds-line shadow-xs space-y-6">
        
        <div className="text-center">
          <div className="w-16 h-20 rounded-xl bg-white border border-cnds-line p-1 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <img
              src="/images/logo-cnds.jpg"
              alt="Logo CNDS"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="font-serif font-semibold text-2xl text-cnds-ink">
            Espace d'Administration
          </h2>
          <p className="text-xs text-cnds-ink-soft mt-1">
            Gestion sécurisée des publications officielles
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-cnds-red" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cnds-ink mb-1.5">
              Identifiant / Email
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cnds-ink-soft" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-9 pr-3 py-2 bg-cnds-offwhite rounded-md border border-cnds-line text-xs sm:text-sm text-cnds-ink focus:border-cnds-ink focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-cnds-ink mb-1.5">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cnds-ink-soft" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2 bg-cnds-offwhite rounded-md border border-cnds-line text-xs sm:text-sm text-cnds-ink focus:border-cnds-ink focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full text-xs uppercase font-bold tracking-wider"
          >
            {loading ? 'Connexion en cours...' : 'Se Connecter'}
          </button>
        </form>

        <div className="text-center pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-cnds-ink-soft hover:text-cnds-ink transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retour au site public</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
