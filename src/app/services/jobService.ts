import { Job, Priority, JobStatus } from '../../types';
import { generateSong } from './aiService';
import { SYSTEM_INSTRUCTIONS } from '../../constants/instructions';

class JobService {
  private queue: Job[] = [];
  private runningCount = 0;
  private maxConcurrent = 5;
  private isPaused = false;
  private listeners: ((jobs: Job[]) => void)[] = [];

  constructor() {
    setInterval(() => this.processQueue(), 1000);
  }

  subscribe(listener: (jobs: Job[]) => void) {
    this.listeners.push(listener);
    listener([...this.queue]);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l([...this.queue]));
  }

  addJob(name: string, priority: Priority, prompt: string, apiKey: string) {
    const job: Job = {
      id: Math.random().toString(36).substring(7),
      name,
      priority,
      status: 'pending',
      createdAt: Date.now(),
      prompt,
      systemInstruction: SYSTEM_INSTRUCTIONS,
    };
    this.queue.push(job);
    this.notify();
    return job.id;
  }

  pause() {
    this.isPaused = true;
    this.notify();
  }

  resume() {
    this.isPaused = false;
    this.notify();
  }

  getIsPaused() {
    return this.isPaused;
  }

  deleteJob(id: string) {
    const job = this.queue.find(j => j.id === id);
    if (job && job.status !== 'running') {
      this.queue = this.queue.filter(j => j.id !== id);
      this.notify();
    }
  }

  deleteAll(status?: JobStatus) {
    this.queue = this.queue.filter(j => {
      if (j.status === 'running') return true;
      if (status && j.status !== status) return true;
      return false;
    });
    this.notify();
  }

  retryJob(id: string, apiKey: string) {
    const job = this.queue.find(j => j.id === id);
    if (job && job.status === 'failed') {
      job.status = 'pending';
      job.error = undefined;
      this.notify();
    }
  }

  retryAll(apiKey: string) {
    this.queue.forEach(j => {
      if (j.status === 'failed') {
        j.status = 'pending';
        j.error = undefined;
      }
    });
    this.notify();
  }

  speedUp(id: string) {
    const job = this.queue.find(j => j.id === id);
    if (job && job.status === 'pending') {
      if (job.priority === 'low') job.priority = 'normal';
      else if (job.priority === 'normal') job.priority = 'high';
      this.notify();
    }
  }

  private async processQueue() {
    if (this.isPaused || this.runningCount >= this.maxConcurrent) return;

    const pendingJobs = this.queue
      .filter(j => j.status === 'pending')
      .sort((a, b) => {
        const priorityMap = { high: 0, normal: 1, low: 2 };
        if (priorityMap[a.priority] !== priorityMap[b.priority]) {
          return priorityMap[a.priority] - priorityMap[b.priority];
        }
        return a.createdAt - b.createdAt;
      });

    if (pendingJobs.length === 0) return;

    const job = pendingJobs[0];
    this.runJob(job);
  }

  private async runJob(job: Job) {
    job.status = 'running';
    job.startedAt = Date.now();
    this.runningCount++;
    this.notify();

    try {
      const apiKey = process.env.GEMINI_API_KEY || '';
      
      // Construct "raw" request for logging
      const rawRequestObj = {
        model: "gemini-3-flash-preview",
        contents: job.prompt,
        config: {
          systemInstruction: "Noor Songwriter System Instructions...",
          responseMimeType: "application/json",
        }
      };
      job.rawRequest = JSON.stringify(rawRequestObj, (key, value) => {
        if (typeof value === 'string' && value.length > 100 && value.match(/^[a-zA-Z0-9+/]*={0,2}$/)) {
          return value.substring(0, 10) + "..." + value.substring(value.length - 10);
        }
        return value;
      }, 2);

      const response = await generateSong(job.prompt || '', apiKey);
      
      // Capture "raw" response for logging
      const rawResponseObj = {
        candidates: response.candidates,
        usageMetadata: (response as any).usageMetadata,
      };
      job.rawResponse = JSON.stringify(rawResponseObj, (key, value) => {
        if (typeof value === 'string' && value.length > 100 && value.match(/^[a-zA-Z0-9+/]*={0,2}$/)) {
          return value.substring(0, 10) + "..." + value.substring(value.length - 10);
        }
        return value;
      }, 2);

      if (!response.text) throw new Error("No text returned from AI");
      
      job.result = JSON.parse(response.text);
      job.status = 'done';
    } catch (error: any) {
      job.status = 'failed';
      job.error = error.message;
      if (error.message.includes('429')) {
        this.pause();
      }
    } finally {
      job.completedAt = Date.now();
      this.runningCount--;
      this.notify();
    }
  }
}

export const jobService = new JobService();
