import { useEffect, useState } from "react";
import { getProfile, updateProfile, changePassword } from "../api/profile.api";

interface ProfileData {
  email: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const res = await getProfile();
    setProfile(res.data);

    setDisplayName(res.data.displayName ?? "");
    setAvatarUrl(res.data.avatarUrl ?? "");
  };

  useEffect(() => {
    load();
  }, []);

  const saveProfile = async () => {
    setError("");
    setMessage("");
    await updateProfile({
      displayName: displayName || undefined,
      avatarUrl: avatarUrl || undefined,
    });
    setMessage("Профіль оновлено");
    load();
  };

  const savePassword = async () => {
    setError("");
    setMessage("");

    if (!currentPassword || !newPassword) {
      setError("Введи поточний і новий пароль");
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword });
      setMessage("Пароль змінено");
      setCurrentPassword("");
      setNewPassword("");
    } catch (e: any) {
      setError("Не вдалось змінити пароль (перевір поточний пароль)");
    }
  };

  if (!profile) return <p>Завантаження...</p>;

  return (
    <div>
      <h2>Мій профіль</h2>

      <p>Email: {profile.email}</p>
      <p>Username: {profile.username}</p>

      <div>
        <label>Display name</label>
        <input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
      </div>

      <div>
        <label>Avatar URL</label>
        <input value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
      </div>

      <button onClick={saveProfile}>Зберегти профіль</button>

      <hr />

      <div>
        <label>Поточний пароль</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      <div>
        <label>Новий пароль</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      <button onClick={savePassword}>Змінити пароль</button>

      {message && <p>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
