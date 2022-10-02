import la_soiree
from jivago.jivago_application import JivagoApplication

application = JivagoApplication(la_soiree, debug=True)

if __name__ == '__main__':
    application.run_dev()
