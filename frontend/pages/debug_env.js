export default function DebugEnv() {
  return (
    <pre style={{ padding: 20 }}>
      NEXT_PUBLIC_BACKEND_URL ={" "}
      {process.env.NEXT_PUBLIC_BACKEND_URL || "undefined"}
    </pre>
  );
}
