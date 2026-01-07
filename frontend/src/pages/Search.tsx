import { useState } from "react";
import { searchMovies } from "../api/search.api";

interface Movie {
  id: number;
  title: string;
  year: number;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query) return;
    setLoading(true);
    const res = await searchMovies(query);
    setResults(res.data);
    setLoading(false);
  };

  return (
    <div>
      <h2>Пошук фільмів</h2>

      <input
        placeholder="Введіть назву фільму"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={search}>Шукати</button>

      {loading && <p>Завантаження...</p>}

      <ul>
        {results.map((m) => (
          <li key={m.id}>
            {m.title} ({m.year})
          </li>
        ))}
      </ul>
    </div>
  );
}
