import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastProvider } from "../components/Toast";
import Login from "../pages/Login/Login";

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({
    login: vi.fn().mockResolvedValue({ requiresVerification: false, requiresPasswordChange: false }),
    oauthLogin: vi.fn(),
  }),
}));

vi.mock("../hooks/useApiError", () => ({
  useApiError: () => ({ handleError: vi.fn() }),
}));

vi.mock("../hooks/useI18n", () => ({
  useI18n: () => ({
    locale: "es",
    setLocale: vi.fn(),
    t: (key) => {
      const map = {
        "login.title": "Iniciar Sesion",
        "login.subtitle": "Accede a tu cuenta",
        "login.email": "Correo electronico",
        "login.emailPlaceholder": "correo@ejemplo.com",
        "login.password": "Contrasena",
        "login.passwordPlaceholder": "••••••••",
        "login.submit": "Entrar",
        "login.rememberMe": "Recordarme",
        "login.forgotPassword": "Olvidaste tu contrasena?",
        "login.noAccount": "No tienes cuenta?",
        "login.register": "Registrate",
        "login.google": "Continuar con Google",
        "login.or": "O",
        "app.subtitle": "Gestion de invernaderos",
        "common.loading": "Cargando...",
        "common.language": "Idioma",
      };
      return map[key] || key;
    },
  }),
}));

vi.mock("../context/ThemeContext", () => ({
  useTheme: () => ({ theme: "light" }),
}));

function Wrapper({ children }) {
  return (
    <MemoryRouter>
      <ToastProvider>
        {children}
      </ToastProvider>
    </MemoryRouter>
  );
}

describe("Login", () => {
  it("renderiza los campos email y password", () => {
    render(<Login />, { wrapper: Wrapper });
    expect(screen.getByPlaceholderText("correo@ejemplo.com")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("renderiza el boton de submit", () => {
    render(<Login />, { wrapper: Wrapper });
    expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();
  });

  it("renderiza link de registro", () => {
    render(<Login />, { wrapper: Wrapper });
    expect(screen.getByText("Registrate")).toBeInTheDocument();
  });

  it("renderiza link de forgot password", () => {
    render(<Login />, { wrapper: Wrapper });
    expect(screen.getByText("Olvidaste tu contrasena?")).toBeInTheDocument();
  });

  it("renderiza boton de Google", () => {
    render(<Login />, { wrapper: Wrapper });
    expect(screen.getByText("Continuar con Google")).toBeInTheDocument();
  });
});
