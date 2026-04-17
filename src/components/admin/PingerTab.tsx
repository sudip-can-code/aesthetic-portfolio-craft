import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Play, Plus, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PingedProject {
  id: string;
  name: string;
  url: string;
  interval_minutes: number;
  enabled: boolean;
  last_pinged_at: string | null;
  last_status_code: number | null;
  last_error: string | null;
}

const PingerTab = () => {
  const [projects, setProjects] = useState<PingedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [interval, setInterval] = useState(60);
  const [pingingId, setPingingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pinged_projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error(error.message);
    else setProjects((data as PingedProject[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    try {
      new URL(url);
    } catch {
      toast.error('Invalid URL');
      return;
    }
    const { error } = await supabase.from('pinged_projects').insert({
      name: name.trim(),
      url: url.trim(),
      interval_minutes: Math.max(1, interval),
    });
    if (error) return toast.error(error.message);
    toast.success('Project added');
    setName(''); setUrl(''); setInterval(60);
    load();
  };

  const toggle = async (p: PingedProject) => {
    const { error } = await supabase
      .from('pinged_projects')
      .update({ enabled: !p.enabled })
      .eq('id', p.id);
    if (error) return toast.error(error.message);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this pinged project?')) return;
    const { error } = await supabase.from('pinged_projects').delete().eq('id', id);
    if (error) return toast.error(error.message);
    toast.success('Deleted');
    load();
  };

  const pingNow = async (id: string) => {
    setPingingId(id);
    try {
      const { data, error } = await supabase.functions.invoke('ping-projects', {
        body: {},
        method: 'POST',
      });
      // Use query param via direct fetch for targeted ping
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ping-projects?id=${id}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Ping failed');
      const r = json.results?.[0];
      if (r?.success) toast.success(`Pinged: ${r.statusCode} (${r.responseTime}ms)`);
      else toast.error(`Ping failed: ${r?.errorMessage || r?.statusCode}`);
      load();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPingingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Keep-Alive Pinger</CardTitle>
          <CardDescription>
            Add project URLs to ping automatically and keep your free Supabase projects active. The scheduler runs every 5 minutes and pings each project according to its interval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addProject} className="grid gap-4 md:grid-cols-[1fr_2fr_120px_auto]">
            <div className="space-y-2">
              <Label htmlFor="p-name">Name</Label>
              <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My project" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-url">URL</Label>
              <Input id="p-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://xxx.supabase.co/rest/v1/" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p-int">Interval (min)</Label>
              <Input id="p-int" type="number" min={1} value={interval} onChange={(e) => setInterval(parseInt(e.target.value) || 60)} />
            </div>
            <div className="flex items-end">
              <Button type="submit"><Plus className="mr-2 h-4 w-4" />Add</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Pinged Projects ({projects.length})</h3>
        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
        </Button>
      </div>

      <div className="grid gap-4">
        {projects.map((p) => (
          <Card key={p.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{p.name}</h4>
                    {p.last_status_code && (
                      <Badge variant={p.last_status_code < 400 ? 'default' : 'destructive'}>
                        {p.last_status_code < 400 ? <CheckCircle2 className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                        {p.last_status_code}
                      </Badge>
                    )}
                    {!p.enabled && <Badge variant="secondary">Paused</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{p.url}</p>
                  <p className="text-xs text-muted-foreground">
                    Every {p.interval_minutes} min · Last pinged: {p.last_pinged_at ? new Date(p.last_pinged_at).toLocaleString() : 'Never'}
                  </p>
                  {p.last_error && <p className="text-xs text-destructive">Error: {p.last_error}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={p.enabled} onCheckedChange={() => toggle(p)} />
                  <Button size="sm" variant="outline" onClick={() => pingNow(p.id)} disabled={pingingId === p.id}>
                    <Play className={`mr-2 h-4 w-4 ${pingingId === p.id ? 'animate-pulse' : ''}`} />Ping
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => remove(p.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {!loading && projects.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No pinged projects yet. Add one above.</p>
        )}
      </div>
    </div>
  );
};

export default PingerTab;
