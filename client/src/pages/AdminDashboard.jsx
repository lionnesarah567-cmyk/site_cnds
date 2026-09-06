import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, LogOut, CheckCircle2, AlertCircle, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';

export const AdminDashboard = () => {
  const { admin, token, logout } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    title_fr: '',
    title_rn: '',
    summary_fr: '',
    summary_rn: '',
    content_fr: '',
    content_rn: '',
    category: 'Dialogue Social',
    image_url: '',
    published_at: new Date().toISOString().split('T')[0],
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await api.getNews({ limit: 50 });
      if (data.news) {
        setNews(data.news);
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Erreur lors du chargement des actualités.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const resetForm = () => {
    setFormData({
      title_fr: '',
      title_rn: '',
      summary_fr: '',
      summary_rn: '',
      content_fr: '',
      content_rn: '',
      category: 'Dialogue Social',
      image_url: '',
      published_at: new Date().toISOString().split('T')[0],
    });
    setEditId(null);
    setIsEditing(false);
  };

  const handleEditClick = (item) => {
    setEditId(item.id);
    setFormData({
      title_fr: item.title_fr || '',
      title_rn: item.title_rn || '',
      summary_fr: item.summary_fr || '',
      summary_rn: item.summary_rn || '',
      content_fr: item.content_fr || '',
      content_rn: item.content_rn || '',
      category: item.category || 'Dialogue Social',
      image_url: item.image_url || '',
      published_at: item.published_at ? item.published_at.split('T')[0] : new Date().toISOString().split('T')[0],
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Confirmer la suppression de cet article ?')) return;

    try {
      const res = await api.deleteNews(id, token);
      if (res.success) {
        setStatus({ type: 'success', message: 'Article supprimé avec succès.' });
        fetchNews();
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Erreur lors de la suppression.' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    try {
      if (editId) {
        const res = await api.updateNews(editId, formData, token);
        if (res.success) {
          setStatus({ type: 'success', message: 'Article mis à jour avec succès.' });
          resetForm();
          fetchNews();
        }
      } else {
        const res = await api.createNews(formData, token);
        if (res.success) {
          setStatus({ type: 'success', message: 'Article publié avec succès.' });
          resetForm();
          fetchNews();
        }
      }
    } catch (err) {
      setStatus({ type: 'error', message: err.message || 'Erreur lors de l\'enregistrement.' });
    }
  };

  return (
    <div className="py-12 bg-cnds-white min-h-[80vh]">
      <div className="wrap">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-cnds-line mb-8 gap-4">
          <div>
            <span className="text-[12px] font-semibold text-cnds-green uppercase tracking-wider block mb-1">
              Tableau de Bord Administrateur
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-cnds-ink">
              Publications du CNDS
            </h1>
            <p className="text-xs text-cnds-ink-soft">
              Session : <strong>{admin?.username || 'admin'}</strong>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                resetForm();
                setIsEditing(!isEditing);
              }}
              className="btn btn-primary text-xs uppercase font-bold tracking-wider"
            >
              {isEditing ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isEditing ? 'Fermer' : 'Nouvel Article'}</span>
            </button>

            <button
              onClick={logout}
              className="btn btn-secondary text-xs uppercase font-bold tracking-wider"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Status Alert */}
        {status.message && (
          <div className={`p-4 rounded-lg mb-6 flex items-center gap-2 text-xs ${status.type === 'success' ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'}`}>
            {status.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-cnds-green shrink-0" /> : <AlertCircle className="w-4 h-4 text-cnds-red shrink-0" />}
            <span>{status.message}</span>
          </div>
        )}

        {/* Form */}
        {isEditing && (
          <div className="bg-cnds-offwhite border border-cnds-line rounded-[14px] p-6 sm:p-8 mb-10">
            <h2 className="font-serif font-semibold text-xl text-cnds-ink mb-6">
              {editId ? 'Modifier l\'actualité' : 'Publier une nouvelle actualité'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cnds-ink mb-1">Titre (Français) *</label>
                  <input
                    type="text"
                    required
                    value={formData.title_fr}
                    onChange={(e) => setFormData({...formData, title_fr: e.target.value})}
                    className="w-full px-3 py-2 bg-cnds-white rounded-md border border-cnds-line text-xs sm:text-sm focus:border-cnds-ink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cnds-ink mb-1">Titre (Kirundi)</label>
                  <input
                    type="text"
                    value={formData.title_rn}
                    onChange={(e) => setFormData({...formData, title_rn: e.target.value})}
                    className="w-full px-3 py-2 bg-cnds-white rounded-md border border-cnds-line text-xs sm:text-sm focus:border-cnds-ink focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cnds-ink mb-1">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 bg-cnds-white rounded-md border border-cnds-line text-xs sm:text-sm focus:border-cnds-ink focus:outline-none"
                  >
                    <option value="Dialogue Social">Dialogue Social</option>
                    <option value="Coopération">Coopération</option>
                    <option value="Ateliers">Ateliers</option>
                    <option value="Assemblée Plénière">Assemblée Plénière</option>
                    <option value="Missions">Missions</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cnds-ink mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.published_at}
                    onChange={(e) => setFormData({...formData, published_at: e.target.value})}
                    className="w-full px-3 py-2 bg-cnds-white rounded-md border border-cnds-line text-xs sm:text-sm focus:border-cnds-ink focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-cnds-ink mb-1">URL Image (optionnel)</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-cnds-white rounded-md border border-cnds-line text-xs sm:text-sm focus:border-cnds-ink focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cnds-ink mb-1">Résumé court *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.summary_fr}
                  onChange={(e) => setFormData({...formData, summary_fr: e.target.value})}
                  className="w-full px-3 py-2 bg-cnds-white rounded-md border border-cnds-line text-xs sm:text-sm focus:border-cnds-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-cnds-ink mb-1">Contenu HTML *</label>
                <textarea
                  required
                  rows={6}
                  value={formData.content_fr}
                  onChange={(e) => setFormData({...formData, content_fr: e.target.value})}
                  className="w-full px-3 py-2 bg-cnds-white rounded-md border border-cnds-line text-xs sm:text-sm font-mono focus:border-cnds-ink focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={resetForm} className="btn btn-secondary text-xs uppercase">
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary text-xs uppercase">
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Table */}
        <div className="border border-cnds-line rounded-[14px] overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-cnds-offwhite border-b border-cnds-line">
                <th className="p-4 font-semibold text-cnds-ink">Titre</th>
                <th className="p-4 font-semibold text-cnds-ink">Catégorie</th>
                <th className="p-4 font-semibold text-cnds-ink">Date</th>
                <th className="p-4 font-semibold text-cnds-ink text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cnds-line">
              {news.map((item) => (
                <tr key={item.id} className="hover:bg-cnds-offwhite/50 transition-colors">
                  <td className="p-4 font-medium text-cnds-ink">{item.title_fr}</td>
                  <td className="p-4 text-cnds-ink-soft">{item.category}</td>
                  <td className="p-4 text-cnds-ink-soft">{item.published_at ? item.published_at.split('T')[0] : '-'}</td>
                  <td className="p-4 text-right space-x-2">
                    <button onClick={() => handleEditClick(item)} className="p-1.5 hover:text-cnds-gold">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDeleteClick(item.id)} className="p-1.5 hover:text-cnds-red">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};
