import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoTileProps {
  participantName: string;
  participantId: string;
  isLocalUser?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isSpeaking?: boolean;
  currentLanguage?: string;
  subtitleText?: string;
  className?: string;
}

export const VideoTile = ({
  participantName,
  participantId,
  isLocalUser = false,
  isMuted = false,
  isVideoOff = false,
  isSpeaking = false,
  currentLanguage = 'English',
  subtitleText,
  className,
}: VideoTileProps) => {
  const [showControls, setShowControls] = useState(false);

  return (
    <div
      className={cn(
        "relative aspect-video rounded-xl overflow-hidden shadow-video transition-smooth",
        "bg-video-bg border border-border",
        isSpeaking && "ring-2 ring-primary shadow-glow",
        className
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Video Content Area */}
      <div className="absolute inset-0">
        {isVideoOff ? (
          // Avatar placeholder when video is off
          <div className="flex items-center justify-center h-full bg-video-bg">
            <Avatar className="w-20 h-20 border-2 border-border">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${participantName}`} />
              <AvatarFallback className="text-2xl bg-secondary">
                {participantName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          // Video feed placeholder (will be replaced with actual video)
          <div className="w-full h-full bg-gradient-to-br from-video-bg to-video-overlay flex items-center justify-center">
            <div className="text-muted-foreground text-sm">Camera feed will appear here</div>
          </div>
        )}
      </div>

      {/* Video Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-video pointer-events-none" />

      {/* Top Controls - Language Badge */}
      <div className={cn(
        "absolute top-3 left-3 transition-smooth",
        showControls || isSpeaking ? "opacity-100" : "opacity-0"
      )}>
        <Badge variant="secondary" className="bg-video-overlay/80 backdrop-blur-sm border-border/50">
          {currentLanguage}
        </Badge>
      </div>

      {/* Top Right - Audio Status */}
      <div className="absolute top-3 right-3">
        <div className={cn(
          "flex items-center gap-2 px-2 py-1 rounded-lg transition-smooth",
          "bg-video-overlay/80 backdrop-blur-sm",
          showControls || isMuted ? "opacity-100" : "opacity-0"
        )}>
          {isMuted ? (
            <MicOff className="w-4 h-4 text-destructive" />
          ) : (
            <Mic className={cn(
              "w-4 h-4 transition-smooth",
              isSpeaking ? "text-success" : "text-foreground"
            )} />
          )}
        </div>
      </div>

      {/* Bottom - Name and Subtitles */}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        {/* Participant Name */}
        <div className={cn(
          "flex items-center justify-between mb-2 transition-smooth",
          showControls ? "opacity-100" : "opacity-70"
        )}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground drop-shadow-lg">
              {participantName} {isLocalUser && "(You)"}
            </span>
            {isSpeaking && (
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-success rounded-full animate-pulse" />
                <div className="w-1 h-3 bg-success/70 rounded-full animate-pulse [animation-delay:0.1s]" />
                <div className="w-1 h-2 bg-success/50 rounded-full animate-pulse [animation-delay:0.2s]" />
              </div>
            )}
          </div>
        </div>

        {/* Subtitles Area */}
        {subtitleText && (
          <div className="bg-subtitle-bg/90 backdrop-blur-sm rounded-lg p-2 border border-border/30">
            <p className="text-sm text-foreground leading-relaxed">
              {subtitleText}
            </p>
          </div>
        )}
      </div>

      {/* Speaking Animation Ring */}
      {isSpeaking && (
        <div className="absolute inset-0 rounded-xl">
          <div className="absolute inset-0 rounded-xl ring-2 ring-primary/50 animate-pulse" />
          <div className="absolute inset-1 rounded-xl ring-1 ring-primary/30 animate-pulse [animation-delay:0.5s]" />
        </div>
      )}
    </div>
  );
};