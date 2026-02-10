"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { IUserDTO, ISubscriptionDTO } from "@/interfaces/interfaces";

interface UserModalProps {
  onClose: () => void;
  onCreated: (user: IUserDTO) => void;
}

export default function UserModal({ onClose, onCreated }: UserModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [subscriptions, setSubscriptions] = useState<ISubscriptionDTO[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    suscriptionId: "",
    endedAt: "",
  });

  useEffect(() => {
    fetch("/api/subscriptions")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener suscripciones");
        return res.json();
      })
      .then((data) => setSubscriptions(data))
      .catch(() => setSubscriptions([]))
      .finally(() => setLoadingSubs(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error al crear usuario");

      const created = await res.json();
      onCreated(created);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 dark:bg-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Nuevo Usuario</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors dark:text-gray-500 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-300">Nombre</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-300">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass}
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-300">Teléfono</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={inputClass}
              placeholder="Opcional"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-300">Suscripción</label>
            {loadingSubs ? (
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-500">
                Cargando suscripciones...
              </div>
            ) : (
              <select
                required
                value={form.suscriptionId}
                onChange={(e) => setForm({ ...form, suscriptionId: e.target.value })}
                className={inputClass}
              >
                <option value="">Seleccionar suscripción</option>
                {subscriptions.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} — {sub.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-300">Fecha de vencimiento</label>
            <input
              type="date"
              required
              value={form.endedAt}
              onChange={(e) => setForm({ ...form, endedAt: e.target.value })}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={submitting || loadingSubs}
            className="mt-2 w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {submitting ? "Creando..." : "Crear Usuario"}
          </button>
        </form>
      </div>
    </div>
  );
}
