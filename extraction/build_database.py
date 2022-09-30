import datetime
import os.path
from typing import Tuple, List

from jivago.lang.stream import Stream
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from extraction.episode_segments import query_segments, query_media_url
from extraction.ohdio_response_proxy import OhdioProgrammeResponseProxy, OhdioApi
from la_soiree.db.entities import Episode, create_schema, Segment, MediaFile
import multiprocessing

def build_database():
    start = datetime.datetime.now()
    pool = multiprocessing.Pool(4)
    res = pool.map(map_episode,
    OhdioProgrammeResponseProxy(OhdioApi(), "la-soiree-est-encore-jeune", max_pages=None).episodes)

    engine = create_engine('sqlite:///db.db')
    create_schema(engine)
    with Session(engine) as s:
        for x in res:
            s.add(x[0])
            s.add_all(x[1])
            s.add_all(x[2])
        s.commit()
    print(f"Completed in {datetime.datetime.now() - start}.")


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
    if os.path.exists("db.db"):
        os.remove("db.db")
        print("Removed old database db.db.")
    build_database()
