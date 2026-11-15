import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Bell, Globe, LogOut, MapPin, Pencil, Plus, Trash2, User } from "lucide-react";
import { AppLayout } from "../../components/layout/AppLayout";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingState } from "../../components/ui/PageState";
import { useAuth } from "../../context/AuthContext";
import { useFarm } from "../../context/FarmContext";
import { api } from "../../lib/api";
import { cropLabel, formatNumber } from "../../lib/agro";

export const PerfilPage = () => {
  const navigate = useNavigate();
  const { user, loading, updateProfile, logout, refreshUser } = useAuth();
  const {
    farms,
    refresh: refreshFarms,
    loading: farmsLoading,
    setActiveFarmId,
  } = useFarm();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", crop: "", area_ha: "" });
  const [farmError, setFarmError] = useState("");

  useEffect(() => {
    let active = true;
    const loadProfile = async () => {
      try {
        const profile = await api.getProfile();
        if (active) setName(profile.full_name || profile.name || "");
      } catch {
        if (active) setName(user?.full_name || "");
      }
    };
    loadProfile();
    return () => {
      active = false;
    };
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg("");
    setError("");
    try {
      await updateProfile(name.trim());
      setMsg("Perfil atualizado.");
      await refreshUser();
    } catch (err) {
      setError(err.message || "Erro ao atualizar o perfil.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const startEdit = (farm) => {
    setEditingId(farm.id);
    setFarmError("");
    setEditForm({
      name: farm.name || "",
      crop: farm.crop || "",
      area_ha: farm.area_ha ?? "",
    });
  };

  const handleSaveFarm = async (event) => {
    event.preventDefault();
    setFarmError("");
    const area = Number(String(editForm.area_ha).replace(",", "."));
    if (!editForm.name.trim()) {
      setFarmError("O nome da exploração é obrigatório.");
      return;
    }
    if (Number.isNaN(area) || area <= 0) {
      setFarmError("Indique uma área válida em hectares.");
      return;
    }
    try {
      await api.updateFarm(editingId, {
        name: editForm.name.trim(),
        crop: editForm.crop || null,
        area_ha: area,
      });
      setEditingId(null);
      await refreshFarms();
      setMsg("Exploração atualizada.");
      await refreshUser();
    } catch (err) {
      setFarmError(err.message || "Não foi possível atualizar a exploração.");
    }
  };

  const handleDeleteFarm = async (farm) => {
    const confirmed = window.confirm(
      `Eliminar a exploração "${farm.name}"? Esta ação não pode ser anulada.`,
    );
    if (!confirmed) return;
    setFarmError("");
    try {
      await api.deleteFarm(farm.id);
      if (editingId === farm.id) setEditingId(null);
      await refreshFarms();
      setMsg("Exploração eliminada.");
    } catch (err) {
      setFarmError(err.message || "Não foi possível eliminar a exploração.");
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <LoadingState label="A carregar o perfil..." />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <header className="mb-10">
        <p className="mb-1 text-sm text-[var(--color-text-secondary)]">
          Conta e definições
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Perfil
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--color-text-secondary)]">
          Gestão de conta e das suas explorações agrícolas.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-fresh-green)] text-xl font-semibold text-white">
                {(user?.full_name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl font-semibold">
                  {user?.full_name || "Utilizador"}
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {user?.email || "—"}
                </p>
              </div>
            </div>
            <form onSubmit={handleSave} className="p-6 pt-0">
              <label className="mb-1 block text-sm font-medium" htmlFor="profile-name">
                Nome completo
              </label>
              <input
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={120}
                className="mb-4 w-full rounded-lg p-2 ring ring-[#0B3D2E]/70"
              />
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl border border-[#0B3D2E] px-4 py-2 text-sm font-medium text-[#0B3D2E] transition-colors hover:bg-[#0B3D2E]/10 disabled:opacity-60"
              >
                {saving ? "A guardar..." : "Guardar alterações"}
              </button>
              {msg && <p className="mt-2 text-sm text-green-700">{msg}</p>}
              {error && (
                <p className="mt-2 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}
            </form>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-[var(--color-border)] px-6 py-4">
              <div>
                <h3 className="font-display text-lg font-semibold">
                  Minhas explorações
                </h3>
                <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                  Propriedades associadas à conta
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/onboarding")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-primary)] hover:border-[var(--color-fresh-green)]/40"
              >
                <Plus size={16} />
                Nova
              </button>
            </div>

            {farmsLoading ? (
              <div className="p-6">
                <LoadingState label="A carregar explorações..." />
              </div>
            ) : farms.length === 0 ? (
              <EmptyState
                icon={MapPin}
                title="Ainda não tem explorações"
                description="Crie a primeira exploração para começar a usar os dados reais."
                actionLabel="Criar exploração"
                onAction={() => navigate("/onboarding")}
              />
            ) : (
              <div className="divide-y divide-[var(--color-border)]">
                {farms.map((farm) => (
                  <div key={farm.id} className="p-6">
                    {editingId === farm.id ? (
                      <form onSubmit={handleSaveFarm} className="space-y-3">
                        <div>
                          <label className="mb-1 block text-sm font-medium">
                            Nome
                          </label>
                          <input
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm((prev) => ({ ...prev, name: e.target.value }))
                            }
                            required
                            className="w-full rounded-lg p-2 ring ring-[#0B3D2E]/50"
                          />
                        </div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div>
                            <label className="mb-1 block text-sm font-medium">
                              Cultura
                            </label>
                            <input
                              value={editForm.crop}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  crop: e.target.value,
                                }))
                              }
                              className="w-full rounded-lg p-2 ring ring-[#0B3D2E]/50"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-sm font-medium">
                              Área (ha)
                            </label>
                            <input
                              value={editForm.area_ha}
                              onChange={(e) =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  area_ha: e.target.value,
                                }))
                              }
                              inputMode="decimal"
                              required
                              className="w-full rounded-lg p-2 ring ring-[#0B3D2E]/50"
                            />
                          </div>
                        </div>
                        {farmError && (
                          <p className="text-sm text-red-600" role="alert">
                            {farmError}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="submit"
                            className="rounded-xl bg-[#0B3D2E] px-4 py-2 text-sm font-medium text-white"
                          >
                            Guardar
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium"
                          >
                            Cancelar
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)]">
                          <MapPin size={18} className="text-[var(--color-primary)]" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{farm.name}</p>
                          <p className="text-sm text-[var(--color-text-secondary)]">
                            {formatNumber(farm.area_ha)} ha · {cropLabel(farm.crop)}
                            {farm.latitude !== null && farm.longitude !== null
                              ? ` · ${formatNumber(farm.latitude, 4)}, ${formatNumber(farm.longitude, 4)}`
                              : " · sem coordenadas"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setActiveFarmId(farm.id);
                              navigate("/dashboard");
                            }}
                            className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-primary)]"
                          >
                            Abrir
                          </button>
                          <button
                            type="button"
                            onClick={() => startEdit(farm)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-medium"
                          >
                            <Pencil size={14} />
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteFarm(farm)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-[rgba(217,91,80,0.4)] px-3 py-2 text-sm font-medium text-[var(--color-danger)] hover:bg-[rgba(217,91,80,0.08)]"
                          >
                            <Trash2 size={14} />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {farmError && editingId === null && (
              <p className="px-6 pb-4 text-sm text-red-600" role="alert">
                {farmError}
              </p>
            )}
            {msg && <p className="px-6 pb-4 text-sm text-green-700">{msg}</p>}
          </section>

          <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <div className="border-b border-[var(--color-border)] px-6 py-4">
              <h3 className="font-display text-lg font-semibold">Notificações</h3>
              <p className="mt-0.5 text-sm text-[var(--color-text-secondary)]">
                Canais de alerta
              </p>
            </div>
            <div className="divide-y divide-[var(--color-border)]">
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)]">
                    <Bell size={18} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Alertas e relatórios semanais
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-[rgba(116,128,120,0.12)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
                  Não configurado
                </span>
              </div>
            </div>
            <p className="px-6 pb-4 text-xs text-[var(--color-text-secondary)]">
              O envio de notificações ainda não está ligado ao backend.
            </p>
          </section>
        </div>

        <div className="space-y-6">
          <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <div className="border-b border-[var(--color-border)] px-6 py-4">
              <h3 className="font-display text-lg font-semibold">Preferências</h3>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 rounded-xl p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)]">
                  <Globe size={18} className="text-[var(--color-primary)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Idioma</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Português
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/sobre-dados")}
                className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-[var(--color-warm-bg)]"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-warm-bg)]">
                  <User size={18} className="text-[var(--color-primary)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sobre estes dados</p>
                  <p className="text-xs text-[var(--color-text-secondary)]">
                    Fontes, metodologia e limitações
                  </p>
                </div>
              </button>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
            <div className="p-4">
              <button
                className="flex w-full items-center justify-center gap-2 rounded-xl p-3 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-[rgba(217,91,80,0.08)]"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                <span>Terminar sessão</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </AppLayout>
  );
};
