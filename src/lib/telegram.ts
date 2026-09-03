import { retrieveLaunchParams, mainButton, backButton, hapticFeedback, openInvoice } from "@telegram-apps/sdk";

export function getInitDataRaw(): string {
  const { initDataRaw } = retrieveLaunchParams();
  if (!initDataRaw) throw new Error("Not running inside Telegram — initData missing.");
  return initDataRaw;
}

export function applyTelegramTheme() {
  const root = document.documentElement;
  const tg = (window as any).Telegram?.WebApp;
  if (!tg) return;
  tg.ready();
  tg.expand();
  const p = tg.themeParams ?? {};
  for (const [key, value] of Object.entries(p)) {
    root.style.setProperty(`--tg-theme-${key.replace(/_/g, "-")}`, value as string);
  }
}

export const MainButton = mainButton;
export const BackButton = backButton;
export const Haptics = hapticFeedback;

export async function payWithStars(invoiceLink: string): Promise<string> {
  const status = await openInvoice(invoiceLink, "url");
  return status;
}
