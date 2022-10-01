import json
import requests
import urllib.parse
import os.path
import os

class LoggingRequests(object):
    def __init__(self, save_requests: bool, base_folder: str="") -> None:
        self._save_requests = save_requests
        self._base_folder = base_folder

    def get(self, url, *args, **kwargs):
        components = urllib.parse.urlparse(url)
        path = os.path.join(self._base_folder, components.path[1:] + ("?" + components.query if components.query else "")) + "_"
        if os.path.exists(path):
            return MockedResponse.read_from_file(path)
        raw_res = requests.get(url, *args, **kwargs)
        res = MockedResponse(raw_res.status_code, raw_res.headers.__dict__, raw_res.text)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            res.write_to_file(path)
        with open(path + "_text", "w") as f:
            f.write(res.text)
        return res

class MockedResponse(object):
    def __init__(self, status_code: int, headers: dict, text: str):
        self.status_code = status_code
        self.headers = headers
        self.text = text

    def json(self):
        return json.loads(self.text)

    @property
    def ok(self):
        return self.status_code < 400

    def write_to_file(self, filepath: str):
        with open(filepath, "w") as f:
            json.dump({"status_code": self.status_code, "headers": self.headers, "text": self.text}, f)
    @staticmethod
    def read_from_file(filepath: str) -> "MockedResponse":
        with open(filepath) as f:
            x = json.load(f)
            return MockedResponse(x["status_code"], x["headers"], x["text"])

INSTANCE = LoggingRequests(True, os.path.join(os.path.dirname(__file__), "raw_requests"))
