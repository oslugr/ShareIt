function PeersManager()
{
    var peers = {}

    this.connectTo = function(uid, onsuccess, onerror)
    {
        // Search the peer between the list of currently connected peers
        var peer = peers[uid]

        // Peer is not connected, create a new channel
        if(!peer)
        {
            // Create PeerConnection
            peer = peers[uid] = _createPeerConnection();
            peer.open = function()
            {
                _initDataChannel(peer, peer.createDataChannel())
            }
            peer.onerror = function()
            {
                if(onerror)
                    onerror()
            }

            // Send offer to new PeerConnection
            var offer = peer.createOffer();

            signaling.emit("offer", offer.toSdp(), uid);

            peer.setLocalDescription(peer.SDP_OFFER, offer);
        }

        // Peer is connected and we have defined an 'onsucess' callback
        else if(onsuccess)
            onsuccess(peer._channel)
    }

    this.getPeer(socketId)
    {
        return peers[socketId]
    }

    this.setPeer(socketId, peerConnection)
    {
        peers[socketId] = peerConnection
    }
}