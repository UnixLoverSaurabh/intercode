let Peer = require('simple-peer')
let socket = io()
const video = document.querySelector('video')
let client = {}
//get stream


if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
}

if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function(constraints) {

        // First get ahold of the legacy getUserMedia, if present
        var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        // Some browsers just don't implement it - return a rejected promise with an error
        // to keep a consistent interface
        if (!getUserMedia) {
            return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
        }

        // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
        return new Promise(function(resolve, reject) {
            getUserMedia.call(navigator, constraints, resolve, reject);
        });
    }
}

    navigator.mediaDevices.getUserMedia({ video: { frameRate: { ideal: 10, max: 15 } }, audio: true })
        .then(stream => {
            socket.emit('NewClient')
            video.srcObject = stream
            video.play()
            video.style.filter="none"
            SendFilter("none")

            //used to initialize a peer
            function InitPeer(type) {
                let peer = new Peer({ initiator: (type == 'init') ? true : false, stream: stream, trickle: false })
                peer.on('stream', function (stream) {
                    CreateVideo(stream)
                })
                //This isn't working in chrome; works perfectly in firefox.
                // peer.on('close', function () {
                //     document.getElementById("peerVideo").remove();
                //     peer.destroy()
                // })
                peer.on('data', function (data) {
                    let decodedData = new TextDecoder('utf-8').decode(data)
                    let peervideo = document.querySelector('#peerVideo')
                })
                return peer
            }

            //for peer of type init
            function MakePeer() {
                client.gotAnswer = false
                let peer = InitPeer('init')
                peer.on('signal', function (data) {
                    if (!client.gotAnswer) {
                        socket.emit('Offer', data)
                    }
                })
                client.peer = peer
            }

            //for peer of type not init
            function FrontAnswer(offer) {
                let peer = InitPeer('notInit')
                peer.on('signal', (data) => {
                    socket.emit('Answer', data)
                })
                peer.signal(offer)
                client.peer = peer
            }

            function SignalAnswer(answer) {
                client.gotAnswer = true
                let peer = client.peer
                peer.signal(answer)
            }

            function CreateVideo(stream) {
                CreateDiv()

                let video = document.createElement('video')
                video.id = 'peerVideo'
                video.srcObject = stream
                video.setAttribute('class', 'embed-responsive-item')
                document.querySelector('#peerDiv').appendChild(video)
                video.play()
                //wait for 1 sec
                setTimeout(() => SendFilter("none"), 1000)

                video.addEventListener('click', () => {
                    if (video.volume != 0)
                        video.volume = 0
                    else
                        video.volume = 1
                })

            }

            function SessionActive() {
                document.write('Session Active. Please come back later')
            }

            function SendFilter(filter) {
                if (client.peer) {
                    client.peer.send(filter)
                }
            }

            function RemovePeer() {
                document.getElementById("peerVideo").remove();
                document.getElementById("muteText").remove();
                if (client.peer) {
                    client.peer.destroy()
                }
            }

            socket.on('BackOffer', FrontAnswer)
            socket.on('BackAnswer', SignalAnswer)
            socket.on('SessionActive', SessionActive)
            socket.on('CreatePeer', MakePeer)
            socket.on('Disconnect', RemovePeer)

        })
        .catch(err => document.write(err))







function CreateDiv() {
    let div = document.createElement('div')
    div.setAttribute('class', "centered")
    div.id = "muteText"
    div.innerHTML = "Click to Mute/Unmute"
    document.querySelector('#peerDiv').appendChild(div)
}