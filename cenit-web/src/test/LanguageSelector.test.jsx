import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LanguageSelector from "../components/LanguageSelector";

vi.mock("../hooks/useI18n", () => ({
  useI18n: () => ({
    locale: "es",
    setLocale: vi.fn(),
    t: (key) => key,
  }),
}));

describe("LanguageSelector", () => {
  it("renderiza el locale actual con flag", () => {
    render(<LanguageSelector />);
    const btn = screen.getByRole("button", { name: "common.language" });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveTextContent("es");
  });

  it("abre el dropdown al hacer click", async () => {
    render(<LanguageSelector />);
    const trigger = screen.getByRole("button", { name: "common.language" });
    await userEvent.click(trigger);
    expect(screen.getByText("en")).toBeInTheDocument();
    expect(screen.getByText("fr")).toBeInTheDocument();
    expect(screen.getByText("it")).toBeInTheDocument();
  });
});
