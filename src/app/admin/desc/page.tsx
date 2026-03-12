// src/app/admin/desc/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Plus, Trash2, Save, RotateCcw, Check, ChevronDown, ChevronUp, AlertCircle, GripVertical, Eye, Pencil } from 'lucide-react';

interface DescGroup {
  label: string;
  index: string;
  entries: string[];
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export default function DescEditorPage() {
  const [groups, setGroups] = useState<DescGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [expandedGroup, setExpandedGroup] = useState<number | null>(0);
  const [original, setOriginal] = useState<string>('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'group' | 'entry'; gi: number; ei?: number } | null>(null);
  const [focusedEntry, setFocusedEntry] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    fetch('/data/desc-content.json')
      .then(r => r.json())
      .then(data => {
        const g = data.groups ?? [];
        setGroups(g);
        setOriginal(JSON.stringify(g));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const isDirty = JSON.stringify(groups) !== original;

  const save = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/desc-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groups }),
      });
      if (!res.ok) throw new Error();
      setOriginal(JSON.stringify(groups));
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  const reset = () => { setGroups(JSON.parse(original)); setSaveStatus('idle'); };

  const updateGroupLabel = (gi: number, val: string) =>
    setGroups(prev => prev.map((g, i) => i === gi ? { ...g, label: val } : g));

  const addGroup = () => {
    const newIndex = String(groups.length + 1).padStart(2, '0');
    setGroups(prev => [...prev, { label: 'Section Baru', index: newIndex, entries: [''] }]);
    setExpandedGroup(groups.length);
  };

  const removeGroup = (gi: number) => {
    setGroups(prev => prev.filter((_, i) => i !== gi).map((g, i) => ({ ...g, index: String(i + 1).padStart(2, '0') })));
    setExpandedGroup(null);
    setDeleteConfirm(null);
  };

  const moveGroup = (gi: number, dir: -1 | 1) => {
    const next = gi + dir;
    if (next < 0 || next >= groups.length) return;
    setGroups(prev => {
      const arr = [...prev];
      [arr[gi], arr[next]] = [arr[next], arr[gi]];
      return arr.map((g, i) => ({ ...g, index: String(i + 1).padStart(2, '0') }));
    });
    setExpandedGroup(next);
  };

  const updateEntry = (gi: number, ei: number, val: string) =>
    setGroups(prev => prev.map((g, i) => i === gi
      ? { ...g, entries: g.entries.map((e, j) => j === ei ? val : e) }
      : g));

  const addEntry = (gi: number) =>
    setGroups(prev => prev.map((g, i) => i === gi ? { ...g, entries: [...g.entries, ''] } : g));

  const removeEntry = (gi: number, ei: number) => {
    setGroups(prev => prev.map((g, i) => i === gi
      ? { ...g, entries: g.entries.filter((_, j) => j !== ei) }
      : g));
    setDeleteConfirm(null);
  };

  const moveEntry = (gi: number, ei: number, dir: -1 | 1) => {
    setGroups(prev => prev.map((g, i) => {
      if (i !== gi) return g;
      const arr = [...g.entries];
      const next = ei + dir;
      if (next < 0 || next >= arr.length) return g;
      [arr[ei], arr[next]] = [arr[next], arr[ei]];
      return { ...g, entries: arr };
    }));
  };

  const autoResize = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto';
    el.style.height = Math.max(el.scrollHeight, 120) + 'px';
  };

  const totalParagraphs = groups.reduce((sum, g) => sum + g.entries.length, 0);

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ width: '32px', height: '32px', border: '2px solid rgba(255,255,255,0.08)', borderTopColor: 'rgba(255,255,255,0.5)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ color: '#6b7280', fontSize: '0.82rem', margin: 0 }}>Memuat data…</p>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes popIn   { from { opacity:0; transform:scale(0.96); } to { opacity:1; transform:scale(1); } }

        /* ─── Reset box sizing ─── */
        *, *::before, *::after { box-sizing: border-box; }

        /* ─── Textarea ─── */
        .para-textarea {
          width: 100%;
          background: transparent;
          border: none;
          padding: 1rem 1.1rem 1rem;
          color: rgba(255,255,255,0.88);
          font-size: 0.95rem;
          line-height: 1.85;
          resize: none;
          outline: none;
          font-family: inherit;
          overflow: hidden;
          min-height: 120px;
          display: block;
          transition: color 0.2s;
        }
        .para-textarea::placeholder { color: rgba(255,255,255,0.18); font-style: italic; }

        /* ─── Entry card ─── */
        .entry-card {
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 0.75rem;
          border: 1.5px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.015);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .entry-card:focus-within {
          border-color: rgba(255,255,255,0.22);
          box-shadow: 0 0 0 3px rgba(255,255,255,0.04);
        }

        /* ─── Toolbar ─── */
        .entry-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.4rem 0.5rem 0.4rem 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02);
        }

        /* ─── Char count ─── */
        .char-count {
          font-size: 0.62rem;
          color: rgba(255,255,255,0.18);
          padding: 0 1.1rem 0.5rem;
          text-align: right;
          user-select: none;
        }

        /* ─── Icon buttons ─── */
        .tbtn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.3rem;
          border-radius: 5px;
          display: flex;
          align-items: center;
          color: #4b5563;
          transition: color 0.15s, background 0.15s;
          font-family: inherit;
        }
        .tbtn:hover:not(:disabled) { color: #d1d5db; background: rgba(255,255,255,0.07); }
        .tbtn:disabled { opacity: 0.18; cursor: not-allowed; }

        .tbtn-del {
          display: flex; align-items: center; gap: 0.25rem;
          font-size: 0.7rem; padding: 0.28rem 0.5rem;
          border-radius: 5px;
          background: none; border: none; cursor: pointer;
          color: #6b7280; font-family: inherit;
          transition: color 0.15s, background 0.15s;
        }
        .tbtn-del:hover:not(:disabled) { color: #f87171; background: rgba(220,38,38,0.09); }
        .tbtn-del:disabled { opacity: 0.15; cursor: not-allowed; }

        /* ─── Divider ─── */
        .vdiv { width: 1px; height: 14px; background: rgba(255,255,255,0.07); margin: 0 0.2rem; flex-shrink:0; }

        /* ─── Add paragraph button ─── */
        .add-para-btn {
          display: flex; align-items: center; justify-content: center; gap: 0.4rem;
          width: 100%; padding: 0.7rem;
          background: rgba(255,255,255,0.015);
          border: 1.5px dashed rgba(255,255,255,0.09);
          border-radius: 10px; color: #4b5563; font-size: 0.8rem;
          cursor: pointer; transition: all 0.15s; font-family: inherit;
          margin-top: 0.25rem;
        }
        .add-para-btn:hover { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.2); color: #9ca3af; }

        /* ─── FAB save ─── */
        .save-fab {
          position: sticky; bottom: 1.5rem;
          display: flex; justify-content: flex-end;
          margin-top: 2.5rem;
          pointer-events: none;
        }
        .save-fab-btn {
          pointer-events: all;
          display: flex; align-items: center; gap: 0.55rem;
          padding: 0.78rem 1.6rem;
          border-radius: 12px;
          background: #fff; border: none;
          color: #111; font-size: 0.9rem; font-weight: 700;
          cursor: pointer;
          box-shadow: 0 8px 32px rgba(0,0,0,0.65), 0 2px 8px rgba(0,0,0,0.4);
          transition: transform 0.15s, box-shadow 0.15s;
          animation: popIn 0.2s ease;
          font-family: inherit;
        }
        .save-fab-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,0.7); }
        .save-fab-btn:active { transform: translateY(0); }
        .save-fab-btn:disabled { background: rgba(255,255,255,0.25); cursor: not-allowed; transform: none; }

        /* ─── Group card ─── */
        .group-card {
          border-radius: 14px;
          margin-bottom: 0.75rem;
          overflow: hidden;
          border: 1.5px solid rgba(255,255,255,0.07);
          transition: border-color 0.2s, background 0.2s;
        }
        .group-card.open {
          border-color: rgba(255,255,255,0.13);
          background: rgba(255,255,255,0.025);
        }

        .group-header {
          display: flex; align-items: center; gap: 0.65rem;
          padding: 0.95rem 1rem; cursor: pointer; user-select: none;
        }
        .group-header:hover { background: rgba(255,255,255,0.02); }

        .group-body {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 1.1rem;
          animation: slideIn 0.18s ease;
        }

        /* ─── How-to hint ─── */
        .hint-box {
          display: flex; gap: 0.75rem; align-items: flex-start;
          padding: 0.85rem 1rem;
          background: rgba(59,130,246,0.06);
          border: 1px solid rgba(59,130,246,0.15);
          border-radius: 10px;
          margin-bottom: 1.5rem;
          font-size: 0.8rem;
          color: #93c5fd;
          line-height: 1.6;
        }
      `}</style>

      <div style={{ padding: '2rem', maxWidth: '880px' }}>

        {/* ── Delete Modal ── */}
        {deleteConfirm && (
          <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 200, padding: '1rem',
          }}>
            <div style={{
              background: '#1a1a1c', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '18px', padding: '2rem', maxWidth: '360px', width: '100%',
              animation: 'popIn 0.18s ease',
            }}>
              <div style={{ display: 'flex', gap: '0.85rem', marginBottom: '1rem', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(239,68,68,0.12)', borderRadius: '10px', padding: '0.6rem', flexShrink: 0 }}>
                  <AlertCircle size={20} style={{ color: '#f87171', display: 'block' }} />
                </div>
                <div>
                  <h3 style={{ color: '#f1f1f1', fontSize: '1rem', fontWeight: 700, margin: '0 0 0.35rem' }}>
                    {deleteConfirm.type === 'group' ? '🗂 Hapus seluruh section?' : '🗑 Hapus paragraf ini?'}
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.82rem', margin: 0, lineHeight: 1.65 }}>
                    {deleteConfirm.type === 'group'
                      ? 'Semua paragraf di dalamnya akan ikut terhapus dan tidak bisa dikembalikan.'
                      : 'Teks di dalam kotak ini akan dihapus permanen.'}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button onClick={() => setDeleteConfirm(null)} style={{
                  padding: '0.55rem 1.1rem', borderRadius: '9px',
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#d1d5db', fontSize: '0.84rem', cursor: 'pointer', fontFamily: 'inherit',
                }}>Batal, kembali</button>
                <button onClick={() => {
                  if (deleteConfirm.type === 'group') removeGroup(deleteConfirm.gi);
                  else if (deleteConfirm.ei !== undefined) removeEntry(deleteConfirm.gi, deleteConfirm.ei);
                }} style={{
                  padding: '0.55rem 1.1rem', borderRadius: '9px',
                  background: '#dc2626', border: 'none',
                  color: '#fff', fontSize: '0.84rem', cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit',
                }}>Ya, hapus</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Header ── */}
        <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#f1f1f1', margin: '0 0 0.3rem' }}>
              Editor Personal Home Page
            </h1>
            <p style={{ fontSize: '0.78rem', color: '#4b5563', margin: 0 }}>
              {groups.length} section · {totalParagraphs} paragraf total
            </p>
          </div>
          {/* Preview link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 0.9rem', borderRadius: '8px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#9ca3af', fontSize: '0.75rem', textDecoration: 'none',
              transition: 'all 0.15s',
            }}
          >
            <Eye size={13} /> Lihat halaman
          </a>
        </div>

        {/* ── How-to hint ── */}
        <div className="hint-box">
          <span>
            <strong style={{ color: '#bfdbfe' }}>Cara pakai:</strong> Klik nama section untuk membuka isinya.
            Edit teks langsung di dalam kotak. Gunakan tombol <strong style={{ color: '#bfdbfe' }}>↑ ↓</strong> untuk mengatur urutan.
            Jika sudah selesai, klik <strong style={{ color: '#bfdbfe' }}>Simpan Perubahan</strong>.
          </span>
        </div>

        {/* ── Unsaved Banner ── */}
        {isDirty && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.75rem 1rem', borderRadius: '10px',
            background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.22)',
            marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem',
            animation: 'slideIn 0.2s ease',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b', display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontSize: '0.8rem', color: '#fcd34d', fontWeight: 500 }}>Perubahan belum disimpan</span>
            </div>
            <button onClick={reset} style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.32rem 0.7rem', borderRadius: '6px',
              background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
              color: '#6b7280', fontSize: '0.73rem', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <RotateCcw size={11} /> Batalkan semua
            </button>
          </div>
        )}

        {/* ── Save feedback ── */}
        {saveStatus === 'saved' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.75rem 1rem', borderRadius: '10px',
            background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)',
            marginBottom: '1.25rem', fontSize: '0.82rem', color: '#4ade80',
            animation: 'slideIn 0.2s ease',
          }}>
            <Check size={15} /> <strong>Tersimpan!</strong> Halaman sudah diperbarui.
          </div>
        )}
        {saveStatus === 'error' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            padding: '0.75rem 1rem', borderRadius: '10px',
            background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.22)',
            marginBottom: '1.25rem', fontSize: '0.82rem', color: '#f87171',
            animation: 'slideIn 0.2s ease',
          }}>
            <AlertCircle size={15} /> Gagal menyimpan. Periksa koneksi lalu coba lagi.
          </div>
        )}

        {/* ── Groups ── */}
        {groups.map((group, gi) => {
          const isOpen = expandedGroup === gi;
          return (
            <div key={gi} className={`group-card${isOpen ? ' open' : ''}`}>

              {/* Group header */}
              <div
                className="group-header"
                onClick={() => setExpandedGroup(isOpen ? null : gi)}
              >
                {/* Expand caret */}
                <div style={{ color: isOpen ? '#9ca3af' : '#374151', flexShrink: 0, display: 'flex', transition: 'transform 0.2s', transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                  <ChevronDown size={16} />
                </div>

                {/* Index */}
                <span style={{
                  fontFamily: 'monospace', fontSize: '0.6rem',
                  color: 'rgba(255,255,255,0.2)', flexShrink: 0,
                  background: 'rgba(255,255,255,0.04)', borderRadius: '4px',
                  padding: '0.1rem 0.4rem', letterSpacing: '0.06em',
                }}>
                  {group.index}
                </span>

                {/* Editable name */}
                <input
                  value={group.label}
                  onChange={e => { e.stopPropagation(); updateGroupLabel(gi, e.target.value); }}
                  onClick={e => e.stopPropagation()}
                  placeholder="Nama section"
                  style={{
                    flex: 1, background: 'transparent', border: 'none', outline: 'none',
                    fontSize: '0.93rem', fontWeight: 600, color: '#e5e7eb',
                    cursor: 'text', fontFamily: 'inherit',
                  }}
                />

                {/* Count */}
                <span style={{ fontSize: '0.68rem', color: '#374151', flexShrink: 0, background: 'rgba(255,255,255,0.03)', padding: '0.18rem 0.5rem', borderRadius: '4px' }}>
                  {group.entries.length} paragraf
                </span>

                {/* Move up/down */}
                <div style={{ display: 'flex', gap: '0', flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                  <button className="tbtn" onClick={() => moveGroup(gi, -1)} disabled={gi === 0} title="Pindah ke atas">
                    <ChevronUp size={14} />
                  </button>
                  <button className="tbtn" onClick={() => moveGroup(gi, 1)} disabled={gi === groups.length - 1} title="Pindah ke bawah">
                    <ChevronDown size={14} />
                  </button>
                </div>

                {/* Delete section */}
                <button
                  className="tbtn-del"
                  onClick={e => { e.stopPropagation(); setDeleteConfirm({ type: 'group', gi }); }}
                  title="Hapus section"
                >
                  <Trash2 size={12} /> Hapus section
                </button>
              </div>

              {/* Group body */}
              {isOpen && (
                <div className="group-body">

                  <p style={{ fontSize: '0.75rem', color: '#4b5563', margin: '0 0 1rem', lineHeight: 1.6 }}>
                    Setiap kotak di bawah ini adalah <strong style={{ color: '#6b7280' }}>satu paragraf</strong> yang tampil di halaman utama. Klik langsung untuk mengedit.
                  </p>

                  {group.entries.map((entry, ei) => (
                    <div key={ei} className="entry-card">
                      {/* Toolbar */}
                      <div className="entry-toolbar">
                        <span style={{ fontSize: '0.63rem', color: '#374151', letterSpacing: '0.05em', fontWeight: 600 }}>
                          PARAGRAF {ei + 1} / {group.entries.length}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
                          <button className="tbtn" onClick={() => moveEntry(gi, ei, -1)} disabled={ei === 0} title="Pindah ke atas">
                            <ChevronUp size={12} />
                          </button>
                          <button className="tbtn" onClick={() => moveEntry(gi, ei, 1)} disabled={ei === group.entries.length - 1} title="Pindah ke bawah">
                            <ChevronDown size={12} />
                          </button>
                          <div className="vdiv" />
                          <button
                            className="tbtn-del"
                            onClick={() => { if (group.entries.length > 1) setDeleteConfirm({ type: 'entry', gi, ei }); }}
                            disabled={group.entries.length <= 1}
                            title={group.entries.length <= 1 ? 'Section harus punya minimal 1 paragraf' : 'Hapus paragraf'}
                          >
                            <Trash2 size={11} /> Hapus
                          </button>
                        </div>
                      </div>

                      {/* Textarea */}
                      <textarea
                        className="para-textarea"
                        value={entry}
                        onChange={e => { updateEntry(gi, ei, e.target.value); autoResize(e.target); }}
                        onFocus={() => setFocusedEntry(`${gi}-${ei}`)}
                        onBlur={() => setFocusedEntry(null)}
                        ref={el => { if (el) autoResize(el); }}
                        placeholder="Klik di sini dan mulai mengetik paragraf…"
                      />

                      {/* Char count */}
                      <div className="char-count">
                        {entry.length} karakter
                      </div>
                    </div>
                  ))}

                  {/* Add paragraph */}
                  <button className="add-para-btn" onClick={() => addEntry(gi)}>
                    <Plus size={14} />
                    + Tambah paragraf baru di section ini
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* ── Add Section ── */}
        <button
          className="add-para-btn"
          onClick={addGroup}
          style={{ borderRadius: '14px', padding: '1rem', fontSize: '0.84rem', marginTop: '0.25rem', borderWidth: '2px' }}
        >
          <Plus size={15} />
          + Tambah section baru
        </button>

        {/* ── Floating Save ── */}
        {isDirty && (
          <div className="save-fab">
            <button className="save-fab-btn" onClick={save} disabled={saveStatus === 'saving'}>
              {saveStatus === 'saving'
                ? <><span style={{ width: '15px', height: '15px', border: '2px solid rgba(0,0,0,0.3)', borderTopColor: '#000', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Menyimpan…</>
                : <><Save size={15} /> Simpan Perubahan</>
              }
            </button>
          </div>
        )}
      </div>
    </>
  );
}