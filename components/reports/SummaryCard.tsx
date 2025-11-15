
import React from 'react';
import styles from './SummaryCard.module.css'; 

type Props = {
  title: string;
  value: string;
};

export default function SummaryCard({ title, value }: Props) {
  return (
    <div className={styles.card}>
      <p className={styles.title}>{title}</p>
      <p className={styles.value}>{value}</p>
    </div>
  );
}