
import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  RefreshCcw,
  Minimize2,
  Maximize2,
  Volume1
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface TextToSpeechProps {
  className?: string;
}

const TextToSpeech = ({ className }: TextToSpeechProps) => {
  const [text, setText] = useState('Welcome to Mountain Top University Chapel Attendance System');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [rate, setRate] = useState('1');
  const [voice, setVoice] = useState('');
  const [minimized, setMinimized] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis and get available voices
  useState(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      // Get available voices
      const getVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        setAvailableVoices(voices);
        
        // Set default voice (prefer English)
        if (voices.length > 0) {
          const defaultVoice = voices.find(voice => 
            voice.lang.includes('en-')
          ) || voices[0];
          setVoice(defaultVoice.name);
        }
      };

      // Chrome requires waiting for voiceschanged event
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = getVoices;
      }
      
      getVoices();
    }
  });

  const speak = () => {
    if (!text.trim() || !('speechSynthesis' in window)) {
      toast.error('Text-to-speech is not supported in your browser');
      return;
    }
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice if selected
    if (voice) {
      const selectedVoice = availableVoices.find(v => v.name === voice);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }
    
    // Set other properties
    utterance.volume = volume;
    utterance.rate = parseFloat(rate);
    
    // Set event handlers
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      toast.error('An error occurred during speech synthesis');
    };
    
    // Store reference for pausing/resuming
    speechSynthesisRef.current = utterance;
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const resume = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
    }
  };

  const stop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const toggleMinimize = () => {
    setMinimized(prev => !prev);
  };

  const handleReset = () => {
    setText('');
    stop();
  };

  return (
    <Card className={cn("fixed bottom-20 left-6 z-40 shadow-lg border-primary/10", 
      minimized ? "w-64 h-14" : "w-80 md:w-96 h-auto",
      className
    )}>
      <CardHeader className="p-3 flex flex-row items-center justify-between border-b">
        <div>
          <CardTitle className="text-sm">Text-to-Speech</CardTitle>
          {!minimized && (
            <CardDescription className="text-xs">Convert text to spoken words</CardDescription>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-7 w-7" 
          onClick={toggleMinimize}
        >
          {minimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
        </Button>
      </CardHeader>
      
      {!minimized && (
        <>
          <CardContent className="p-3 space-y-3">
            <Textarea
              placeholder="Type or paste text to convert to speech..."
              value={text}
              onChange={e => setText(e.target.value)}
              className="min-h-24 resize-none"
              disabled={isPlaying}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium">Voice</label>
                <Select value={voice} onValueChange={setVoice}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((voice) => (
                      <SelectItem key={voice.name} value={voice.name} className="text-xs">
                        {voice.name} ({voice.lang})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium">Speed</label>
                <Select value={rate} onValueChange={setRate}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Speed" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5" className="text-xs">Slow (0.5x)</SelectItem>
                    <SelectItem value="0.75" className="text-xs">Slower (0.75x)</SelectItem>
                    <SelectItem value="1" className="text-xs">Normal (1x)</SelectItem>
                    <SelectItem value="1.5" className="text-xs">Faster (1.5x)</SelectItem>
                    <SelectItem value="2" className="text-xs">Fast (2x)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium">Volume</label>
                <span className="text-xs text-muted-foreground">{Math.round(volume * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <VolumeX className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[volume * 100]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={(values) => setVolume(values[0] / 100)}
                  className="flex-1"
                />
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="p-3 border-t flex justify-between">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleReset}
              disabled={!text || isPlaying}
            >
              <RefreshCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
            
            <div className="flex gap-2">
              {isPlaying ? (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={pause}
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </Button>
              ) : (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={speak}
                  disabled={!text.trim()}
                >
                  <Play className="h-4 w-4 mr-1" />
                  {speechSynthesisRef.current && !isPlaying ? "Resume" : "Speak"}
                </Button>
              )}
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default TextToSpeech;
