import { useState } from "react";
import { forgotPassword } from "../api/auth.api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setMessage("Лист для відновлення надіслано");
    } catch {
      setError("Помилка відновлення пароля");
    }
  };

  return (
    <form onSubmit={submit}>
      <h2>Відновлення пароля</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {message && <p>{message}</p>}
      {error && <p>{error}</p>}

      <button type="submit">Надіслати</button>
    </form>
  );
}
