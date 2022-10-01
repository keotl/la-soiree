from datetime import datetime
from typing import NamedTuple

from jivago.lang.annotations import Serializable

@Serializable
class SegmentModel(NamedTuple):
    episode_id: int
    title: str
    subtitle: str
    summary: str
    display_time: str
    media_id: str
    media_url: str
    seek_time: int
    duration: int
    aired_date: datetime
    episode_title: str
