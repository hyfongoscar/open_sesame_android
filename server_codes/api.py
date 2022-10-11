import subprocess
import urllib.request
import fastwer
from flask import Flask, request, abort, jsonify

app = Flask(__name__)


@app.route('/enroll', methods=['POST'])
def enroll():
  if not request.json or 'url' not in request.json or 'user' not in request.json:
    abort(400)

  url = request.json['url']
  urllib.request.urlretrieve(url, "enroll.wav")
  user = request.json['user']

  subprocess.run(["mkdir", "user_audio/" + user ])
  subprocess.run(["mv", "enroll.wav", "user_audio/" + user + "/enroll.wav"], check=True)

  subprocess.run(["bash", "speakerV.sh", "./user_audio", "enroll"], check=True)

  print("Audio file received, enrolled")

  return jsonify({'url': url})


@app.route('/verify', methods=['POST'])
def verify():
  if not request.json or 'url' not in request.json or 'user' not in request.json or 'digits' not in request.json:
    abort(400)

  url = request.json['url']
  urllib.request.urlretrieve(url, "verify.wav")
  user = request.json['user']
  appDigits = request.json['digits']

  subprocess.run(["mv", "verify.wav", "user_audio/" + user + "/verify.wav"], check=True)

  svProcess = subprocess.Popen(["bash", "speakerV.sh", "./user_audio", "verify", user])

  f = open("cdigit/transcriptions/wav.scp", "w")
  f.write(user + " " + "../user_audio/" + user + "/verify.wav")
  f.close()

  srProcess = subprocess.Popen(["sudo", "bash", "decode.sh"], cwd="cdigit")

  svProcess.wait()
  srProcess.wait()

  f = open("eval_scores", "r")
  svScore = f.read().split()[2]
  f.close()

  f = open("cdigit/transcriptions/one-best-hypothesis.txt", "r")
  srDigits = f.read().split()[1:]
  srDigits = "".join(srDigits)
  f.close()

  srError = fastwer.score_sent(srDigits, appDigits, char_level=True)

  print("Decoded digits:" + str(srDigits))
  print("Word error rate:" + str(srError))

  return jsonify({'url': url, 'svScore': svScore, 'srError': srError, 'decodedDigits': srDigits})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
