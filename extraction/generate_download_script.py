from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy import select

from la_soiree.db.entities import MediaFile


def main():
    engine = create_engine('sqlite:///db.db')
    with Session(engine) as s:
        stmt = select(MediaFile)
        for f in s.scalars(stmt):
            print(f"ffmpeg -loglevel error -i {f.url} {f.media_id}.mp4")

if __name__ == '__main__':
    main()
