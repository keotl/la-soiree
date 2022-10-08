const API_BASE = "/api";

export type EpisodeSegment = {
  id: number;
  aired_date: string;
  display_time: string;
  duration: number;
  episode_id: number;
  episode_title: string;
  media_id: string;
  media_url: string;
  seek_time: number;
  subtitle: string;
  summary: string;
  title: string;
};

export function searchSegments(text: string): Promise<EpisodeSegment[]> {
  return fetch(API_BASE + "/segments?" + new URLSearchParams({ q: text })).then(
    (r) => r.json()
  );
}
