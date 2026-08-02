"use client";

import { Activity, LogIn } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "@/lib/auth-provider";
import { Button } from "@/components/ui/Button";
import { useTranslation } from "@/lib/i18n/language-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { loggedOut, login } = useAuth();
  const { t } = useTranslation();

  if (loggedOut) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary">
          <Activity size={28} className="text-white" />
        </div>
        <h1 className="text-xl font-bold text-text">{t("loggedOut.title")}</h1>
        <p className="max-w-sm text-sm text-text-muted">{t("loggedOut.desc")}</p>
        <Button onClick={login} className="mt-2">
          <LogIn size={16} />
          {t("loggedOut.button")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <Sidebar />
      <main className="h-full flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
