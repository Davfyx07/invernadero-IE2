import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import NotificationBell from "../components/NotificationBell";

vi.mock("../api/axiosConfig", () => ({
  default: {
    get: vi.fn((url) => {
      if (url === "/notificaciones/count") return Promise.resolve({ data: 3 });
      if (url === "/notificaciones/unread")
        return Promise.resolve({
          data: [
            { id: 1, titulo: "Notif 1", mensaje: "Mensaje 1", creadoEn: "2026-05-23T12:00:00" },
            { id: 2, titulo: "Notif 2", mensaje: "Mensaje 2", creadoEn: "2026-05-23T13:00:00" },
          ],
        });
      return Promise.resolve({ data: [] });
    }),
    put: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

vi.mock("../hooks/useI18n", () => ({
  useI18n: () => ({
    locale: "es",
    t: (key) => {
      const map = {
        "notification.title": "Notificaciones",
        "notification.unread": "no leídas",
        "notification.empty": "Sin notificaciones",
      };
      return map[key] || key;
    },
  }),
}));

describe("NotificationBell", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza el botón campana", () => {
    render(<NotificationBell />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
