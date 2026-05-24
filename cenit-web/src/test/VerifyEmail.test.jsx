import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ToastProvider } from "../components/Toast";
import VerifyEmail from "../pages/Auth/VerifyEmail";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ state: { email: "test@cenit.app" } }),
  };
});

vi.mock("../api/axiosConfig", () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

vi.mock("../hooks/useI18n", () => ({
  useI18n: () => ({
    t: (key, vals) => {
      if (key === "verify.subtitle") return "Codigo enviado a ${email}".replace("${email}", vals);
      const map = {
        "verify.title": "Verificar correo",
        "verify.codeLabel": "Codigo",
        "verify.codePlaceholder": "000000",
        "verify.verifyBtn": "Verificar",
        "verify.resendBtn": "Reenviar",
        "verify.verifying": "Verificando...",
        "verify.resending": "Reenviando...",
        "common.success": "Exito",
        "common.error": "Error",
        "verify.error.codeLength": "Codigo invalido",
        "verify.error.invalid": "Codigo invalido o expirado",
      };
      return map[key] || key;
    },
  }),
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

describe("VerifyEmail", () => {
  it("renderiza el titulo", () => {
    render(<VerifyEmail />, { wrapper: Wrapper });
    expect(screen.getByText("Verificar correo")).toBeInTheDocument();
  });

  it("renderiza el campo de codigo", () => {
    render(<VerifyEmail />, { wrapper: Wrapper });
    expect(screen.getByPlaceholderText("000000")).toBeInTheDocument();
  });

  it("renderiza boton de verificar", () => {
    render(<VerifyEmail />, { wrapper: Wrapper });
    expect(screen.getByRole("button", { name: "Verificar" })).toBeInTheDocument();
  });

  it("renderiza boton de reenviar", () => {
    render(<VerifyEmail />, { wrapper: Wrapper });
    expect(screen.getByText("Reenviar")).toBeInTheDocument();
  });

  it("muestra el email en el subtitle", () => {
    render(<VerifyEmail />, { wrapper: Wrapper });
    expect(screen.getByText("Codigo enviado a test@cenit.app")).toBeInTheDocument();
  });
});
