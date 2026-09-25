export type IconName =
  | "arrow"
  | "chevron"
  | "check"
  | "menu"
  | "close"
  | "message"
  | "phone"
  | "mail"
  | "pin"
  | "clock"
  | "layers"
  | "factory"
  | "scan"
  | "shield"
  | "spark"
  | "file";

/** Ícones técnicos simples em traço. Sempre decorativos (aria-hidden). */
export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    className,
  };

  switch (name) {
    case "arrow":
      return <svg {...common}><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></svg>;
    case "chevron":
      return <svg {...common}><path d="m6 9 6 6 6-6" /></svg>;
    case "check":
      return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
    case "menu":
      return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
    case "close":
      return <svg {...common}><path d="m6 6 12 12M18 6 6 18" /></svg>;
    case "message":
      return <svg {...common}><path d="M20 11.5a8.5 8.5 0 0 1-9 8.5 9.7 9.7 0 0 1-4-.9L3.5 20l.9-3.2A8.4 8.4 0 0 1 3 12.2C3 7.5 6.8 4 11.5 4S20 7 20 11.5Z" /></svg>;
    case "phone":
      return <svg {...common}><path d="M7 4h3l1.2 4-2 1.5a13.2 13.2 0 0 0 5.3 5.3l1.5-2 4 1.2v3a2 2 0 0 1-2.2 2C10.4 18.3 5.7 13.6 5 6.2A2 2 0 0 1 7 4Z" /></svg>;
    case "mail":
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></svg>;
    case "pin":
      return <svg {...common}><path d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.5" /></svg>;
    case "clock":
      return <svg {...common}><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3 2" /></svg>;
    case "layers":
      return <svg {...common}><path d="m12 3 8 4-8 4-8-4 8-4Z" /><path d="m4 12 8 4 8-4" /><path d="m4 16 8 5 8-5" /></svg>;
    case "factory":
      return <svg {...common}><path d="M3 20V8l6 3V8l6 3V5h6v15" /><path d="M7 20v-4M12 20v-4M17 20v-4M3 20h18" /></svg>;
    case "scan":
      return <svg {...common}><path d="M4 7V5a1 1 0 0 1 1-1h2M17 4h2a1 1 0 0 1 1 1v2M20 17v2a1 1 0 0 1-1 1h-2M7 20H5a1 1 0 0 1-1-1v-2M8 9v6M12 9v6M16 9v6" /></svg>;
    case "shield":
      return <svg {...common}><path d="m12 3 7 3v5c0 4.8-2.7 8.1-7 10-4.3-1.9-7-5.2-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></svg>;
    case "spark":
      return <svg {...common}><path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z" /></svg>;
    case "file":
      return <svg {...common}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" /><path d="M14 3v5h5M9 13h6M9 17h6" /></svg>;
  }
}
