export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f8fafc",
        color: "#111827",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "560px" }}>
        <h1 style={{ fontSize: "32px", fontWeight: 700 }}>
          Service Temporarily Unavailable
        </h1>
        <p style={{ marginTop: "20px", fontSize: "18px", lineHeight: 1.7 }}>
          This driving service is not available at this time.
          We are currently not accepting bookings.
        </p>
        <p style={{ marginTop: "16px", fontSize: "16px" }}>
          Thank you for your understanding.
        </p>
      </div>
    </main>
  );
}
