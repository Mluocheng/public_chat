import styles from './index.module.css';

type Props = {
  text: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  onClick: () => void;
};

export default function Button({ className, text, onClick }: Props) {
    return (
      <div className={`${styles.button} ${className?className: ''}`} onClick={onClick}>
        {text}
      </div>
    );
  }
  