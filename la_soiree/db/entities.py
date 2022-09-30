from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base
EntityBase = declarative_base()

class Episode(EntityBase):
    __tablename__ = "episodes"
    id=Column(Integer, primary_key=True)
    title=Column(String)
    description=Column(String)
    date=Column(String)
    duration=Column(Integer)
    fileSizeInBytes=Column(Integer)

class Segment(EntityBase):
    __tablename__ = "segments"
    id=Column(Integer,primary_key=True,autoincrement=True)
    episode_id=Column(Integer)
    title=Column(String)
    subtitle=Column(String)
    summary=Column(String)
    display_time=Column(String)
    media_id=Column(String)
    seek_time=Column(Integer)
    duration=Column(Integer)

class MediaFile(EntityBase):
    __tablename__ = "media"
    id=Column(Integer, primary_key=True, autoincrement=True)
    media_id=Column(String)
    url=Column(String)

def create_schema(engine):
    EntityBase.metadata.create_all(engine)
