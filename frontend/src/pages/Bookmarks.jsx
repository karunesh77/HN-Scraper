import { useEffect, useState } from 'react';
import api from '../api/axios';
import StoryCard from '../components/StoryCard';
import Loader from '../components/Loader';
import styles from './Stories.module.css';

export default function Bookmarks() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/stories/bookmarks');
        setStories(data);
      } catch {
        setError('Failed to load bookmarks.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.heading}>★ Your Bookmarks</h1>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {loading ? (
        <Loader text="Loading your bookmarks..." />
      ) : stories.length === 0 ? (
        <div className={styles.spinner}>No bookmarks yet. Save some stories!</div>
      ) : (
        <div className={styles.list}>
          {stories.map((story, i) => (
            <StoryCard key={story._id} story={story} rank={i + 1} />
          ))}
        </div>
      )}
    </main>
  );
}
