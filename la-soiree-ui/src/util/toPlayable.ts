import { EpisodeSegment } from "../api";

export function segmentToPlayable(s: EpisodeSegment) {
  return {
    url: s.media_url,
    title: `${s.episode_title} – ${s.title}`,
    startPos: s.seek_time,
    maxDuration: s.duration,
  };
}
