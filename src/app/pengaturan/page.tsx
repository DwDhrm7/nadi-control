"use client";

import { useState } from "react";
import {
  Bell,
  Briefcase,
  ChevronRight,
  Headset,
  KeyRound,
  LogOut,
  Moon,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sun,
} from "lucide-react";
import { TopbarShell, PageTitle } from "@/components/layout/TopbarShell";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { UserMenu } from "@/components/layout/UserMenu";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { useTheme } from "@/lib/theme-provider";
import { useAuth } from "@/lib/auth-provider";
import { useToast } from "@/lib/toast-provider";
import { useTranslation } from "@/lib/i18n/language-provider";
import type { Language } from "@/lib/i18n/dictionary";
import { NadiLogo } from "@/components/ui/NadiLogo";

const STORAGE_KEY = "nadi-settings";

interface Settings {
  pushNotifications: boolean;
  densityThreshold: number;
  twoFactor: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  pushNotifications: true,
  densityThreshold: 75,
  twoFactor: true,
};
export default function PengaturanPage() {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const toast = useToast();
  const { language, setLanguage, t } = useTranslation();
  const [settings, setSettings] = useState<Settings>(() => {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  function update(next: Partial<Settings>) {
    const merged = { ...settings, ...next };
    setSettings(merged);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  }

  function contactIT() {
    toast("info", "NADI Support Hotline: support@nadi.go.id | Ext: 4042");
  }

  return (
    <>
      <TopbarShell
        left={<PageTitle>{t("pengaturan.controlCenter")}</PageTitle>}
        right={
          <>
            <NotificationBell />
            <UserMenu />
          </>
        }
      />

      <div className="flex flex-col gap-1 px-8 pt-6">
        <h1 className="text-2xl font-bold text-text">{t("pengaturan.heading")}</h1>
        <p className="text-sm text-text-muted">{t("pengaturan.subheading")}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 px-8 py-6 xl:grid-cols-[340px_1fr]">
        <div className="flex flex-col gap-5">
          <Card className="p-5 text-center">
            <h3 className="mb-4 flex items-center justify-center gap-2 text-[15px] font-semibold text-text">
              <Briefcase size={16} className="text-primary" />
              {t("pengaturan.profileTitle")}
            </h3>
            <img
              src="https://i.pravatar.cc/128?img=13"
              alt="Operator Alpha"
              className="mx-auto h-20 w-20 rounded-full object-cover"
            />
            <p className="mt-3 text-base font-bold text-text">Operator Alpha</p>
            <p className="text-sm text-text-muted">ID: NADI-OPS-042</p>
            <Badge tone="success" dot className="mt-3">
              {t("pengaturan.shiftActive")}
            </Badge>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader icon={Headset} title={t("pengaturan.supportTitle")} />
            <button
              onClick={contactIT}
              className="flex w-full items-center justify-between px-5 py-3.5 text-sm text-text hover:bg-bg cursor-pointer"
            >
              {t("pengaturan.contactIt")}
              <ChevronRight size={15} className="text-text-muted" />
            </button>
            <button
              onClick={() => setAboutOpen(true)}
              className="flex w-full items-center justify-between border-t border-border px-5 py-3.5 text-sm text-text hover:bg-bg cursor-pointer"
            >
              {t("pengaturan.aboutNadi")}
              <span className="text-text-muted">v2.4.0</span>
            </button>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card className="overflow-hidden">
            <CardHeader icon={SlidersHorizontal} title={t("pengaturan.systemPrefsTitle")} />
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-text">{t("pengaturan.language")}</p>
                <p className="text-xs text-text-muted">{t("pengaturan.languageDesc")}</p>
              </div>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
              >
                <option value="id">Indonesia</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="flex items-center justify-between border-t border-border px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-text">{t("pengaturan.theme")}</p>
                <p className="text-xs text-text-muted">{t("pengaturan.themeDesc")}</p>
              </div>
              <div className="flex overflow-hidden rounded-lg border border-border">
                <button
                  onClick={() => setTheme("light")}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium cursor-pointer",
                    theme === "light" ? "bg-primary-light text-primary" : "text-text-muted hover:bg-bg"
                  )}
                >
                  <Sun size={14} /> {t("pengaturan.light")}
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium cursor-pointer",
                    theme === "dark" ? "bg-primary-light text-primary" : "text-text-muted hover:bg-bg"
                  )}
                >
                  <Moon size={14} /> {t("pengaturan.dark")}
                </button>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader icon={Bell} title={t("pengaturan.notifTitle")} />
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-text">{t("pengaturan.pushNotif")}</p>
                <p className="text-xs text-text-muted">{t("pengaturan.pushNotifDesc")}</p>
              </div>
              <Toggle
                checked={settings.pushNotifications}
                onChange={(v) => update({ pushNotifications: v })}
              />
            </div>
            <div className="border-t border-border px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-text">{t("pengaturan.densityThreshold")}</p>
                  <p className="text-xs text-text-muted">{t("pengaturan.densityThresholdDesc")}</p>
                </div>
                <span className="text-lg font-bold text-primary">{settings.densityThreshold}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={settings.densityThreshold}
                onChange={(e) => update({ densityThreshold: Number(e.target.value) })}
                className="mt-3 w-full accent-primary"
              />
              <div className="mt-1 flex justify-between text-xs text-text-muted">
                <span>{t("pengaturan.low")} (0%)</span>
                <span>{t("pengaturan.high")} (100%)</span>
              </div>
            </div>
          </Card>

          <Card className="overflow-hidden">
            <CardHeader icon={ShieldCheck} title={t("pengaturan.securityTitle")} />
            <button
              onClick={() => setPasswordOpen(true)}
              className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left hover:bg-bg cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bg">
                  <KeyRound size={16} className="text-text-muted" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-text">{t("pengaturan.changePassword")}</span>
                  <span className="block text-xs text-text-muted">{t("pengaturan.lastChanged")}</span>
                </span>
              </span>
              <ChevronRight size={15} className="text-text-muted" />
            </button>
            <div className="flex items-center justify-between border-t border-border px-5 py-4">
              <span className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bg">
                  <Smartphone size={16} className="text-text-muted" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-text">{t("pengaturan.twoFactor")}</span>
                  <span className="block text-xs text-text-muted">{t("pengaturan.twoFactorDesc")}</span>
                </span>
              </span>
              <Toggle checked={settings.twoFactor} onChange={(v) => update({ twoFactor: v })} />
            </div>
          </Card>

          <div className="flex justify-end">
            <Button variant="danger" onClick={() => setLogoutOpen(true)}>
              <LogOut size={15} />
              {t("pengaturan.logout")}
            </Button>
          </div>
        </div>
      </div>

      <Modal open={logoutOpen} onClose={() => setLogoutOpen(false)} title={t("pengaturan.logoutModalTitle")} width="max-w-sm">
        <p className="text-sm text-text-muted">{t("pengaturan.logoutConfirm")}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setLogoutOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              setLogoutOpen(false);
              logout();
            }}
          >
            {t("pengaturan.logout")}
          </Button>
        </div>
      </Modal>

      <PasswordModal open={passwordOpen} onClose={() => setPasswordOpen(false)} onSaved={() => toast("success", t("pengaturan.passwordUpdated"))} />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </>
  );
}

function AboutModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  return (
    <Modal open={open} onClose={onClose} title={t("pengaturan.aboutNadi")} width="max-w-md">
      <div className="py-2">
        <NadiLogo variant="full" />
        <div className="mt-6 rounded-xl border border-border bg-bg/50 p-4 text-center text-xs text-text-muted">
          <p className="font-semibold text-text">NADI Control Center Operator v2.4.0</p>
          <p className="mt-1">Sistem Navigasi Adaptif dan Distribusi Intelijen Kota</p>
          <p className="mt-2 text-[11px] opacity-75">© 2026 NADI Intelligence System. All rights reserved.</p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button variant="outline" onClick={onClose}>
          {t("common.close") || "Tutup"}
        </Button>
      </div>
    </Modal>
  );
}

function PasswordModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const error = next.length > 0 && confirm.length > 0 && next !== confirm ? t("pengaturan.passwordMismatch") : null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!current || !next || error) return;
    onSaved();
    setCurrent("");
    setNext("");
    setConfirm("");
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title={t("pengaturan.passwordModalTitle")} width="max-w-sm">
      <form onSubmit={submit} className="flex flex-col gap-3.5">
        <div>
          <label className="text-xs font-medium text-text-muted">{t("pengaturan.currentPassword")}</label>
          <input
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-text-muted">{t("pengaturan.newPassword")}</label>
          <input
            type="password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
            required
            minLength={8}
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-text-muted">{t("pengaturan.confirmPassword")}</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="mt-1 w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-text focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>
        <div className="mt-1 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button type="submit" disabled={!!error}>
            {t("common.save")}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
