'use client';
import { useState, useEffect, useCallback } from 'react';
import { LogIn, LogOut, Calendar, Users, MessageSquare, Mail, Package, Plus, Edit, Trash2, Eye, EyeOff, CheckCircle, XCircle, Clock, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

type Tab = 'events' | 'hosts' | 'bookings' | 'contacts' | 'packages';

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('events');

  // Restore the session on refresh instead of forcing another password entry.
  useEffect(() => {
    let active = true;
    fetch('/api/admin/session')
      .then((r) => r.json())
      .then((d) => { if (active && d?.authenticated) setAuthenticated(true); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      if (res.ok) { setAuthenticated(true); setPassword(''); toast.success('Logged in'); }
      else if (res.status === 429) toast.error('Too many attempts. Try again later.');
      else toast.error('Invalid password');
    } catch { toast.error('Error'); }
    setLoading(false);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card rounded-xl p-8 shadow-md max-w-sm w-full">
          <h1 className="font-display text-2xl font-bold text-center mb-6">Admin Panel</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" placeholder="Admin Password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 outline-none" />
            <button type="submit" disabled={loading} className="w-full px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 inline-flex items-center justify-center gap-2">
              <LogIn className="w-4 h-4" /> {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'events', label: 'Events', icon: Calendar },
    { key: 'hosts', label: 'Hosts', icon: Users },
    { key: 'bookings', label: 'Bookings', icon: MessageSquare },
    { key: 'contacts', label: 'Messages', icon: Mail },
    { key: 'packages', label: 'Packages', icon: Package },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-foreground text-background sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm hover:text-accent transition-colors flex items-center gap-1"><ArrowLeft className="w-3 h-3" /> Site</Link>
            <span className="font-display font-bold">BLP Admin</span>
          </div>
          <button onClick={handleLogout} className="text-sm flex items-center gap-1 hover:text-accent"><LogOut className="w-3 h-3" /> Logout</button>
        </div>
      </header>
      <div className="max-w-[1200px] mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setActiveTab(t.key)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === t.key ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-secondary'}`}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>
        {activeTab === 'events' && <AdminEvents />}
        {activeTab === 'hosts' && <AdminHosts />}
        {activeTab === 'bookings' && <AdminBookings />}
        {activeTab === 'contacts' && <AdminContacts />}
        {activeTab === 'packages' && <AdminPackages />}
      </div>
    </div>
  );
}

function AdminEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [hosts, setHosts] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [evRes, hRes] = await Promise.all([fetch('/api/admin/events'), fetch('/api/admin/hosts')]);
      if (evRes.ok) setEvents(await evRes.json());
      if (hRes.ok) setHosts(await hRes.json());
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const togglePublished = async (id: number, current: boolean) => {
    await fetch(`/api/admin/events/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isPublished: !current }) });
    fetchData();
  };

  const toggleSoldOut = async (id: number, current: boolean) => {
    await fetch(`/api/admin/events/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isSoldOut: !current }) });
    fetchData();
  };

  const deleteEvent = async (id: number) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/admin/events/${id}`, { method: 'DELETE' });
    fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-xl font-bold">Events</h2>
        <button onClick={() => { setEditingEvent(null); setShowForm(true); }} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4" /> Add Event</button>
      </div>
      {showForm && <EventForm event={editingEvent} hosts={hosts} onClose={() => { setShowForm(false); setEditingEvent(null); }} onSaved={() => { setShowForm(false); setEditingEvent(null); fetchData(); }} />}
      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="space-y-3">
          {(events ?? []).map((ev: any) => (
            <div key={ev?.id} className="bg-card rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${ev?.isPublished ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <h3 className="font-semibold truncate">{ev?.title ?? ''}</h3>
                </div>
                <p className="text-xs text-muted-foreground">{ev?.category ?? ''} • {ev?.eventDate ? new Date(ev.eventDate).toLocaleDateString('en-US', { timeZone: 'UTC' }) : ''} • {ev?.spotsRemaining ?? 0}/{ev?.spotsTotal ?? 0} spots</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePublished(ev?.id, ev?.isPublished)} className="p-1.5 rounded hover:bg-muted" title={ev?.isPublished ? 'Unpublish' : 'Publish'}>
                  {ev?.isPublished ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-gray-400" />}
                </button>
                <button onClick={() => toggleSoldOut(ev?.id, ev?.isSoldOut)} className={`px-2 py-1 rounded text-xs font-medium ${ev?.isSoldOut ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {ev?.isSoldOut ? 'Sold Out' : 'Available'}
                </button>
                <button onClick={() => { setEditingEvent(ev); setShowForm(true); }} className="p-1.5 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                <button onClick={() => deleteEvent(ev?.id)} className="p-1.5 rounded hover:bg-muted text-destructive"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EventForm({ event, hosts, onClose, onSaved }: { event: any; hosts: any[]; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    title: event?.title ?? '', description: event?.description ?? '', category: event?.category ?? 'Teach Something',
    eventDate: event?.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '',
    startTime: event?.startTime ?? '', endTime: event?.endTime ?? '',
    price: event?.price?.toString() ?? '', spotsTotal: event?.spotsTotal?.toString() ?? '20',
    spotsRemaining: event?.spotsRemaining?.toString() ?? '20', isSoldOut: event?.isSoldOut ?? false,
    isPublished: event?.isPublished ?? true, hostId: event?.hostId?.toString() ?? '',
    imageUrl: event?.imageUrl ?? '', registrationType: event?.registrationType ?? 'blp',
    externalUrl: event?.externalUrl ?? '', contactInfo: event?.contactInfo ?? '',
  });
  const [saving, setSaving] = useState(false);
  const inputClass = 'w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 outline-none';

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const url = event ? `/api/admin/events/${event.id}` : '/api/admin/events';
    const method = event ? 'PUT' : 'POST';
    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      if (res.ok) { toast.success(event ? 'Event updated' : 'Event created'); onSaved(); }
      else { const d = await res.json(); toast.error(d?.error ?? 'Error'); }
    } catch { toast.error('Error'); }
    setSaving(false);
  };

  return (
    <div className="bg-card rounded-xl p-6 mb-6 border border-border">
      <h3 className="font-bold mb-4">{event ? 'Edit Event' : 'New Event'}</h3>
      <form onSubmit={handleSave} className="space-y-3">
        <input placeholder="Title" required value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className={inputClass} />
        <textarea placeholder="Description" rows={3} value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className={`${inputClass} resize-none`} />
        <div className="grid grid-cols-2 gap-3">
          <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className={inputClass}>
            {['Teach Something','Build Something','Wellness & Experiences','Celebrate Something','Bring People Together','Create Something Different'].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" required value={form.eventDate} onChange={(e) => setForm({...form, eventDate: e.target.value})} className={inputClass} />
        </div>
        <div className="grid grid-cols-4 gap-3">
          <input placeholder="Start Time" value={form.startTime} onChange={(e) => setForm({...form, startTime: e.target.value})} className={inputClass} />
          <input placeholder="End Time" value={form.endTime} onChange={(e) => setForm({...form, endTime: e.target.value})} className={inputClass} />
          <input placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className={inputClass} />
          <select value={form.hostId} onChange={(e) => setForm({...form, hostId: e.target.value})} className={inputClass}>
            <option value="">No Host</option>
            {(hosts ?? []).map((h: any) => <option key={h?.id} value={h?.id}>{h?.name ?? ''}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <input placeholder="Spots Total" type="number" value={form.spotsTotal} onChange={(e) => setForm({...form, spotsTotal: e.target.value})} className={inputClass} />
          <input placeholder="Spots Remaining" type="number" value={form.spotsRemaining} onChange={(e) => setForm({...form, spotsRemaining: e.target.value})} className={inputClass} />
          <select value={form.registrationType} onChange={(e) => setForm({...form, registrationType: e.target.value})} className={inputClass}>
            <option value="blp">BLP Registration</option>
            <option value="external">External URL</option>
            <option value="contact">Contact Host</option>
          </select>
        </div>
        <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({...form, imageUrl: e.target.value})} className={inputClass} />
        {form.registrationType === 'external' && <input placeholder="External URL" value={form.externalUrl} onChange={(e) => setForm({...form, externalUrl: e.target.value})} className={inputClass} />}
        {form.registrationType === 'contact' && <input placeholder="Contact Info" value={form.contactInfo} onChange={(e) => setForm({...form, contactInfo: e.target.value})} className={inputClass} />}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({...form, isPublished: e.target.checked})} className="accent-primary" /> Published</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isSoldOut} onChange={(e) => setForm({...form, isSoldOut: e.target.checked})} className="accent-primary" /> Sold Out</label>
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">{saving ? 'Saving...' : 'Save'}</button>
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function AdminHosts() {
  const [hosts, setHosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchHosts = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch('/api/admin/hosts'); if (r.ok) setHosts(await r.json()); } catch {}
    setLoading(false);
  }, []);
  useEffect(() => { fetchHosts(); }, [fetchHosts]);

  const toggleSpotlight = async (id: number, current: boolean) => {
    await fetch(`/api/admin/hosts/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isSpotlight: !current }) });
    fetchHosts();
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-4">Hosts</h2>
      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="space-y-3">
          {(hosts ?? []).map((h: any) => (
            <div key={h?.id} className="bg-card rounded-lg p-4 flex items-center gap-3">
              <div className="flex-1">
                <h3 className="font-semibold">{h?.name ?? ''}</h3>
                <p className="text-xs text-muted-foreground">{h?.email ?? ''} • {h?.eventsHostedCount ?? 0} events hosted</p>
              </div>
              <button onClick={() => toggleSpotlight(h?.id, h?.isSpotlight)} className={`px-3 py-1 rounded text-xs font-medium ${h?.isSpotlight ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                {h?.isSpotlight ? '★ Spotlight' : 'Not Spotlight'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch('/api/admin/bookings'); if (r.ok) setBookings(await r.json()); } catch {}
    setLoading(false);
  }, []);
  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/bookings/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    fetchBookings();
  };

  const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', confirmed: 'bg-green-100 text-green-700', declined: 'bg-red-100 text-red-700' };

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-4">Booking Requests</h2>
      {loading ? <p className="text-muted-foreground">Loading...</p> : (bookings?.length ?? 0) === 0 ? <p className="text-muted-foreground">No bookings yet.</p> : (
        <div className="space-y-3">
          {(bookings ?? []).map((b: any) => (
            <div key={b?.id} className="bg-card rounded-lg overflow-hidden">
              <div className="p-4 flex items-center gap-3 cursor-pointer" onClick={() => setExpanded(expanded === b?.id ? null : b?.id)}>
                {expanded === b?.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                <div className="flex-1">
                  <h3 className="font-semibold">{b?.name ?? ''}</h3>
                  <p className="text-xs text-muted-foreground">{b?.eventType ?? 'No type'} • {b?.preferredDate ? new Date(b.preferredDate).toLocaleDateString('en-US', { timeZone: 'UTC' }) : ''}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[b?.status ?? 'pending'] ?? 'bg-gray-100'}`}>{b?.status ?? 'pending'}</span>
              </div>
              {expanded === b?.id && (
                <div className="px-4 pb-4 pt-0 text-sm space-y-2 border-t border-border mt-0 pt-3">
                  <p><strong>Email:</strong> {b?.email ?? ''} | <strong>Phone:</strong> {b?.phone ?? ''}</p>
                  <p><strong>Guests:</strong> {b?.expectedGuests ?? 'N/A'} | <strong>Vehicles:</strong> {b?.estimatedVehicles ?? 'N/A'}</p>
                  <p><strong>Package:</strong> {b?.packageInterest ?? 'N/A'} | <strong>Experience:</strong> {b?.previousExperience ?? 'N/A'}</p>
                  {b?.eventDescription && <p><strong>Description:</strong> {b.eventDescription}</p>}
                  {b?.ideaDescription && <p><strong>Idea:</strong> {b.ideaDescription}</p>}
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => updateStatus(b?.id, 'confirmed')} className="px-3 py-1 rounded text-xs bg-green-600 text-white">Confirm</button>
                    <button onClick={() => updateStatus(b?.id, 'declined')} className="px-3 py-1 rounded text-xs bg-red-600 text-white">Decline</button>
                    <button onClick={() => updateStatus(b?.id, 'pending')} className="px-3 py-1 rounded text-xs bg-yellow-500 text-white">Pending</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminContacts() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch('/api/admin/contacts'); if (r.ok) setContacts(await r.json()); } catch {}
    setLoading(false);
  }, []);
  useEffect(() => { fetchContacts(); }, [fetchContacts]);

  const markRead = async (id: number) => {
    await fetch(`/api/admin/contacts/${id}`, { method: 'PUT' });
    fetchContacts();
  };

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-4">Contact Messages</h2>
      {loading ? <p className="text-muted-foreground">Loading...</p> : (contacts?.length ?? 0) === 0 ? <p className="text-muted-foreground">No messages.</p> : (
        <div className="space-y-3">
          {(contacts ?? []).map((c: any) => (
            <div key={c?.id} className={`bg-card rounded-lg p-4 ${!c?.isRead ? 'border-l-4 border-primary' : ''}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{c?.name ?? ''} <span className="text-muted-foreground font-normal text-xs">({c?.email ?? ''})</span></h3>
                  {c?.reason && <p className="text-xs text-accent font-medium">{c.reason}</p>}
                  <p className="text-sm text-muted-foreground mt-1">{c?.message ?? ''}</p>
                  <p className="text-xs text-muted-foreground mt-1">{c?.createdAt ? new Date(c.createdAt).toLocaleString('en-US', { timeZone: 'UTC' }) : ''}</p>
                </div>
                {!c?.isRead && <button onClick={() => markRead(c?.id)} className="px-2 py-1 rounded text-xs bg-primary text-primary-foreground">Mark Read</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdminPackages() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchPkgs = useCallback(async () => {
    setLoading(true);
    try { const r = await fetch('/api/packages'); if (r.ok) setPackages(await r.json()); } catch {}
    setLoading(false);
  }, []);
  useEffect(() => { fetchPkgs(); }, [fetchPkgs]);

  const [editing, setEditing] = useState<any>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', priceDisplay: '', features: '' });

  const startEdit = (pkg: any) => {
    setEditing(pkg?.id);
    setEditForm({
      name: pkg?.name ?? '',
      description: pkg?.description ?? '',
      priceDisplay: pkg?.priceDisplay ?? '',
      features: Array.isArray(pkg?.features) ? (pkg.features as string[]).join('\n') : '',
    });
  };

  const saveEdit = async () => {
    if (!editing) return;
    await fetch(`/api/admin/packages/${editing}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...editForm, features: editForm.features.split('\n').filter(Boolean) }),
    });
    setEditing(null);
    fetchPkgs();
  };

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-primary/30 outline-none';

  return (
    <div>
      <h2 className="font-display text-xl font-bold mb-4">Packages</h2>
      {loading ? <p className="text-muted-foreground">Loading...</p> : (
        <div className="space-y-3">
          {(packages ?? []).map((p: any) => (
            <div key={p?.id} className="bg-card rounded-lg p-4">
              {editing === p?.id ? (
                <div className="space-y-2">
                  <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className={inputClass} />
                  <input value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})} className={inputClass} />
                  <input value={editForm.priceDisplay} onChange={(e) => setEditForm({...editForm, priceDisplay: e.target.value})} className={inputClass} />
                  <textarea value={editForm.features} onChange={(e) => setEditForm({...editForm, features: e.target.value})} rows={4} placeholder="One feature per line" className={`${inputClass} resize-none`} />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="px-3 py-1 rounded text-xs bg-primary text-primary-foreground">Save</button>
                    <button onClick={() => setEditing(null)} className="px-3 py-1 rounded text-xs bg-muted text-muted-foreground">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{p?.name ?? ''}</h3>
                    <p className="text-xs text-muted-foreground">{p?.description ?? ''}</p>
                    <p className="text-xs text-accent font-medium mt-1">{p?.priceDisplay ?? ''}</p>
                  </div>
                  <button onClick={() => startEdit(p)} className="p-1.5 rounded hover:bg-muted"><Edit className="w-4 h-4" /></button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
