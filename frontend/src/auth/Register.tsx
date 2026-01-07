import { useState } from "react";
import { register } from "../api/auth.api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password, nickname);
      setSuccess(true);
    } catch {
      setError("Помилка реєстрації");
    }
  };

  if (success) {
    return <p>Акаунт створено. Тепер увійдіть.</p>;
  }

  return (
    <form onSubmit={submit}>
      <h2>Реєстрація</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Нікнейм"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p>{error}</p>}

      <button type="submit">Зареєструватися</button>
    </form>
  );
}
