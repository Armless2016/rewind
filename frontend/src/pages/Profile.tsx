import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/profile.api";

interface ProfileData {
  email: string;
  nickname: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    const res = await getProfile();
    setProfile(res.data);
    setNickname(res.data.nickname);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    await updateProfile({
      nickname: nickname || undefined,
      password: password || undefined,
    });
    setMessage("Зміни збережено");
    setPassword("");
    load();
  };

  if (!profile) return <p>Завантаження...</p>;

  return (
    <div>
      <h2>Мій профіль</h2>

      <p>Email: {profile.email}</p>

      <div>
        <label>Нікнейм</label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
      </div>

      <div>
        <label>Новий пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={save}>Зберегти</button>

      {message && <p>{message}</p>}
    </div>
  );
}
