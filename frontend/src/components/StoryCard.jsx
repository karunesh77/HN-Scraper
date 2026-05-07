import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './StoryCard.module.css';

export default function StoryCard({ story, rank }) {
  const { user, bookmarks, toggleBookmark } = useAuth();
  const navigate = useNavigate();
  const isBookmarked = bookmarks.includes(story._id);

  const handleBookmark = () => {
    if (!user) return navigate('/login');
    toggleBookmark(story._id);
  };

  const domain = story.url ? (() => {
    try { return new URL(story.url).hostname.replace('www.', ''); } catch { return ''; }
  })() : '';

  return (
    <div className={styles.card}>
      <div className={styles.rank}>{rank}</div>
      <div className={styles.body}>
        <div className={styles.titleRow}>
          {story.url ? (
            <a href={story.url} target="_blank" rel="noopener noreferrer" className={styles.title}>
              {story.title}
            </a>
          ) : (
            <span className={styles.title}>{story.title}</span>
          )}
          {domain && <span className={styles.domain}>({domain})</span>}
        </div>
        <div className={styles.meta}>
          <span className={styles.points}>▲ {story.points} pts</span>
          <span>by <strong>{story.author}</strong></span>
          <span>{story.postedAt}</span>
          <button
            className={`${styles.bookmark} ${isBookmarked ? styles.active : ''}`}
            onClick={handleBookmark}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
          >
            {isBookmarked ? '★' : '☆'} {isBookmarked ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
