import { render, screen } from "../test-utils";
import { describe, expect, it, vi } from "vitest";
import { Navbar } from "./navbar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
}));

describe("Navbar", () => {
  it("renders the navbar with logo text", () => {
    render(<Navbar />);

    // Check if the logo text is present
    const logoElement = screen.getByText("Cloud Text2Diagram");
    expect(logoElement).toBeInTheDocument();
  });
});
