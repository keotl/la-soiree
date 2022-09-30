from typing import NamedTuple, Optional
import requests
from jivago.lang.stream import Stream

from extraction.ohdio_response_proxy import OhdioApi, OhdioProgrammeResponseProxy


class EpisodeSegment(NamedTuple):
    episode_id: int
    title: Optional[str]
    subtitle: Optional[str]
    summary: Optional[str]
    display_time: str
    media_id: str
    seek_time: int
    duration: int

def query_segments(episode_id: int):
    res = requests.get(f"https://services.radio-canada.ca/neuro/sphere/v1/audio/apps/products/programmes/e/episodes/{episode_id}?context=web")
    if res.ok:
        return Stream(res.json()["content"]["contentDetail"]["items"]) \
            .map(lambda x: EpisodeSegment(
                episode_id=episode_id,
                title=x["title"],
                subtitle=x["subtitle"],
                summary=x["summary"],
                display_time=x["index"]["value"],
                media_id=x["media2"]["id"],
                seek_time=x["media2"]["seekTime"],
                duration=x["media2"]["duration"]["durationInSeconds"]
            )) \
            .toList()
    return []

def query_media_url(media_id: str) -> str:
    response = requests.get(
        f"https://services.radio-canada.ca/media/validation/v2/?appCode=medianet&connectionType=hd&deviceType=ipad&idMedia={media_id}&multibitrate=true&output=json&tech=hls")
    if response.ok:
        return response.json()["url"]
    return ""

if __name__ == '__main__':
    # Stream(query_segments(611475))\
    #     .forEach(print)
    print(""""###### EPISODES ######""")
    for episode in OhdioProgrammeResponseProxy(OhdioApi(), "la-soiree-est-encore-jeune", max_pages=2).episodes:
        print(episode.title, episode.guid)


    print(""""###### SEGMENTS ######""")
