"use client";

import { useEffect, useState } from "react";
import { IUserDTO } from "@/interfaces/interfaces";
import { Plus, Pencil } from "lucide-react";
import UserModal from "@/components/UserModal";
import UserEditModal from "@/components/UserEditModal";

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  inactive: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const statusDots: Record<string, string> = {
  active: "bg-emerald-500 dark:bg-emerald-400",
  inactive: "bg-red-500 dark:bg-red-400",
};

const statusLabels: Record<string, string> = {
  active: "Activo",
  inactive: "Inactivo",
};

function getDaysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const end = new Date(dateStr.includes("T") ? dateStr : `${dateStr}T00:00:00`);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getExpirationStyle(dateStr: string) {
  const days = getDaysUntil(dateStr);
  if (days <= 0) return { badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", label: "Vencido" };
  if (days <= 3) return { badge: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", label: `${days}d restantes` };
  return null;
}

export default function UsersPage() {
  const [users, setUsers] = useState<IUserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<IUserDTO | null>(null);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener usuarios");
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

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
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Usuarios</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400 dark:text-gray-500">{users.length} registros</span>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            Agregar
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-500">
          No hay usuarios registrados.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider dark:bg-gray-900 dark:text-gray-400">
                <th className="text-left px-5 py-3 font-semibold">Nombre</th>
                <th className="text-left px-5 py-3 font-semibold">Teléfono</th>
                <th className="text-left px-5 py-3 font-semibold">Suscripción</th>
                <th className="text-left px-5 py-3 font-semibold">Estado</th>
                <th className="text-left px-5 py-3 font-semibold">Vencimiento</th>
                <th className="text-left px-5 py-3 font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-indigo-50/40 transition-colors dark:hover:bg-indigo-900/20">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800 dark:text-gray-100">{user.name}</div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{user.phone ?? "—"}</td>
                  <td className="px-5 py-4 text-sm text-gray-600 dark:text-gray-300">{user.suscription?.name ?? "—"}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusDots[user.status]}`}
                      />
                      {statusLabels[user.status]}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 dark:text-gray-500">
                        {new Date(user.endedAt.includes("T") ? user.endedAt : `${user.endedAt}T00:00:00`).toLocaleDateString("es-ES")}
                      </span>
                      {getExpirationStyle(user.endedAt) && (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getExpirationStyle(user.endedAt)!.badge}`}>
                          {getExpirationStyle(user.endedAt)!.label}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="text-gray-400 hover:text-indigo-600 transition-colors dark:text-gray-500 dark:hover:text-indigo-400"
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <UserModal
          onClose={() => setShowModal(false)}
          onCreated={(created) => {
            setUsers((prev) => [...prev, created]);
            setShowModal(false);
          }}
        />
      )}

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdated={(updated) => {
            setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
}
