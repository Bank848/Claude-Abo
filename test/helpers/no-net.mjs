// Preloaded with --import: any network attempt throws, so a test can prove a command never opens a socket.
import net from 'node:net';

const deny = () => { throw new Error('network access attempted'); };
net.connect = deny;
net.Socket.prototype.connect = deny;
globalThis.fetch = deny;
