import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Video, Mic, Languages, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JoinMeetingProps {
  onJoinMeeting: (meetingData: {
    participantName: string;
    meetingId: string;
    language: string;
  }) => void;
}

export const JoinMeeting = ({ onJoinMeeting }: JoinMeetingProps) => {
  const [participantName, setParticipantName] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [language, setLanguage] = useState('en');
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinMeeting = async () => {
    if (!participantName.trim() || !meetingId.trim()) return;
    
    setIsJoining(true);
    
    // Simulate joining delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onJoinMeeting({
      participantName: participantName.trim(),
      meetingId: meetingId.trim(),
      language,
    });
  };

  const handleCreateMeeting = () => {
    if (!participantName.trim()) return;
    
    const newMeetingId = `meeting-${Date.now()}`;
    setMeetingId(newMeetingId);
    
    setTimeout(() => {
      onJoinMeeting({
        participantName: participantName.trim(),
        meetingId: newMeetingId,
        language,
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Languages className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              TranslateMeet
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Real-time video meetings with live speech translation
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">HD Video Calls</h3>
              <p className="text-xs text-muted-foreground">Crystal clear quality</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="w-10 h-10 bg-translation-accent/20 rounded-lg flex items-center justify-center">
              <Languages className="w-5 h-5 text-translation-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Live Translation</h3>
              <p className="text-xs text-muted-foreground">Urdu ↔ English</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Real-time</h3>
              <p className="text-xs text-muted-foreground">Low latency</p>
            </div>
          </div>
        </div>

        {/* Join Meeting Form */}
        <Card className="bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Join a Meeting</CardTitle>
            <CardDescription>
              Enter your details to join or create a new meeting room
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Name Input */}
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="bg-background/50"
              />
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <Label htmlFor="language">Your Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select your language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">
                    <div className="flex items-center gap-2">
                      <span>🇺🇸</span>
                      <span>English</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="ur">
                    <div className="flex items-center gap-2">
                      <span>🇵🇰</span>
                      <span>اردو (Urdu)</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Meeting ID Input */}
            <div className="space-y-2">
              <Label htmlFor="meetingId">Meeting ID (Optional)</Label>
              <Input
                id="meetingId"
                placeholder="Enter meeting ID to join existing meeting"
                value={meetingId}
                onChange={(e) => setMeetingId(e.target.value)}
                className="bg-background/50"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleJoinMeeting}
                disabled={!participantName.trim() || !meetingId.trim() || isJoining}
                className="flex-1 h-12"
                size="lg"
              >
                {isJoining ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Joining...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Join Meeting
                  </div>
                )}
              </Button>
              
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                or
              </div>
              
              <Button
                onClick={handleCreateMeeting}
                disabled={!participantName.trim()}
                variant="outline"
                className="flex-1 h-12"
                size="lg"
              >
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Create New Meeting
                </div>
              </Button>
            </div>

            {/* Demo Note */}
            <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Badge variant="secondary" className="bg-primary/20 text-primary">Demo</Badge>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    This is a demonstration version. Speech recognition and translation 
                    features work best in Chrome with microphone access enabled.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};