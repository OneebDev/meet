import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Settings, 
  Users, 
  MessageSquare,
  Share,
  Languages,
  Volume2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MeetingControlsProps {
  isMuted?: boolean;
  isVideoOff?: boolean;
  isTranslationEnabled?: boolean;
  participantCount?: number;
  onToggleMute?: () => void;
  onToggleVideo?: () => void;
  onToggleTranslation?: () => void;
  onEndCall?: () => void;
  onOpenSettings?: () => void;
  onOpenChat?: () => void;
  onOpenParticipants?: () => void;
  onToggleShare?: () => void;
}

export const MeetingControls = ({
  isMuted = false,
  isVideoOff = false,
  isTranslationEnabled = true,
  participantCount = 2,
  onToggleMute,
  onToggleVideo,
  onToggleTranslation,
  onEndCall,
  onOpenSettings,
  onOpenChat,
  onOpenParticipants,
  onToggleShare,
}: MeetingControlsProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-6 py-4 bg-gradient-control backdrop-blur-xl rounded-2xl border border-border/50 shadow-control">
        
        {/* Audio Control */}
        <Button
          variant={isMuted ? "destructive" : "secondary"}
          size="lg"
          onClick={onToggleMute}
          className={cn(
            "w-12 h-12 rounded-xl transition-bounce",
            !isMuted && "hover:bg-control-hover hover:shadow-glow"
          )}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </Button>

        {/* Video Control */}
        <Button
          variant={isVideoOff ? "destructive" : "secondary"}
          size="lg"
          onClick={onToggleVideo}
          className={cn(
            "w-12 h-12 rounded-xl transition-bounce",
            !isVideoOff && "hover:bg-control-hover hover:shadow-glow"
          )}
        >
          {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
        </Button>

        {/* Translation Toggle */}
        <Button
          variant={isTranslationEnabled ? "default" : "secondary"}
          size="lg"
          onClick={onToggleTranslation}
          className={cn(
            "w-12 h-12 rounded-xl transition-bounce relative",
            isTranslationEnabled && "bg-gradient-primary shadow-glow"
          )}
        >
          <Languages className="w-5 h-5" />
          {isTranslationEnabled && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background animate-pulse" />
          )}
        </Button>

        {/* Screen Share */}
        <Button
          variant="secondary"
          size="lg"
          onClick={onToggleShare}
          className="w-12 h-12 rounded-xl transition-bounce hover:bg-control-hover"
        >
          <Share className="w-5 h-5" />
        </Button>

        {/* Participants */}
        <Button
          variant="secondary"
          size="lg"
          onClick={onOpenParticipants}
          className="w-12 h-12 rounded-xl transition-bounce hover:bg-control-hover relative"
        >
          <Users className="w-5 h-5" />
          <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
            {participantCount}
          </span>
        </Button>

        {/* Chat */}
        <Button
          variant="secondary"
          size="lg"
          onClick={onOpenChat}
          className="w-12 h-12 rounded-xl transition-bounce hover:bg-control-hover"
        >
          <MessageSquare className="w-5 h-5" />
        </Button>

        {/* Settings */}
        <Button
          variant="secondary"
          size="lg"
          onClick={onOpenSettings}
          className="w-12 h-12 rounded-xl transition-bounce hover:bg-control-hover"
        >
          <Settings className="w-5 h-5" />
        </Button>

        {/* End Call */}
        <Button
          variant="destructive"
          size="lg"
          onClick={onEndCall}
          className="w-12 h-12 rounded-xl transition-bounce ml-3 hover:scale-110"
        >
          <PhoneOff className="w-5 h-5" />
        </Button>
      </div>

      {/* Translation Status Indicator */}
      {isTranslationEnabled && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 backdrop-blur-sm rounded-full border border-primary/30">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-xs text-primary-foreground font-medium">Live Translation</span>
          </div>
        </div>
      )}
    </div>
  );
};