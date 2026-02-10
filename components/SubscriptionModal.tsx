"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { ISubscriptionDTO } from "@/interfaces/interfaces";

function addDays(dateStr: string, days: number) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

interface SubscriptionModalProps {
  onClose: () => void;
  onCreated: (subscription: ISubscriptionDTO) => void;
}

export default function SubscriptionModal({ onClose, onCreated }: SubscriptionModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    link: "",
    email: "",
    password: "",
    createdAt: new Date().toISOString().split("T")[0],
  });

  const endedAt = form.createdAt ? addDays(form.createdAt, 14) : "";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, endedAt }),
      });

      if (!res.ok) throw new Error("Error al crear suscripción");

      const created = await res.json();
      onCreated(created);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 dark:bg-gray-800">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">Nueva Suscripción</h2>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="Netflix, Spotify..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-300">Link</label>
            <input
              type="url"
              required
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-300">Correo</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-300">Contraseña</label>
            <input
              type="text"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              placeholder="Contraseña de la suscripción"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-300">Fecha inicio</label>
              <input
                type="date"
                required
                value={form.createdAt}
                onChange={(e) => setForm({ ...form, createdAt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1 dark:text-gray-300">Vencimiento</label>
              <input
                type="date"
                readOnly
                value={endedAt}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          >
            {submitting ? "Creando..." : "Crear Suscripción"}
          </button>
        </form>
      </div>
    </div>
  );
}
