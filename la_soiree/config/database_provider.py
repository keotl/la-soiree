from jivago.inject.annotation import Provider, Singleton
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from la_soiree.config.config import Config

@Provider
@Singleton
def database_connection_provider(config: Config) -> Engine:
    return create_engine(config.db_connection)
