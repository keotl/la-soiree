from datetime import datetime
from typing import Optional, List, NamedTuple

import requests

from extraction.dateparse import parse_fr_date


class ProgrammeDescriptor(NamedTuple):
    title: str
    description: str
    author: str
    link: str
    image_url: str


class EpisodeDescriptor(NamedTuple):
    title: str
    description: str
    guid: str
    date: datetime
    duration: int


class OhdioApi(object):

    def __init__(self,
                 base_url: str = "https://services.radio-canada.ca/neuro/sphere/v1/audio/apps/products/programmes-v2/") -> None:
        self.base_url = base_url

    def query_programme(self, programme_id: str) -> dict:
        response = requests.get(self.base_url + programme_id)
        if response.ok:
            return response.json()
        else:
            raise Exception(response.text)

    def query_episodes(self, programme_id: str, page_number) -> dict:
        response = requests.get(self.base_url + programme_id + "/" + str(page_number))
        if response.ok:
            return response.json()

    def query_episode_segments(self, programme_id: str, episode_id: str) -> dict:
        response = requests.get(
            f"https://services.radio-canada.ca/neuro/sphere/v1/audio/apps/products/programmes/{programme_id}/episodes/{episode_id}",
            timeout=10)
        if response.ok:
            return response.json()
        else:
            raise Exception(response.text)


class OhdioProgrammeResponseProxy(object):

    def __init__(self, api: OhdioApi, show_id: str, reverse_episode_segments: bool = False):
        self.reverse_episode_segments = reverse_episode_segments
        self.programme_id = show_id
        self._api = api
        self._episodes: Optional[List[EpisodeDescriptor]] = None
        self._programme: Optional[ProgrammeDescriptor] = None

    @property
    def programme(self) -> ProgrammeDescriptor:
        if self._programme is None:
            self._fetch_programme()

        return self._programme  # type: ignore

    @property
    def episodes(self) -> List[EpisodeDescriptor]:
        if self._episodes is None:
            self._fetch_episodes()

        return self._episodes  # type: ignore

    def _fetch_episodes(self):
        res = []
        current_page = 1
        while True:
            try:
                response = self._api.query_episodes(self.programme_id, current_page)
                if not response["content"]["contentDetail"]["items"]:
                    break
                for x in response["content"]["contentDetail"]["items"]:
                    episode_id = x["media2"]["context"]["id"]
                    segments = self._api.query_episode_segments(self.programme_id, episode_id)
                    distinct_streams = []

                    for segment in segments["content"]["contentDetail"]["items"]:
                        stream_id = segment["media2"]["id"]
                        if stream_id not in distinct_streams:
                            distinct_streams.append(stream_id)
                    if self.reverse_episode_segments:
                        distinct_streams = distinct_streams[::-1]

                    for stream_id in distinct_streams:
                        res.append(self._map_episode(x, stream_id))
                current_page += 1
            except Exception:
                break

        self._episodes = res

    def _map_episode(self, json: dict, stream_id: str) -> Optional[EpisodeDescriptor]:
        return EpisodeDescriptor(
            title=clean(json["title"]),
            description=clean(json["summary"]),
            guid=stream_id,
            date=parse_fr_date(json["media2"]["details"]),
            duration=json["media2"]["duration"]["durationInSeconds"])

    def _fetch_programme(self):
        json = self._api.query_programme(self.programme_id)
        self._programme = ProgrammeDescriptor(
            title=clean(json["header"]["title"]),
            description=clean(json["header"]["summary"]),
            author="Radio-Canada",
            link=json["header"]["share"]["url"],
            image_url=json["header"]["picture"]["url"].replace("{0}", "400").replace("{1}", "1x1"),
        )


def clean(human_readable_text: str) -> str:
    return (human_readable_text or "") \
        .replace("&nbsp;", " ") \
        .replace("&", "&amp; ") \
        .replace("<br>", "<br/>")
