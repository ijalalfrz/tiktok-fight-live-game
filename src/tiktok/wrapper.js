/**
 * Wrapper for client-side TikTok connection over Socket.IO
 * With reconnect functionality.
 */
import openSocket from "socket.io-client";


export default class TikTokIOConnection {
    constructor(backendUrl) {
        
        this.socket = openSocket(backendUrl);
        this.uniqueId = null;
        this.options = null;

        this.socket.on('connect', () => {
            console.info("Socket connected!");

            // Reconnect to streamer if uniqueId already set
            if (this.uniqueId) {
                this.setUniqueId();
            }
        })

        this.socket.on('disconnect', () => {
            console.warn("Socket disconnected!");
        })

        this.socket.on('streamEnd', () => {
            console.warn("LIVE has ended!");
            this.uniqueId = null;
        })

        this.socket.on('tiktokDisconnected', (errMsg) => {
            console.warn(errMsg);
            if (errMsg && errMsg.includes('LIVE has ended')) {
                this.uniqueId = null;
            }
        });
    }

    connect() {
        // this.uniqueId = uniqueId;
        // this.options = options || {};

        // this.setUniqueId();

        return new Promise((resolve, reject) => {
            this.socket.once('tiktokConnected', resolve);
            this.socket.once('tiktokDisconnected', reject);

            setTimeout(() => {
                reject('Connection Timeout');
            }, 15000)
        })
    }

    setUniqueId() {
        // this.socket.emit('setUniqueId', this.uniqueId, this.options);
    }

    on(eventName, eventHandler) {
        this.socket.on(eventName, eventHandler);
    }
}