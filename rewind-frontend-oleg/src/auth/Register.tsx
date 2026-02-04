import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Register.module.css";

import { register as apiRegister, login as apiLogin } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const auth = useAuth() as any;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1) реєстрація
      await apiRegister(email.trim(), password, username.trim());

      // 2) авто-логін
      const res = await apiLogin(email.trim(), password);

      // якщо у відповіді інша назва — заміни тут:
      const token: string | undefined = res?.data?.token;

      if (!token) throw new Error("No token in response");

      // збереження токена так само як у Login.tsx
      if (typeof auth.login === "function") {
        auth.login(token, remember);
      } else if (typeof auth.setToken === "function") {
        auth.setToken(token);
        (remember ? localStorage : sessionStorage).setItem("token", token);
      } else {
        (remember ? localStorage : sessionStorage).setItem("token", token);
      }

      // ✅ редірект на головну, але вже залогінений
      navigate("/");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Registration failed";
      setError(typeof msg === "string" ? msg : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create your account</h1>

        <form onSubmit={submit}>
          <input
            className={styles.input}
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />

          <input
            className={styles.input}
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />

          <label style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button className={styles.button} type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className={styles.footer} style={{ marginTop: "25px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
