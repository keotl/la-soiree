import { ReactNode, useContext, useEffect, useState } from "react";
import { ActiveWindowContext } from "../context/ActiveWindowContext";
import styles from "./BaseWindow.module.css";

type Props = {
  children: ReactNode | ReactNode[];
  title: string;
  defaultWidth?: number;
  defaultHeight?: number;
  defaultLeft?: number;
  defaultTop?: number;
  onClose?: () => void;
};

export function BaseWindow(props: Props) {
  const [width, setWidth] = useState(props.defaultWidth || 600);
  const [height, setHeight] = useState(props.defaultHeight || 200);
  const [left, setLeft] = useState(props.defaultLeft || 100);
  const [top, setTop] = useState(props.defaultTop || 40);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartPoint, setDragStartPoint] = useState<number[] | null>(null);
  const [isResizing, setIsResizing] = useState(false);

  const activeWindow = useContext(ActiveWindowContext);

  useEffect(() => {
    document.getElementById("page-content")!.onmousemove = onMouseMove;
    if (isResizing) {
      document.getElementById("page-content")!.onmouseup = () => {
        setIsResizing(false);
        setDragStartPoint(null);
      };
      return () => {
        document.getElementById("page-content")!.onmousemove = null;
        document.getElementById("page-content")!.onmouseup = null;
      };
    }
    return () => {
      document.getElementById("page-content")!.onmousemove = null;
    };
  }, [
    dragStartPoint,
    setLeft,
    setTop,
    setHeight,
    setWidth,
    isDragging,
    isResizing,
  ]);

  function onMouseMove(e: MouseEvent) {
    if (!dragStartPoint) {
      return;
    }
    if (isDragging) {
      setLeft(e.clientX - dragStartPoint[0]);
      setTop(Math.max(20, e.clientY - dragStartPoint[1]));
    } else if (isResizing) {
      setWidth(e.clientX - dragStartPoint[0]);
      setHeight(Math.max(40, e.clientY - dragStartPoint[1]));
    }
  }

  return (
    <div
      className="window"
      style={{ position: "absolute", width, height, left, top }}
      onMouseDown={() => activeWindow.setActiveWindow(props.title)}
    >
      <div
        className={
          activeWindow.activeWindow === props.title
            ? "title-bar"
            : "inactive-title-bar"
        }
        style={{ cursor: "pointer" }}
        onMouseDown={(e) => {
          setIsDragging(true);
          setDragStartPoint([e.clientX - left, e.clientY - top]);
        }}
        onMouseUp={() => {
          setIsDragging(false);
          setDragStartPoint(null);
        }}
      >
        {activeWindow.activeWindow === props.title && (
          <button
            aria-label="Close"
            className="close"
            onClick={props.onClose}
          />
        )}
        <h1 className="title">{props.title}</h1>
        {/* <button aria-label="Resize" className="resize"></button>*/}
      </div>

      {props.children}
      <div
        className={styles.resizeClickZone}
        onMouseDown={(e) => {
          setIsResizing(true);
          setDragStartPoint([e.clientX - width, e.clientY - height]);
        }}
        onMouseUp={() => {
          setIsResizing(false);
          setDragStartPoint(null);
        }}
      />
    </div>
  );
}
