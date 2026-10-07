import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { acceptInvitation, getInvitation, loginUser, registerUser } from "../services/api";

export default function AcceptInvitation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [hasAccount, setHasAccount] = useState(false);

  useEffect(() => {
    getInvitation(token).then(({ data }) => {
      setInvitation(data);
      setForm((current) => ({ ...current, email: data.email }));
    }).catch((err) => setError(err.response?.data?.message || "Invitation introuvable."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      if (localStorage.getItem("token")) {
        await acceptInvitation(token);
      } else {
        if (hasAccount) {
          const { data } = await loginUser({ email: invitation.email, password: form.password });
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        } else {
          if (form.email.toLowerCase().trim() !== invitation.email.toLowerCase()) {
            throw new Error("Utilisez l'adresse e-mail qui a reçu l'invitation.");
          }
          await registerUser(form);
          const { data } = await loginUser({ email: form.email, password: form.password });
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        }
        await acceptInvitation(token);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Impossible d'accepter l'invitation.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement de l’invitation...</div>;

  return (
    <main className="min-h-screen bg-soft flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg space-y-4">
        <h1 className="text-2xl font-bold text-primary">Invitation au projet</h1>
        {invitation && <p className="text-gray-600">Vous êtes invité(e) à rejoindre <strong>{invitation.projectName}</strong> avec l’adresse {invitation.email}.</p>}
        {!localStorage.getItem("token") && <>
          {!hasAccount && <div className="space-y-3">
            <input required className="w-full p-3 border rounded-lg" placeholder="Prénom" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input required className="w-full p-3 border rounded-lg" placeholder="Nom" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            <input required type="email" className="w-full p-3 border rounded-lg" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>}
          {hasAccount && <input required type="email" readOnly className="w-full p-3 border rounded-lg bg-gray-50" value={invitation?.email || ""} />}
          <input required minLength={8} type="password" className="w-full p-3 border rounded-lg" placeholder="Mot de passe (8 caractères minimum)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="button" className="text-sm text-primary hover:underline" onClick={() => setHasAccount(!hasAccount)}>{hasAccount ? "Créer un compte" : "J’ai déjà un compte"}</button>
        </>}
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        {!invitation && <Link to="/login" className="text-primary underline">Se connecter</Link>}
        {invitation && <button disabled={busy} className="w-full rounded-lg bg-primary py-3 text-white disabled:opacity-50">{busy ? "Validation..." : "Accepter et accéder au tableau de bord"}</button>}
      </form>
    </main>
  );
}
