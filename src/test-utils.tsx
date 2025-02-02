import { render as rtlRender } from "@testing-library/react";
import { ThemeProvider } from "next-themes";
import { ReactElement } from "react";

function render(ui: ReactElement) {
  return rtlRender(ui, {
    wrapper: ({ children }) => (
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    ),
  });
}

// re-export everything
export * from "@testing-library/react";

// override render method
export { render };
