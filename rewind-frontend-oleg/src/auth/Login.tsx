import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";

import { login as apiLogin } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

import Header from "../Header/Header";
import Footer from "../Footer/Footer";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth() as any; // щоб не впасти, якщо в AuthContext різні назви методів

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiLogin(email.trim(), password);

      // ✅ якщо у відповіді інша назва — заміни тут:
      const token: string | undefined = res?.data?.token;

      if (!token) {
        throw new Error("No token in response");
      }

      // 1) Якщо в AuthContext є метод login(token)
      if (typeof auth.login === "function") {
        auth.login(token, remember);
      }
      // 2) Якщо є setToken(token)
      else if (typeof auth.setToken === "function") {
        auth.setToken(token);
        (remember ? localStorage : sessionStorage).setItem("token", token);
      }
      // 3) fallback: просто в storage
      else {
        (remember ? localStorage : sessionStorage).setItem("token", token);
      }

      navigate("/");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Login failed";
      setError(typeof msg === "string" ? msg : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.layout}>
      <Header />

      <main className={styles.content}>
        <div className={styles.card}>
          <h1 className={styles.title}>Welcome back</h1>

          <form onSubmit={onSubmit}>
            <input
              type="email"
              placeholder="Enter email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <input
              type="password"
              placeholder="Password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <div className={styles.row}>
              <label className={styles.remember}>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>

              <span
                className={styles.forgot}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </span>
            </div>

            {error && (
              <p style={{ color: "tomato", marginTop: 8, marginBottom: 0 }}>
                {error}
              </p>
            )}

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className={styles.dividerRow}>
            <span></span>
            <p>Sign in with</p>
            <span></span>
          </div>

          <div className={styles.social}>
            <div className={styles.icon}>
              <i className="fa-brands fa-apple"></i>
            </div>

            <div className={styles.icon}>
              <i className="fa-brands fa-google"></i>
            </div>
          </div>

          <p className={styles.footer}>
            Don’t have an account?{" "}
            <Link to="/register" style={{ fontWeight: 600 }}>
              Create one
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
