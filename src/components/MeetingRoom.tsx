import React, { useState } from 'react';
import { VideoTile } from './VideoTile';
import { MeetingControls } from './MeetingControls';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

export const MeetingRoom = () => {
  const { toast } = useToast();
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isTranslationEnabled, setIsTranslationEnabled] = useState(true);
  
  // Mock participants data
  const [participants] = useState<Participant[]>([
    {
      id: '1',
      name: 'Ahmed Khan',
      isLocalUser: true,
      isMuted: false,
      isVideoOff: false,
      isSpeaking: false,
      language: 'Urdu',
      currentSubtitle: undefined,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      isLocalUser: false,
      isMuted: false,
      isVideoOff: false,
      isSpeaking: true,
      language: 'English',
      currentSubtitle: 'Hello everyone, can you hear me clearly? I hope the translation is working well.',
    },
  ]);

  const meetingId = 'meeting-demo-123';
  const meetingLink = `https://translate-meet.app/join/${meetingId}`;

  const handleCopyLink = async () => {
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

  const handleEndCall = () => {
    toast({
      title: "Call ended",
      description: "You have left the meeting",
    });
  };

  const handleToggleTranslation = () => {
    setIsTranslationEnabled(!isTranslationEnabled);
    toast({
      title: isTranslationEnabled ? "Translation disabled" : "Translation enabled",
      description: isTranslationEnabled 
        ? "You will no longer receive translated audio and subtitles"
        : "Live translation is now active for all participants",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">TranslateMeet</h1>
          <Badge variant="outline" className="border-primary/30 text-primary">
            Meeting ID: {meetingId}
          </Badge>
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
          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {participants.map((participant) => (
              <VideoTile
                key={participant.id}
                participantName={participant.name}
                participantId={participant.id}
                isLocalUser={participant.isLocalUser}
                isMuted={participant.isMuted || (participant.isLocalUser && isMuted)}
                isVideoOff={participant.isVideoOff || (participant.isLocalUser && isVideoOff)}
                isSpeaking={participant.isSpeaking}
                currentLanguage={participant.language}
                subtitleText={isTranslationEnabled ? participant.currentSubtitle : undefined}
                className="h-80 md:h-96"
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
                    <h3 className="font-semibold text-primary">Live Translation Active</h3>
                    <p className="text-sm text-muted-foreground">
                      Real-time translation between Urdu and English is enabled
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                  Urdu ↔ English
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
        onToggleMute={() => setIsMuted(!isMuted)}
        onToggleVideo={() => setIsVideoOff(!isVideoOff)}
        onToggleTranslation={handleToggleTranslation}
        onEndCall={handleEndCall}
      />
    </div>
  );
};