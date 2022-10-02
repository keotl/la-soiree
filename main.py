import la_soiree
from jivago.jivago_application import JivagoApplication

app = JivagoApplication(la_soiree, debug=True)

if __name__ == '__main__':
    app.run_dev()
