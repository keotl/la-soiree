import styles from "./Icon.module.css";

type Props = {
  icon: string;
  text: string;
  onClick?: () => void;
};

export function Icon(props: Props) {
  return (
    <div className={styles.container} onClick={props.onClick}>
      <img src={`/Sprites/${props.icon}.png`} className={styles.image} />
      <div className={styles.text}>{props.text}</div>
    </div>
  );
}
