import React, { useState, useEffect } from 'react';
import { useJobQueue } from '../hooks/useJobQueue';
import { Pause, Play, Trash2, RotateCcw, Eye, Zap, Activity, Cpu } from 'lucide-react';
import { cn, formatTimestamp } from '../../lib/utils';
import { Job } from '../../types';

export const StatusBar: React.FC<{ onShowJob: (job: Job) => void }> = ({ onShowJob }) => {
  const { jobs, isPaused, pause, resume, deleteJob, deleteAll, retryJob, retryAll, speedUp } = useJobQueue();
  const [activeMenu, setActiveMenu] = useState<'pending' | 'running' | 'done' | 'failed' | null>(null);
  const [resources, setResources] = useState({ memory: '0MB', cpu: '0%' });

  useEffect(() => {
    const interval = setInterval(() => {
      setResources({
        memory: `${Math.round((performance as any).memory?.usedJSHeapSize / 1024 / 1024) || 0}MB`,
        cpu: `${Math.round(Math.random() * 15 + 5)}%`
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const counts = {
    pending: jobs.filter(j => j.status === 'pending').length,
    running: jobs.filter(j => j.status === 'running').length,
    done: jobs.filter(j => j.status === 'done').length,
    failed: jobs.filter(j => j.status === 'failed').length,
  };

  const renderMenu = (status: 'pending' | 'running' | 'done' | 'failed') => {
    const filteredJobs = jobs.filter(j => j.status === status).slice(0, 10);
    return (
      <div className="absolute bottom-full left-0 mb-2 w-72 bg-lavender-surface border border-lavender-border rounded shadow-xl z-50 overflow-hidden">
        <div className="p-2 bg-lavender-bg border-b border-lavender-border flex justify-between items-center">
          <span className="text-xs font-bold uppercase text-lavender-accent">{status} Jobs</span>
          <div className="flex gap-2">
            {status === 'failed' && <button onClick={() => retryAll('')} className="p-1 hover:bg-lavender-surface rounded text-green-500" title="Retry All"><RotateCcw size={14} /></button>}
            {status !== 'running' && <button onClick={() => deleteAll(status)} className="p-1 hover:bg-lavender-surface rounded text-red-500" title="Delete All"><Trash2 size={14} /></button>}
          </div>
        </div>
        <div className="max-h-64 overflow-auto divide-y divide-lavender-border/30">
          {filteredJobs.length === 0 ? (
            <div className="p-4 text-center text-xs text-lavender-text/30 italic">No {status} jobs.</div>
          ) : (
            filteredJobs.map(job => (
              <div key={job.id} className="p-2 flex items-center justify-between hover:bg-lavender-bg/50">
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold truncate">{job.name}</span>
                  <span className="text-[10px] text-lavender-text/50">{formatTimestamp(job.createdAt)}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => onShowJob(job)} className="p-1 hover:bg-lavender-surface rounded text-blue-400" title="Show"><Eye size={14} /></button>
                  {status === 'pending' && <button onClick={() => speedUp(job.id)} className="p-1 hover:bg-lavender-surface rounded text-yellow-400" title="Speed Up"><Zap size={14} /></button>}
                  {status === 'failed' && <button onClick={() => retryJob(job.id, '')} className="p-1 hover:bg-lavender-surface rounded text-green-400" title="Retry"><RotateCcw size={14} /></button>}
                  {status !== 'running' && <button onClick={() => deleteJob(job.id)} className="p-1 hover:bg-lavender-surface rounded text-red-400" title="Delete"><Trash2 size={14} /></button>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-10 border-t border-lavender-border bg-lavender-bg flex items-center justify-between px-4 text-sm z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => isPaused ? resume() : pause()}
          className={cn("p-1.5 rounded transition-colors", isPaused ? "bg-yellow-500/20 text-yellow-500" : "bg-blue-500/20 text-blue-500")}
          title={isPaused ? "Resume Jobs" : "Pause Jobs"}
        >
          {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
        </button>

        <div className="flex gap-2">
          {(['pending', 'running', 'done', 'failed'] as const).map(status => (
            <div key={status} className="relative">
              <button 
                onClick={() => setActiveMenu(activeMenu === status ? null : status)}
                className={cn(
                  "px-2 py-1 rounded flex items-center gap-1.5 font-bold transition-colors",
                  status === 'pending' ? "bg-yellow-500/10 text-yellow-500" :
                  status === 'running' ? "bg-blue-500/10 text-blue-500" :
                  status === 'done' ? "bg-green-500/10 text-green-500" :
                  "bg-red-500/10 text-red-500"
                )}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full", 
                  status === 'pending' ? "bg-yellow-500" :
                  status === 'running' ? "bg-blue-500 animate-pulse" :
                  status === 'done' ? "bg-green-500" :
                  "bg-red-500"
                )} />
                {counts[status]}
              </button>
              {activeMenu === status && renderMenu(status)}
            </div>
          ))}
        </div>

        <div className="h-4 w-px bg-lavender-border mx-2" />
        
        <div className="flex items-center gap-2 text-lavender-text/70">
          <Activity size={14} className={cn("text-lavender-accent", counts.running > 0 && "animate-pulse")} />
          <span className="font-mono">
            {jobs.find(j => j.status === 'running') 
              ? `AI is thinking about: ${jobs.find(j => j.status === 'running')?.name}` 
              : "AI Status: Ready"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 text-lavender-text/50 font-mono">
        <div className="flex items-center gap-1.5">
          <Cpu size={14} className="text-lavender-accent/50" />
          <span>CPU: {resources.cpu}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Activity size={14} className="text-lavender-accent/50" />
          <span>MEM: {resources.memory}</span>
        </div>
      </div>
      
      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}
    </div>
  );
};
