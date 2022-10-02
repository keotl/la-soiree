from typing import List
from jivago.inject.annotation import Component, Singleton
from jivago.lang.annotations import Inject
from jivago.lang.stream import Stream
from sqlalchemy import select, or_
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session
from la_soiree.db.entities import Episode, MediaFile, Segment
from la_soiree.db.models import SegmentModel


@Component
@Singleton
class QueryService(object):

    @Inject
    def __init__(self, database_engine: Engine):
        self._engine = database_engine

    def query_segments_by_text(self, query_text: str) -> List[SegmentModel]:
        pattern = f"%{query_text}%"
        stmt = select(Segment, MediaFile, Episode) \
            .join(MediaFile, Segment.media_id == MediaFile.media_id) \
            .join(Episode, Segment.episode_id == Episode.id) \
            .where(or_(Segment.title.like(pattern),
                       Segment.subtitle.like(pattern),
                       Segment.summary.like(pattern)))

        with Session(self._engine) as session:
            return Stream(session.execute(stmt)) \
                .map(lambda s, m, e: SegmentModel(s.id,
                                                  s.episode_id,
                                                  s.title,
                                                  s.subtitle,
                                                  s.summary,
                                                  s.display_time,
                                                  s.media_id,
                                                  m.url,
                                                  s.seek_time,
                                                  s.duration,
                                                  e.date,
                                                  e.title)) \
                .toList()
