from jivago.lang.stream import Stream
from jivago.wsgi.annotations import Resource
from jivago.lang.annotations import Inject
from jivago.wsgi.methods import GET
from jivago.wsgi.invocation.parameters import QueryParam

from la_soiree.db.query_service import QueryService

@Resource("/segments")
class QueryResource(object):

    @Inject
    def __init__(self, query_service: QueryService):
        self._query_service = query_service

    @GET
    def query_by_text(self, q: QueryParam[str]):
        return Stream(self._query_service.query_segments_by_text(str(q))).toList()
