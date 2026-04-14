import type { NextPageContext } from "next";

type ErrorProps = {
  statusCode?: number;
};

/**
 * Pages Router fallback used by Next when the dev server needs to render an error
 * and App Router error boundaries are not sufficient. Without this file, dev can
 * show "missing required error components, refreshing...".
 */
function ErrorPage({ statusCode }: ErrorProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        padding: "1.5rem",
        background: "#0a0a0a",
        color: "#fafafa",
      }}
    >
      <h1 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
        Something went wrong
      </h1>
      <p style={{ color: "#a1a1aa", fontSize: "0.875rem", textAlign: "center", maxWidth: "28rem" }}>
        {statusCode
          ? `Server error (${statusCode}). Check the terminal for details.`
          : "An error occurred in the browser."}
      </p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode =
    res?.statusCode ?? (err as { statusCode?: number } | undefined)?.statusCode;
  return { statusCode };
};

export default ErrorPage;
