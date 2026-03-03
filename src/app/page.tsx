import AuthForm from "@/components/AuthForm";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Background grid effect */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="mb-10 text-center">
        <h1
          className="text-5xl sm:text-6xl font-extrabold mb-3 bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981)",
          }}
        >
          CleanStart
        </h1>
        <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
          Build your startup from zero to IPO in 10 years.
        </p>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)", opacity: 0.7 }}>
          A turn-based startup simulation &mdash; one quarter at a time.
        </p>
      </div>

      <AuthForm />

      <div
        className="mt-12 max-w-md text-center space-y-2 text-sm"
        style={{ color: "var(--text-secondary)", opacity: 0.6 }}
      >
        <p>Set pricing. Hire your team. Manage your burn rate.</p>
        <p>Survive 40 quarters with cash remaining to win.</p>
      </div>
    </main>
  );
}
