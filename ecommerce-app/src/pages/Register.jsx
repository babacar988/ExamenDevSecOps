import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api/fakeStoreApi";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);
    try {
      await registerUser(form);
      navigate("/login", { state: { registered: true } });
    } catch {
      setError("L'inscription a échoué. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Créer un compte</h2>

        <label htmlFor="username">Nom d'utilisateur</label>
        <input id="username" value={form.username} onChange={update("username")}
          autoComplete="username" required />

        <label htmlFor="email">E-mail</label>
        <input id="email" type="email" value={form.email} onChange={update("email")}
          autoComplete="email" required />

        <label htmlFor="password">Mot de passe</label>
        <input id="password" type="password" value={form.password} onChange={update("password")}
          autoComplete="new-password" required minLength={6} />

        <label htmlFor="confirm">Confirmer le mot de passe</label>
        <input id="confirm" type="password" value={form.confirm} onChange={update("confirm")}
          autoComplete="new-password" required minLength={6} />

        {error && <p className="error" role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Création..." : "S'inscrire"}
        </button>

        <p className="hint">
          Déjà un compte ? <Link to="/login">Se connecter</Link>
        </p>
      </form>
    </div>
  );
}
