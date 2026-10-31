import { useState } from 'react';
import { Check, Copy, Database, ExternalLink, RefreshCw, ShieldCheck, Terminal } from 'lucide-react';
import { PLAINSYT_SCHEMA_SQL } from '../lib/schemaSql';
import { SUPABASE_PROJECT_REF, SUPABASE_URL, BKASH_RECEIVER_NUMBER } from '../lib/supabase';
import type { DatabaseSnapshot, SupabaseConnectionStatus } from '../lib/db';
import { CloseButton, Modal, SectionLabel, cn } from './Primitives';

interface Props {
  open: boolean;
  onClose: () => void;
  status: SupabaseConnectionStatus;
  errorMessage?: string;
  snapshot: DatabaseSnapshot;
  onSyncNow: () => Promise<void>;
}

export function SupabaseConsoleModal({
  open,
  onClose,
  status,
  errorMessage,
  snapshot,
  onSyncNow,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const copySql = () => {
    navigator.clipboard?.writeText(PLAINSYT_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      await onSyncNow();
    } finally {
      setSyncing(false);
    }
  };

  const stats = [
    { label: 'profiles', count: snapshot.profiles.length },
    { label: 'articles', count: snapshot.articles.length },
    { label: 'posts', count: snapshot.posts.length },
    { label: 'comments', count: snapshot.comments.length },
    { label: 'reactions', count: snapshot.reactions.length },
    { label: 'reels & stories', count: snapshot.reels.length + snapshot.stories.length },
    { label: 'store_products', count: snapshot.storeProducts.length },
    { label: 'orders (bKash)', count: snapshot.orders.length },
  ];

  return (
    <Modal open={open} onClose={onClose} className="max-w-[740px]" labelledBy="supa-console-title">
      <div className="overflow-hidden rounded-t-2xl border border-pine-900 bg-canvas shadow-tactile-lg sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-pine-900 bg-pine-900 px-5 py-3.5 text-canvas">
          <div className="flex items-center gap-2.5">
            <Database className="size-5 text-[#38b17e]" />
            <div>
              <h2 id="supa-console-title" className="font-display text-[20px] font-semibold">
                Supabase Engine · {SUPABASE_PROJECT_REF}
              </h2>
              <p className="font-mono text-[10.5px] opacity-75">{SUPABASE_URL}</p>
            </div>
          </div>
          <CloseButton onClick={onClose} className="bg-canvas/10 text-canvas hover:bg-canvas/20" />
        </div>

        <div className="max-h-[78vh] space-y-4 overflow-y-auto p-5">
          {/* Status Banner */}
          <div
            className={cn(
              'flex flex-wrap items-center justify-between gap-3 rounded-xl border p-3.5',
              status === 'connected'
                ? 'border-pine-600 bg-pine-50 text-pine-900'
                : 'border-[#d97706] bg-[#fffbeb] text-[#78350f]',
            )}
          >
            <div>
              <p className="flex items-center gap-2 text-[14px] font-semibold">
                <span
                  className={cn(
                    'size-2.5 rounded-full',
                    status === 'connected' ? 'bg-[#218f62]' : 'bg-[#d97706] animate-pulse',
                  )}
                />
                {status === 'connected'
                  ? 'Connected to Supabase PostgreSQL (All Tables Active)'
                  : status === 'schema_missing'
                  ? 'Supabase Project Reachable — Run SQL Schema Once to Create Tables'
                  : 'Supabase Write-Through Cache Active — Ready to Sync'}
              </p>
              {errorMessage && status !== 'connected' && (
                <p className="mt-0.5 font-mono text-[11px] opacity-80">{errorMessage}</p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-pine-900 bg-pine-900 px-3.5 text-[12.5px] font-semibold text-canvas shadow-tactile-xs"
            >
              <RefreshCw className={cn('size-3.5', syncing && 'animate-spin')} />
              {syncing ? 'Syncing…' : 'Sync & Verify Now'}
            </button>
          </div>

          {/* Live Record Counts */}
          <div>
            <SectionLabel className="mb-2">Live Database Records ({SUPABASE_PROJECT_REF})</SectionLabel>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-canvas-border bg-canvas-card px-3 py-2"
                >
                  <p className="font-mono text-[10px] uppercase text-pine-600">{s.label}</p>
                  <p className="font-display text-[20px] font-bold text-pine-900">{s.count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SQL Schema Copy Box */}
          <div className="rounded-xl border border-pine-900 bg-canvas-card p-4 shadow-tactile-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="flex items-center gap-1.5 font-display text-[17px] font-semibold text-pine-900">
                  <Terminal className="size-4 text-pine-600" />
                  Production SQL Schema (BRIN + Keyset + Trigram Indexed)
                </h3>
                <p className="text-[12.5px] text-pine-900/70">
                  Paste in your Supabase SQL Editor to provision all 16 tables &amp; RLS policies for{' '}
                  <code className="font-mono text-[11.5px]">{SUPABASE_PROJECT_REF}</code>.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copySql}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-pine-900 bg-pine-900 px-3 text-[12.5px] font-semibold text-canvas shadow-tactile-xs"
                >
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  {copied ? 'Copied SQL!' : 'Copy SQL Schema'}
                </button>
                <a
                  href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql/new`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-pine-900 bg-canvas px-3 text-[12.5px] font-semibold text-pine-900 shadow-tactile-xs hover:bg-pine-50"
                >
                  Open SQL Editor <ExternalLink className="size-3.5" />
                </a>
              </div>
            </div>
            <pre className="mt-3 max-h-48 overflow-auto rounded-lg bg-[#041a11] p-3 font-mono text-[11px] leading-relaxed text-[#bbf0d8]">
              {PLAINSYT_SCHEMA_SQL}
            </pre>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-canvas-border bg-canvas-subtle px-3.5 py-2.5 font-mono text-[11px] text-pine-700">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-pine-600" />
              Zero Hardcoded Mock Data · SWR Cache + Indexed Pagination
            </span>
            <span>bKash Merchant/Receiver: {BKASH_RECEIVER_NUMBER}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
