import { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { QrCode, Copy, Download, RefreshCw, Eye, EyeOff } from "lucide-react";

type Stats = { today: number; this_week: number; this_month: number; total: number };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const rpc = (name: string, args?: Record<string, unknown>) =>
  (supabase.rpc as any)(name, args ?? {});

export function QrReadingsSection() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [secretKey, setSecretKey] = useState<string>("");
  const [duration, setDuration] = useState<number>(120);
  const [showKey, setShowKey] = useState(false);
  const [savingDuration, setSavingDuration] = useState(false);
  const [regenOpen, setRegenOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const qrUrl =
    typeof window !== "undefined" && secretKey
      ? `${window.location.origin}/carta-de-vinhos?key=${secretKey}`
      : "";

  const load = useCallback(async () => {
    const [statsRes, settingsRes] = await Promise.all([
      rpc("qr_stats"),
      rpc("qr_admin_settings"),
    ]);
    if (statsRes.data?.[0]) {
      const row = statsRes.data[0];
      setStats({
        today: Number(row.today),
        this_week: Number(row.this_week),
        this_month: Number(row.this_month),
        total: Number(row.total),
      });
    }
    if (settingsRes.data?.[0]) {
      setSecretKey(settingsRes.data[0].secret_key);
      setDuration(settingsRes.data[0].duration_minutes);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!qrUrl) return;
    QRCode.toDataURL(qrUrl, { width: 512, margin: 2 }).then(setQrDataUrl).catch(() => {});
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, qrUrl, { width: 240, margin: 2 }).catch(() => {});
    }
  }, [qrUrl]);

  const copyUrl = async () => {
    await navigator.clipboard.writeText(qrUrl);
    toast.success("URL copiado");
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qr-carta-vinhos.png";
    a.click();
  };

  const saveDuration = async () => {
    setSavingDuration(true);
    const { error } = await rpc("set_qr_duration", { p_minutes: duration });
    setSavingDuration(false);
    if (error) toast.error("Erro a guardar duração");
    else toast.success("Duração guardada");
  };

  const regenerate = async () => {
    const { data, error } = await rpc("regenerate_qr_key");
    if (error || !data) {
      toast.error("Erro a regenerar chave");
      return;
    }
    setSecretKey(String(data));
    toast.success("Nova chave gerada. QRs antigos deixaram de funcionar.");
  };

  const cards = [
    { label: "Hoje", value: stats?.today ?? 0 },
    { label: "Esta semana", value: stats?.this_week ?? 0 },
    { label: "Este mês", value: stats?.this_month ?? 0 },
    { label: "Total", value: stats?.total ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-charcoal">Leituras QR</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Estatísticas de acesso à carta de vinhos via QR code da mesa.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load} className="gap-2">
          <RefreshCw className="h-4 w-4" /> Atualizar
        </Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <div
            key={c.label}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-5"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gold/15 text-gold">
              <QrCode className="h-6 w-6" />
            </div>
            <div>
              <p className="font-serif text-2xl text-charcoal">{c.value}</p>
              <p className="text-sm text-muted-foreground">{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 rounded-xl border border-border bg-card p-5 lg:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <h2 className="font-serif text-lg text-charcoal">QR Code do restaurante</h2>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Duração do token (minutos)
            </label>
            <div className="mt-1 flex items-center gap-2">
              <Input
                type="number"
                min={1}
                max={1440}
                value={duration}
                onChange={(e) => setDuration(Math.max(1, Number(e.target.value) || 1))}
                className="max-w-[140px]"
              />
              <Button onClick={saveDuration} disabled={savingDuration} size="sm">
                Guardar
              </Button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tempo durante o qual a carta fica acessível após ler o QR.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">URL do QR</label>
            <div className="mt-1 flex items-center gap-2">
              <Input
                value={showKey ? qrUrl : qrUrl.replace(/key=.+$/, "key=••••••••")}
                readOnly
                className="font-mono text-xs"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowKey((v) => !v)}
                title={showKey ? "Ocultar chave" : "Mostrar chave"}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={copyUrl} title="Copiar URL">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={downloadQr} className="gap-2" disabled={!qrDataUrl}>
              <Download className="h-4 w-4" /> Descarregar PNG
            </Button>
            <Button
              variant="outline"
              onClick={() => setRegenOpen(true)}
              className="gap-2 text-destructive"
            >
              <RefreshCw className="h-4 w-4" /> Regenerar chave
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <div className="rounded-lg border border-border bg-white p-3">
            <canvas ref={canvasRef} />
          </div>
        </div>
      </div>

      <AlertDialog open={regenOpen} onOpenChange={setRegenOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Regenerar chave secreta?</AlertDialogTitle>
            <AlertDialogDescription>
              Todos os QR codes impressos deixarão de funcionar. Vai precisar de imprimir e colar
              os novos nas mesas. Esta acção não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={regenerate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Regenerar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
