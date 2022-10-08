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
  resizable?: boolean;
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
    document.getElementById("page-content")!.onpointermove = onMouseMove;
    if (isResizing) {
      document.getElementById("page-content")!.onpointerup = () => {
        setIsResizing(false);
        setDragStartPoint(null);
      };
      return () => {
        document.getElementById("page-content")!.onpointermove = null;
        document.getElementById("page-content")!.onpointerup = null;
      };
    }
    return () => {
      document.getElementById("page-content")!.onpointermove = null;
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
      className={
        activeWindow.activeWindow === props.title
          ? "window " + styles.onTop
          : "window"
      }
      style={{ position: "absolute", width, height, left, top }}
      onPointerDown={() => activeWindow.setActiveWindow(props.title)}
    >
      <div
        className={
          activeWindow.activeWindow === props.title
            ? "title-bar"
            : "inactive-title-bar"
        }
        style={{ cursor: "pointer" }}
        onPointerDown={(e) => {
          setIsDragging(true);
          setDragStartPoint([e.clientX - left, e.clientY - top]);
        }}
        onPointerUp={() => {
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
        {activeWindow.activeWindow === props.title && (
          <button aria-label="Resize" disabled className="hidden"></button>
        )}
      </div>

      {props.children}
      {!(props.resizable === false) && (
        <div
          className={styles.resizeClickZone}
          onPointerDown={(e) => {
            setIsResizing(true);
            setDragStartPoint([e.clientX - width, e.clientY - height]);
          }}
          onPointerUp={() => {
            setIsResizing(false);
            setDragStartPoint(null);
          }}
        />
      )}
    </div>
  );
}
