import { useState, useRef, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface PeerConnection {
  id: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

interface UseWebRTCReturn {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  isConnected: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  startCall: () => Promise<void>;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;
  createOffer: (peerId: string) => Promise<RTCSessionDescriptionInit>;
  createAnswer: (peerId: string, offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>;
  handleAnswer: (peerId: string, answer: RTCSessionDescriptionInit) => Promise<void>;
  addIceCandidate: (peerId: string, candidate: RTCIceCandidateInit) => Promise<void>;
}

export const useWebRTC = (): UseWebRTCReturn => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const peerConnections = useRef<Map<string, PeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);

  const pcConfig: RTCConfiguration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  const createPeerConnection = useCallback((peerId: string): RTCPeerConnection => {
    const pc = new RTCPeerConnection(pcConfig);
    
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        // In a real app, send this to the signaling server
        console.log('ICE candidate:', event.candidate);
      }
    };

    pc.ontrack = (event) => {
      console.log('Received remote stream:', event.streams[0]);
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        newMap.set(peerId, event.streams[0]);
        return newMap;
      });
    };

    pc.onconnectionstatechange = () => {
      console.log('Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        setIsConnected(true);
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        setIsConnected(false);
      }
    };

    // Add local stream tracks if available
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current!);
      });
    }

    peerConnections.current.set(peerId, { id: peerId, connection: pc });
    return pc;
  }, []);

  const startCall = useCallback(async () => {
    try {
      console.log('Starting call...');
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      setLocalStream(stream);
      localStreamRef.current = stream;
      
      console.log('Local stream acquired:', stream);
      
      // In a real app, you'd connect to signaling server here
      // For demo, we simulate a successful connection
      setTimeout(() => {
        setIsConnected(true);
      }, 1000);

    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }, []);

  const endCall = useCallback(() => {
    console.log('Ending call...');
    
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    // Close all peer connections
    peerConnections.current.forEach(({ connection }) => {
      connection.close();
    });
    
    // Reset state
    setLocalStream(null);
    setRemoteStreams(new Map());
    setIsConnected(false);
    peerConnections.current.clear();
    localStreamRef.current = null;
  }, []);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTracks = localStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!audioTracks[0]?.enabled);
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTracks = localStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!videoTracks[0]?.enabled);
    }
  }, []);

  const createOffer = useCallback(async (peerId: string): Promise<RTCSessionDescriptionInit> => {
    const pc = createPeerConnection(peerId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  }, [createPeerConnection]);

  const createAnswer = useCallback(async (peerId: string, offer: RTCSessionDescriptionInit): Promise<RTCSessionDescriptionInit> => {
    const pc = createPeerConnection(peerId);
    await pc.setRemoteDescription(offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    return answer;
  }, [createPeerConnection]);

  const handleAnswer = useCallback(async (peerId: string, answer: RTCSessionDescriptionInit): Promise<void> => {
    const peer = peerConnections.current.get(peerId);
    if (peer) {
      await peer.connection.setRemoteDescription(answer);
    }
  }, []);

  const addIceCandidate = useCallback(async (peerId: string, candidate: RTCIceCandidateInit): Promise<void> => {
    const peer = peerConnections.current.get(peerId);
    if (peer) {
      await peer.connection.addIceCandidate(candidate);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  return {
    localStream,
    remoteStreams,
    isConnected,
    isMuted,
    isVideoOff,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
    createOffer,
    createAnswer,
    handleAnswer,
    addIceCandidate,
  };
};