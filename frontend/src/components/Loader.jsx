import styles from './Loader.module.css';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <p className={styles.text}>{text}</p>
    </div>
  );
}
