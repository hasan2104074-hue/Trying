import { useEffect, useRef, useState } from 'react';
import { Camera, Check, Palette, Plus, Sparkles, UserCheck, Users } from 'lucide-react';
import type { UserProfile } from '../types';
import { COVER_GRADIENT_PRESETS } from '../utils/pureLogic';
import { Avatar, CloseButton, Modal, SectionLabel, cn } from './Primitives';

function compressImageFile(file: File, maxDim = 360): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(String(reader.result));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.86));
      };
      img.onerror = reject;
      img.src = String(reader.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

interface Props {
  open: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  allProfiles: UserProfile[];
  onSaveProfile: (profile: UserProfile) => void;
  onSwitchUser: (userId: string) => void;
}

export function ProfileSettingsModal({
  open,
  onClose,
  currentUser,
  allProfiles,
  onSaveProfile,
  onSwitchUser,
}: Props) {
  const [mode, setMode] = useState<'edit' | 'create' | 'switch'>('edit');
  const [name, setName] = useState('');
  const [nameBn, setNameBn] = useState('');
  const [handle, setHandle] = useState('');
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [focusArea, setFocusArea] = useState('');
  const [website, setWebsite] = useState('');
  const [avatar, setAvatar] = useState('');
  const [coverGradient, setCoverGradient] = useState(COVER_GRADIENT_PRESETS[0].css);
  const [customStop1, setCustomStop1] = useState('#04301f');
  const [customStop2, setCustomStop2] = useState('#38b17e');
  const [customAngle, setCustomAngle] = useState(135);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    if (currentUser && mode === 'edit') {
      setName(currentUser.name);
      setNameBn(currentUser.nameBn);
      setHandle(currentUser.handle);
      setRole(currentUser.role);
      setOrganization(currentUser.organization);
      setLocation(currentUser.location);
      setBio(currentUser.bio);
      setFocusArea(currentUser.focusArea);
      setWebsite(currentUser.website ?? '');
      setAvatar(currentUser.avatar);
      setCoverGradient(currentUser.coverGradient || COVER_GRADIENT_PRESETS[0].css);
    } else if (!currentUser || mode === 'create') {
      setMode('create');
      setName('');
      setNameBn('');
      setHandle('');
      setRole('');
      setOrganization('');
      setLocation('');
      setBio('');
      setFocusArea('');
      setWebsite('');
      setAvatar('');
      setCoverGradient(COVER_GRADIENT_PRESETS[0].css);
    }
  }, [open, currentUser, mode]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await compressImageFile(file, 360);
    setAvatar(dataUrl);
  };

  const applyCustomGradient = (c1: string, c2: string, deg: number) => {
    setCustomStop1(c1);
    setCustomStop2(c2);
    setCustomAngle(deg);
    setCoverGradient(`linear-gradient(${deg}deg, ${c1} 0%, ${c2} 100%)`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const cleanHandle =
      handle.trim().replace(/^@/, '') ||
      name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '.') + '.' + Math.floor(Math.random() * 90 + 10);
    const initials = name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    const profile: UserProfile =
      mode === 'edit' && currentUser
        ? {
            ...currentUser,
            name: name.trim(),
            nameBn: nameBn.trim() || name.trim(),
            handle: cleanHandle,
            role: role.trim(),
            organization: organization.trim(),
            location: location.trim(),
            bio: bio.trim(),
            focusArea: focusArea.trim(),
            website: website.trim(),
            avatar: avatar.trim() || initials || 'PS',
            coverGradient,
          }
        : {
            id: `u-${Date.now().toString(36)}`,
            name: name.trim(),
            nameBn: nameBn.trim() || name.trim(),
            handle: cleanHandle,
            role: role.trim() || 'Agri-Tech Researcher',
            organization: organization.trim() || 'Plainsyt Community',
            location: location.trim() || 'Bangladesh',
            bio: bio.trim(),
            focusArea: focusArea.trim(),
            website: website.trim(),
            avatar: avatar.trim() || initials || 'PS',
            coverGradient,
            isVerified: true,
            publicationsCount: 0,
            followersCount: 0,
            followingCount: 0,
            createdAt: new Date().toISOString(),
          };

    onSaveProfile(profile);
    onClose();
  };

  const inputCls =
    'w-full rounded-lg border border-pine-900/25 bg-canvas-card px-3 py-2 text-[14px] text-pine-900 outline-none placeholder:text-pine-900/40 focus:border-pine-900';

  return (
    <Modal open={open} onClose={onClose} className="max-w-[680px]" labelledBy="profile-settings-title">
      <div className="overflow-hidden rounded-t-2xl border border-pine-900 bg-canvas shadow-tactile-lg sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-pine-900 bg-canvas-card px-5 py-3.5">
          <div>
            <h2 id="profile-settings-title" className="font-display text-[21px] font-semibold text-pine-900">
              Profile &amp; Appearance Settings
            </h2>
            <p className="font-mono text-[10.5px] text-pine-600">
              Stored directly in Supabase · public.profiles
            </p>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        {/* Mode Tabs */}
        <div className="flex gap-1.5 border-b border-canvas-border bg-canvas-subtle px-5 py-2">
          {currentUser && (
            <button
              type="button"
              onClick={() => setMode('edit')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition',
                mode === 'edit' ? 'bg-pine-900 text-canvas' : 'text-pine-900/70 hover:bg-canvas-card',
              )}
            >
              <UserCheck className="size-3.5" /> Edit Current Profile
            </button>
          )}
          <button
            type="button"
            onClick={() => setMode('create')}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition',
              mode === 'create' ? 'bg-pine-900 text-canvas' : 'text-pine-900/70 hover:bg-canvas-card',
            )}
          >
            <Plus className="size-3.5" /> Create New Profile
          </button>
          {allProfiles.length > 0 && (
            <button
              type="button"
              onClick={() => setMode('switch')}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-semibold transition',
                mode === 'switch' ? 'bg-pine-900 text-canvas' : 'text-pine-900/70 hover:bg-canvas-card',
              )}
            >
              <Users className="size-3.5" /> Switch Profile ({allProfiles.length})
            </button>
          )}
        </div>

        {mode === 'switch' ? (
          <div className="max-h-[70vh] space-y-2.5 overflow-y-auto p-5">
            <SectionLabel>Select Active Profile (Supabase public.profiles)</SectionLabel>
            {allProfiles.map((p) => {
              const active = currentUser?.id === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    onSwitchUser(p.id);
                    onClose();
                  }}
                  className={cn(
                    'flex w-full items-center gap-3.5 rounded-xl border p-3 text-left transition',
                    active
                      ? 'border-pine-900 bg-pine-50 shadow-tactile-xs'
                      : 'border-canvas-border bg-canvas-card hover:border-pine-900',
                  )}
                >
                  <Avatar src={p.avatar} name={p.name} size="size-12" online={active} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-pine-900">
                      {p.name} <span className="font-bangla font-normal text-pine-900/60">({p.nameBn})</span>
                    </p>
                    <p className="truncate font-mono text-[11px] text-pine-600">
                      @{p.handle} · {p.role} {p.organization ? `· ${p.organization}` : ''}
                    </p>
                  </div>
                  {active && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-pine-900 px-2.5 py-1 font-mono text-[10px] font-semibold text-canvas">
                      <Check className="size-3" /> Active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-h-[76vh] space-y-5 overflow-y-auto p-5">
            {/* Live Cover Gradient + Avatar Preview */}
            <div className="overflow-hidden rounded-xl border border-pine-900 bg-canvas-card shadow-tactile-sm">
              <div
                style={{ background: coverGradient }}
                className="relative h-28 w-full transition-all duration-300"
              >
                <span className="absolute right-3 top-3 rounded-md bg-black/45 px-2 py-0.5 font-mono text-[10px] text-white backdrop-blur-sm">
                  Live Cover Preview
                </span>
              </div>
              <div className="-mt-11 flex flex-wrap items-end justify-between gap-3 px-4 pb-4">
                <div className="flex items-end gap-3">
                  <div className="relative">
                    <Avatar
                      src={avatar || (name ? name.slice(0, 2).toUpperCase() : 'PS')}
                      name={name}
                      size="size-20"
                      className="rounded-full border-4 border-canvas-card shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      aria-label="Upload profile picture"
                      className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full border border-pine-900 bg-pine-900 text-canvas shadow hover:bg-pine-700"
                    >
                      <Camera className="size-4" />
                    </button>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="pb-1">
                    <p className="font-display text-[19px] font-bold leading-tight text-pine-950">
                      {name || 'Your Name'}
                    </p>
                    <p className="font-mono text-[11px] text-pine-600">
                      {role || 'Role / Designation'} {organization ? `· ${organization}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-pine-900 bg-canvas-subtle px-3 text-[12px] font-semibold text-pine-900 hover:bg-pine-100"
                >
                  <Camera className="size-3.5" /> Upload PFP Photo
                </button>
              </div>
            </div>

            {/* PFP URL input */}
            <div>
              <SectionLabel className="mb-1.5">Profile Picture URL (or upload above)</SectionLabel>
              <input
                value={avatar.startsWith('data:') ? '' : avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder={avatar.startsWith('data:') ? 'Custom uploaded photo active (paste URL to override)' : 'https://...'}
                className={inputCls}
              />
            </div>

            {/* Cover Background Gradient Picker */}
            <div className="rounded-xl border border-canvas-border bg-canvas-card p-3.5">
              <div className="mb-2.5 flex items-center justify-between">
                <SectionLabel className="flex items-center gap-1.5">
                  <Palette className="size-3.5" /> Cover Background Gradient Color
                </SectionLabel>
                <span className="font-mono text-[10px] text-pine-600">12 Presets + Custom Builder</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {COVER_GRADIENT_PRESETS.map((g) => {
                  const selected = coverGradient === g.css;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setCoverGradient(g.css)}
                      className={cn(
                        'group relative h-12 overflow-hidden rounded-lg border text-left transition',
                        selected ? 'border-pine-900 ring-2 ring-pine-600' : 'border-pine-900/20',
                      )}
                      style={{ background: g.css }}
                    >
                      <span className="absolute inset-x-1.5 bottom-1 truncate rounded bg-black/45 px-1 py-0.5 font-mono text-[9px] text-white backdrop-blur-[1px]">
                        {g.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Custom 2-stop color picker */}
              <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-canvas-border pt-3">
                <span className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-pine-900">
                  <Sparkles className="size-3.5 text-pine-600" /> Custom Gradient:
                </span>
                <label className="inline-flex items-center gap-1.5 text-[12px] text-pine-900">
                  Start
                  <input
                    type="color"
                    value={customStop1}
                    onChange={(e) => applyCustomGradient(e.target.value, customStop2, customAngle)}
                    className="size-7 cursor-pointer rounded border border-pine-900/30 bg-transparent"
                  />
                </label>
                <label className="inline-flex items-center gap-1.5 text-[12px] text-pine-900">
                  End
                  <input
                    type="color"
                    value={customStop2}
                    onChange={(e) => applyCustomGradient(customStop1, e.target.value, customAngle)}
                    className="size-7 cursor-pointer rounded border border-pine-900/30 bg-transparent"
                  />
                </label>
                <select
                  value={customAngle}
                  onChange={(e) => applyCustomGradient(customStop1, customStop2, Number(e.target.value))}
                  className="rounded-md border border-pine-900/25 bg-canvas px-2 py-1 font-mono text-[11px] text-pine-900"
                >
                  <option value={135}>135° Diagonal</option>
                  <option value={90}>90° Horizontal</option>
                  <option value={180}>180° Vertical</option>
                  <option value={45}>45° Tilt</option>
                </select>
              </div>
            </div>

            {/* Identity Fields */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <SectionLabel className="mb-1">Full Name (English) *</SectionLabel>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Farhana Yasmin"
                  className={inputCls}
                />
              </div>
              <div>
                <SectionLabel className="mb-1">নাম (বাংলায়)</SectionLabel>
                <input
                  value={nameBn}
                  onChange={(e) => setNameBn(e.target.value)}
                  placeholder="যেমন: ড. ফারহানা ইয়াসমিন"
                  className={cn(inputCls, 'font-bangla')}
                />
              </div>
              <div>
                <SectionLabel className="mb-1">Designation / Role</SectionLabel>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Chief Scientific Officer"
                  className={cn(inputCls, 'font-bangla')}
                />
              </div>
              <div>
                <SectionLabel className="mb-1">Organization / Institution</SectionLabel>
                <input
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="e.g. BRRI · BAU · BARI · SAU"
                  className={inputCls}
                />
              </div>
              <div>
                <SectionLabel className="mb-1">Username Handle</SectionLabel>
                <input
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="farhana.brri"
                  className={cn(inputCls, 'font-mono')}
                />
              </div>
              <div>
                <SectionLabel className="mb-1">Location</SectionLabel>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="গাজীপুর, বাংলাদেশ"
                  className={cn(inputCls, 'font-bangla')}
                />
              </div>
              <div>
                <SectionLabel className="mb-1">Research Focus Area</SectionLabel>
                <input
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  placeholder="জিংকসমৃদ্ধ ধান ও জলবায়ু সহনশীল কৃষি"
                  className={cn(inputCls, 'font-bangla')}
                />
              </div>
              <div>
                <SectionLabel className="mb-1">Website / ORCID / Portfolio Link</SectionLabel>
                <input
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://orcid.org/..."
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <SectionLabel className="mb-1">Bio &amp; Field Summary</SectionLabel>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="আপনার গবেষণা, মাঠ পর্যায়ের কাজ ও অভিজ্ঞতা সংক্ষেপে লিখুন…"
                className={cn(inputCls, 'font-bangla resize-y')}
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-canvas-border pt-3">
              <button
                type="button"
                onClick={onClose}
                className="h-10 rounded-lg border border-canvas-border px-4 text-[13.5px] font-semibold text-pine-900/70 hover:bg-canvas-subtle"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="h-10 rounded-lg border border-pine-900 bg-pine-900 px-5 text-[14px] font-semibold text-canvas shadow-tactile-sm shadow-tactile-hover disabled:opacity-40"
              >
                {mode === 'create' ? 'Create & Save to Supabase' : 'Save Profile to Supabase'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
