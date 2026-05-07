import { useEffect, useState } from 'react';
import api from '../api/axios';
import StoryCard from '../components/StoryCard';
import Loader from '../components/Loader';
import styles from './Stories.module.css';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [scraping, setScraping] = useState(false);
  const [error, setError] = useState('');

  const fetchStories = async (p = 1) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/stories?page=${p}&limit=10`);
      setStories(data.stories);
      setPagination(data.pagination);
    } catch {
      setError('Failed to load stories. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStories(page); }, [page]);

  const handleScrape = async () => {
    setScraping(true);
    try {
      await api.post('/scrape');
      await fetchStories(1);
      setPage(1);
    } catch {
      setError('Scrape failed.');
    } finally {
      setScraping(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Top Hacker News Stories</h1>
        <button className={styles.scrapeBtn} onClick={handleScrape} disabled={scraping}>
          {scraping ? 'Scraping...' : '↻ Refresh Stories'}
        </button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <Loader text="Fetching stories..." />
      ) : (
        <>
          <div className={styles.list}>
            {stories.map((story, i) => (
              <StoryCard
                key={story._id}
                story={story}
                rank={(pagination.page - 1) * pagination.limit + i + 1}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span>Page {pagination.page} of {pagination.totalPages}</span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}
