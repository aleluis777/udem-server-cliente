"use client";

import { useEffect, useState } from "react";
import { ISubscriptionDTO } from "@/interfaces/interfaces";
import { Plus, Eye, EyeOff } from "lucide-react";
import SubscriptionModal from "@/components/SubscriptionModal";

function formatDate(iso: string) {
  const normalized = iso.includes("T") ? iso : `${iso}T00:00:00`;
  return new Date(normalized).toLocaleDateString("es-ES");
}

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  blocked: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  expired: "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
  canceled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusLabels: Record<string, string> = {
  active: "Activo",
  blocked: "Bloqueado",
  expired: "Expirado",
  canceled: "Cancelado",
};

const statusDots: Record<string, string> = {
  active: "bg-emerald-500 dark:bg-emerald-400",
  blocked: "bg-yellow-500 dark:bg-yellow-400",
  expired: "bg-gray-400 dark:bg-gray-500",
  canceled: "bg-red-500 dark:bg-red-400",
};

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<ISubscriptionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  function fetchSubscriptions() {
    setLoading(true);
    fetch("/api/subscriptions")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener suscripciones");
        return res.json();
      })
      .then((data) => setSubscriptions(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  function togglePassword(id: string) {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-500 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Suscripciones</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 dark:text-gray-500">{subscriptions.length} registros</span>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>
      </div>

      {subscriptions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500">
          No hay suscripciones registradas.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider dark:bg-gray-900 dark:text-gray-400">
                <th className="text-left px-5 py-3 font-semibold">Nombre</th>
                <th className="text-left px-5 py-3 font-semibold">Link</th>
                <th className="text-left px-5 py-3 font-semibold">Correo</th>
                <th className="text-left px-5 py-3 font-semibold">Contraseña</th>
                <th className="text-left px-5 py-3 font-semibold">Estado</th>
                <th className="text-left px-5 py-3 font-semibold">Inicio</th>
                <th className="text-left px-5 py-3 font-semibold">Vencimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-indigo-50/40 transition-colors dark:hover:bg-indigo-900/20">
                  <td className="px-5 py-4 font-medium text-gray-800 dark:text-gray-100">{sub.name}</td>
                  <td className="px-5 py-4">
                    <a
                      href={sub.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline text-sm truncate block max-w-[200px] dark:text-indigo-400"
                    >
                      {sub.link}
                    </a>
                  </td>
                  <td className="px-5 py-4 text-gray-600 text-sm dark:text-gray-300">{sub.email}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-mono dark:text-gray-300">
                        {visiblePasswords.has(sub.id) ? sub.password : "••••••••"}
                      </span>
                      <button
                        onClick={() => togglePassword(sub.id)}
                        className="text-gray-400 hover:text-gray-600 transition-colors dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        {visiblePasswords.has(sub.id) ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[sub.status]}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDots[sub.status]}`} />
                      {statusLabels[sub.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-400 dark:text-gray-500">{formatDate(sub.createdAt)}</td>
                  <td className="px-5 py-4 text-sm text-gray-400 dark:text-gray-500">{formatDate(sub.endedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <SubscriptionModal
          onClose={() => setShowModal(false)}
          onCreated={(created) => {
            setSubscriptions((prev) => [...prev, created]);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
