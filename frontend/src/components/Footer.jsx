import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>
        Data sourced from{' '}
        <a href="https://news.ycombinator.com" target="_blank" rel="noopener noreferrer">
          Hacker News
        </a>{' '}
        · Built with MERN Stack
      </p>
    </footer>
  );
}
