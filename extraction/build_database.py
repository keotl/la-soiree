import datetime
import os.path
from typing import Tuple, List

from jivago.lang.stream import Stream
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.sql import text

LOG_REQUESTS = True
if LOG_REQUESTS:
    import sys
    from extraction.logging_requests import INSTANCE as logging_requests_instance
    sys.modules["requests"] = logging_requests_instance

from extraction.episode_segments import query_segments, query_media_url
from extraction.ohdio_response_proxy import OhdioProgrammeResponseProxy, OhdioApi
from la_soiree.db.entities import Episode, create_schema, Segment, MediaFile
import multiprocessing

def build_database():
    start = datetime.datetime.now()
    pool = multiprocessing.Pool(4)
    res = pool.map(map_episode,
    reversed(OhdioProgrammeResponseProxy(OhdioApi(), "la-soiree-est-encore-jeune", max_pages=None).episodes))
    res = remove_duplicates(res)
    engine = create_engine('sqlite:///../db.db')
    create_schema(engine)
    with Session(engine) as s:
        for x in res:
            s.add(x[0])
            s.add_all(x[1])
            s.add_all(x[2])
        s.commit()
        print("======Sanity checks======")
        n_episodes = next(s.execute(text("SELECT COUNT() FROM episodes;")))[0]
        print(f"Saved {n_episodes} episodes.")
        orphan_media_segment = text("SELECT count() FROM segments LEFT JOIN media ON segments.media_id=media.media_id WHERE media.media_id is NULL;")
        segments_with_missing_media_id = next(s.execute(orphan_media_segment))[0]
        print(f"Found {segments_with_missing_media_id} segments with a missing media URL.")

    print(f"Completed in {datetime.datetime.now() - start}.")

def remove_duplicates(res):
    seen_media_ids = set()
    new_res = []
    for e,s,m in res:
        new_m = []
        for media in m:
            if media.media_id in seen_media_ids:
                continue
            seen_media_ids.add(media.media_id)
            new_m.append(media)

        new_res.append((e,s,new_m))
    return new_res


def map_episode(episode) -> Tuple[Episode, List[Segment], List[MediaFile]]:
    segments = query_segments(episode.episode_id)
    media_urls = Stream(episode.streams).map(lambda id: (id, query_media_url(id)))
    return Episode(id=episode.episode_id,
            title=episode.title,
            description=episode.description,
            date=episode.date.isoformat(),
            duration=episode.duration,
            fileSizeInBytes=episode.fileSizeInBytes), Stream(segments)\
        .map(lambda x: Segment(episode_id=x.episode_id,
                               title=x.title,
                               subtitle=x.subtitle,
                               summary=x.summary,
                               display_time=x.display_time,
                               media_id=x.media_id,
                               seek_time=x.seek_time,
                               duration=x.duration)).toList(),\
        media_urls.map(lambda id, url: MediaFile(media_id=id, url=url)).toList()

if __name__ == '__main__':
    if os.path.exists("../db.db"):
        os.remove("../db.db")
        print("Removed old database db.db.")
    build_database()
