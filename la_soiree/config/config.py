from jivago.inject.annotation import Singleton, Component
from jivago.lang.annotations import Inject
from jivago.config.properties.application_properties import ApplicationProperties
from jivago.config.properties.system_environment_properties import SystemEnvironmentProperties

@Singleton
@Component
class Config(object):
    
    @Inject
    def __init__(self, application: ApplicationProperties, env: SystemEnvironmentProperties):
        self.db_connection = application.get("DATABASE_CONNECTION_STRING") or env.get("DATABASE_CONNECTION_STRING") or "sqlite://db.db"
        
