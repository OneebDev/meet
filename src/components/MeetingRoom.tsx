import React, { useState, useEffect } from 'react';
import { VideoTile } from './VideoTile';
import { MeetingControls } from './MeetingControls';
import { JoinMeeting } from './JoinMeeting';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useWebRTC } from '@/hooks/useWebRTC';
import { useSpeechTranslation } from '@/hooks/useSpeechTranslation';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface Participant {
  id: string;
  name: string;
  isLocalUser: boolean;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
  language: string;
  currentSubtitle?: string;
}

interface MeetingData {
  participantName: string;
  meetingId: string;
  language: string;
}

export const MeetingRoom = () => {
  const { toast } = useToast();
  const [meetingData, setMeetingData] = useState<MeetingData | null>(null);
  const [hasJoinedMeeting, setHasJoinedMeeting] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  
  const {
    localStream,
    remoteStreams,
    isConnected,
    isMuted,
    isVideoOff,
    startCall,
    endCall,
    toggleMute,
    toggleVideo,
  } = useWebRTC();

  const {
    isListening,
    isTranslating,
    currentTranscript,
    lastTranslation,
    startListening,
    stopListening,
    targetLanguage,
    setTargetLanguage,
  } = useSpeechTranslation();

  const [isTranslationEnabled, setIsTranslationEnabled] = useState(true);

  // Initialize participants when meeting starts
  useEffect(() => {
    if (meetingData && hasJoinedMeeting) {
      const localParticipant: Participant = {
        id: 'local',
        name: meetingData.participantName,
        isLocalUser: true,
        isMuted: isMuted,
        isVideoOff: isVideoOff,
        isSpeaking: isListening,
        language: meetingData.language === 'ur' ? 'Urdu' : 'English',
      };

      // Simulate a remote participant for demo
      const remoteParticipant: Participant = {
        id: 'remote-demo',
        name: meetingData.language === 'ur' ? 'Sarah Johnson' : 'Ahmed Khan',
        isLocalUser: false,
        isMuted: false,
        isVideoOff: false,
        isSpeaking: false,
        language: meetingData.language === 'ur' ? 'English' : 'Urdu',
        currentSubtitle: lastTranslation?.translatedText,
      };

      setParticipants([localParticipant, remoteParticipant]);
    }
  }, [meetingData, hasJoinedMeeting, isMuted, isVideoOff, isListening, lastTranslation]);

  const handleJoinMeeting = async (data: MeetingData) => {
    setMeetingData(data);
    setTargetLanguage(data.language === 'en' ? 'ur' : 'en');
    
    try {
      await startCall();
      setHasJoinedMeeting(true);
      
      toast({
        title: "Meeting joined successfully",
        description: `Welcome to meeting: ${data.meetingId}`,
      });

      // Auto-start translation listening
      if (isTranslationEnabled) {
        setTimeout(() => {
          startListening();
        }, 2000);
      }
    } catch (error) {
      toast({
        title: "Failed to join meeting",
        description: "Please check your camera and microphone permissions",
        variant: "destructive",
      });
    }
  };

  const handleEndCall = () => {
    endCall();
    stopListening();
    setHasJoinedMeeting(false);
    setMeetingData(null);
    setParticipants([]);
    
    toast({
      title: "Call ended",
      description: "You have left the meeting",
    });
  };

  const handleToggleTranslation = () => {
    const newState = !isTranslationEnabled;
    setIsTranslationEnabled(newState);
    
    if (newState) {
      startListening();
      toast({
        title: "Translation enabled",
        description: "Live translation is now active for all participants",
      });
    } else {
      stopListening();
      toast({
        title: "Translation disabled",
        description: "You will no longer receive translated audio and subtitles",
      });
    }
  };

  const handleCopyLink = async () => {
    if (!meetingData) return;
    
    const meetingLink = `${window.location.origin}?join=${meetingData.meetingId}`;
    
    try {
      await navigator.clipboard.writeText(meetingLink);
      toast({
        title: "Meeting link copied",
        description: "Share this link with others to join the meeting",
      });
    } catch (error) {
      toast({
        title: "Failed to copy link",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  // Show join screen if not in meeting
  if (!hasJoinedMeeting) {
    return <JoinMeeting onJoinMeeting={handleJoinMeeting} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">TranslateMeet</h1>
          {meetingData && (
            <Badge variant="outline" className="border-primary/30 text-primary">
              Meeting ID: {meetingData.meetingId}
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleCopyLink}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Link
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <ExternalLink className="w-4 h-4" />
            Invite
          </Button>
        </div>
      </header>

      {/* Main Video Area */}
      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Connection Status */}
          {!isConnected && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Connecting to meeting... Please ensure your camera and microphone are enabled.
              </AlertDescription>
            </Alert>
          )}

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {participants.map((participant) => (
              <VideoTile
                key={participant.id}
                participantName={participant.name}
                participantId={participant.id}
                isLocalUser={participant.isLocalUser}
                isMuted={participant.isMuted}
                isVideoOff={participant.isVideoOff}
                isSpeaking={participant.isSpeaking}
                currentLanguage={participant.language}
                subtitleText={isTranslationEnabled ? participant.currentSubtitle : undefined}
                className="h-80 md:h-96"
                stream={participant.isLocalUser ? localStream : remoteStreams.get(participant.id)}
              />
            ))}
          </div>

          {/* Translation Status Banner */}
          {isTranslationEnabled && (
            <div className="bg-gradient-primary/10 border border-primary/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
                  <div>
                    <h3 className="font-semibold text-primary">
                      {isListening ? 'Listening for speech...' : 'Live Translation Active'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isTranslating ? 'Translating...' : 
                       currentTranscript ? `"${currentTranscript}"` :
                       'Real-time translation between Urdu and English is enabled'}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                  {meetingData?.language === 'ur' ? 'Urdu ↔ English' : 'English ↔ Urdu'}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Meeting Controls */}
      <MeetingControls
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        isTranslationEnabled={isTranslationEnabled}
        participantCount={participants.length}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onToggleTranslation={handleToggleTranslation}
        onEndCall={handleEndCall}
      />
    </div>
  );
};