function modeLabel() {
  const params = new URLSearchParams(window.location.search);
  if (params.has("scaleReview")) {
    return "Scale Review Mode";
  }
  return null;
}

export function ModeBanner() {
  const label = modeLabel();
  if (!label) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 40,
        left: 8,
        color: "#fff",
        background: "rgba(20,32,48,0.85)",
        padding: "5px 10px",
        borderRadius: 4,
        fontFamily: "monospace",
        fontSize: 12,
        zIndex: 100,
        pointerEvents: "none",
      }}
    >
      {label}
    </div>
  );
}
