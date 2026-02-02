import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./page";

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: { alt: string }) => <img alt={props.alt} />,
}));

describe("Home Page", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the Hello World heading", () => {
    render(<Home />);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders the Claude Code text", () => {
    render(<Home />);
    expect(screen.getByText("Claude Code")).toBeInTheDocument();
  });

  it("renders the Change Color button", () => {
    render(<Home />);
    expect(screen.getByRole("button", { name: /change color/i })).toBeInTheDocument();
  });

  it("changes background when button is clicked", () => {
    render(<Home />);
    const button = screen.getByRole("button", { name: /change color/i });
    const container = button.closest("div[class*='min-h-screen']");

    const initialClass = container?.className;
    fireEvent.click(button);
    const newClass = container?.className;

    expect(newClass).not.toBe(initialClass);
  });
});
