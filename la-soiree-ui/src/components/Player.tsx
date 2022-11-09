import Hls from "hls.js";
import { useContext, useEffect, useRef, useState } from "react";
import { PlaylistContext } from "../context/PlaylistContext";
import { formatRemainingTime } from "../util/formatting";
import { BaseWindow } from "./BaseWindow";
import styles from "./Player.module.css";

export function Player() {
  const context = useContext(PlaylistContext);
  const title =
    context.queue.length > 0 ? context.queue[0].title : "Sans contmenu";

  const audioElement = useRef<HTMLAudioElement>(null);
  const hls = useRef(new Hls());
  const [audioPosition, setAudioPosition] = useState(0);

  useEffect(() => {
    if (!audioElement.current) {
      return;
    }

    if (context.queue.length > 0) {
      audioElement.current.pause();
      hls.current.destroy();
      if (context.queue[0].url.endsWith(".m3u8")) {
        hls.current = new Hls();
        hls.current.attachMedia(audioElement.current);
        hls.current.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.current.loadSource(context.queue[0].url);
        });
        hls.current.on(Hls.Events.MANIFEST_PARSED, () => {
          if (audioElement.current) {
            audioElement.current.currentTime = context.queue[0].startPos;
            audioElement.current.play();
          }
        });
      } else {
        audioElement.current.src = context.queue[0].url;
        audioElement.current.play();
      }
    } else {
      audioElement.current.pause();
      hls.current.destroy();
    }
  }, [audioElement, context.queue]);

  useEffect(() => {
    if (!audioElement.current || context.queue.length === 0) {
      return;
    }
    if (
      audioElement.current.duration > 1 &&
      context.queue[0].maxDuration &&
      audioPosition >= context.queue[0].maxDuration + context.queue[0].startPos
    ) {
      context.advance();
    }
  }, [audioPosition, audioElement.current, context.queue]);

  return (
    <>
      <audio
        ref={audioElement}
        onTimeUpdate={(e) => {
          setAudioPosition(e.currentTarget.currentTime);
        }}
        onEnded={(e) => {
          e.currentTarget.pause();
          e.currentTarget.currentTime = 0;
          context.advance();
        }}
      />
      {context.queue.length > 0 && (
        <BaseWindow
          title="Lecteur"
          defaultLeft={1000}
          defaultWidth={200}
          defaultHeight={125}
          onClose={() => context.clear()}
          resizable={false}
        >
          <div className={styles.infoContainer}>
            <div className={styles["marquee-section"]}>
              <div className={styles["marquee-div"]}>
                <div className={styles.marquee}>{title}</div>
              </div>
            </div>
            <div className={styles.durationText}>
              {context.queue.length > 0 &&
                audioElement.current &&
                formatRemainingTime(
                  Math.min(
                    (context.queue[0].maxDuration || 9999999) +
                      context.queue[0].startPos,
                    audioElement.current.duration
                  ),
                  audioPosition
                )}
            </div>
          </div>
          <div className={styles.buttonContainer}>
            <button
              className={"btn " + styles.button}
              onClick={() => {
                context.setQueue(context.queue);
              }}
            >
              <span className="material-symbols-outlined">skip_previous</span>
            </button>
            <button
              className={"btn " + styles.button}
              onClick={() => {
                if (audioElement.current) {
                  audioElement.current.currentTime =
                    audioElement.current.currentTime - 10;
                }
              }}
            >
              <span className="material-symbols-outlined">replay_10</span>
            </button>
            <button
              className={"btn " + styles.button}
              onClick={() => {
                if (audioElement.current?.paused) {
                  audioElement.current?.play();
                } else {
                  audioElement.current?.pause();
                }
              }}
            >
              {audioElement.current && audioElement.current.paused ? (
                <span className="material-symbols-outlined">play_arrow</span>
              ) : (
                <span className="material-symbols-outlined">pause</span>
              )}
            </button>
            <button
              className={"btn " + styles.button}
              onClick={() => {
                if (audioElement.current) {
                  audioElement.current.currentTime =
                    audioElement.current.currentTime + 10;
                }
              }}
            >
              <span className="material-symbols-outlined">forward_10</span>
            </button>
            <button
              className={"btn " + styles.button}
              onClick={() => context.advance()}
            >
              <span className="material-symbols-outlined">skip_next</span>
            </button>
          </div>
        </BaseWindow>
      )}
    </>
  );
}
