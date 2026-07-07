import { useState } from "react";
import { History, Pencil, Trash2 } from "lucide-react";
import { getCategoryStyle } from "../utils/categories";
import SessionEditModal from "./SessionEditModal";

export default function SessionHistory({ sessions, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    if (!window.confirm("Delete this session? Daily score will be recalculated.")) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="card">
      <div className="mb-4 flex items-center gap-2">
        <History size={18} className="text-brand-600" />
        <h2 className="text-lg font-semibold">Recent Sessions</h2>
      </div>

      {sessions.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">No sessions logged yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700">
              <tr>
                <th className="px-2 py-2">Date</th>
                <th className="px-2 py-2">Category</th>
                <th className="px-2 py-2">Minutes</th>
                <th className="px-2 py-2">Quality</th>
                <th className="px-2 py-2">Difficulty</th>
                <th className="px-2 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => {
                const style = getCategoryStyle(session.category);
                return (
                  <tr key={session.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="px-2 py-3 whitespace-nowrap">
                      {new Date(session.started_at).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${style.badge}`}>
                        {style.label}
                      </span>
                    </td>
                    <td className="px-2 py-3">{session.duration_minutes}</td>
                    <td className="px-2 py-3">{session.quality_rating}</td>
                    <td className="px-2 py-3 capitalize">{session.difficulty}</td>
                    <td className="px-2 py-3">
                      <div className="flex justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setEditing(session)}
                          className="btn-ghost p-2"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(session.id)}
                          disabled={deletingId === session.id}
                          className="btn-ghost p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing ? (
        <SessionEditModal
          session={editing}
          onClose={() => setEditing(null)}
          onSave={async (id, payload) => {
            await onUpdate(id, payload);
            setEditing(null);
          }}
        />
      ) : null}
    </section>
  );
}
