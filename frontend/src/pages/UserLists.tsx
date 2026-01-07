import { useEffect, useState } from "react";
import { getUserLists, createList } from "../api/lists.api";

interface List {
  id: number;
  name: string;
}

export default function UserLists() {
  const [lists, setLists] = useState<List[]>([]);
  const [name, setName] = useState("");

  useEffect(() => {
    getUserLists().then(res => setLists(res.data));
  }, []);

  const create = async () => {
    await createList(name);
    const res = await getUserLists();
    setLists(res.data);
    setName("");
  };

  return (
    <div>
      <h2>Мої списки</h2>

      <input
        placeholder="Назва списку"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <button onClick={create}>Створити</button>

      <ul>
        {lists.map(list => (
          <li key={list.id}>{list.name}</li>
        ))}
      </ul>
    </div>
  );
}
