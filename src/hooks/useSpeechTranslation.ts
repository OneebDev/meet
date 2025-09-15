import { useState, useRef, useCallback, useEffect } from 'react';

interface TranslationResult {
  originalText: string;
  translatedText: string;
  originalLanguage: string;
  targetLanguage: string;
  confidence: number;
}

interface UseSpeechTranslationReturn {
  isListening: boolean;
  isTranslating: boolean;
  currentTranscript: string;
  lastTranslation: TranslationResult | null;
  translations: TranslationResult[];
  startListening: () => void;
  stopListening: () => void;
  translateText: (text: string, from: string, to: string) => Promise<TranslationResult>;
  speakText: (text: string, language: string) => Promise<void>;
  setTargetLanguage: (language: string) => void;
  targetLanguage: string;
}

// Mock translation service - replace with real API in production
const mockTranslateText = async (text: string, from: string, to: string): Promise<TranslationResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
  
  // Mock translations for demo - simplified structure
  const translations: Record<string, string> = {
    'Hello everyone, can you hear me clearly?': 'ہیلو سب، کیا آپ مجھے صاف سن سکتے ہیں؟',
    'I hope the translation is working well.': 'امید ہے کہ ترجمہ اچھی طرح کام کر رہا ہے۔',
    'السلام علیکم، آپ کیسے ہیں؟': 'Peace be upon you, how are you?',
    'میں ٹھیک ہوں، شکریہ۔': 'I am fine, thank you.',
  };

  const translatedText = translations[text] || 
    `[Translated from ${from} to ${to}]: ${text}`;

  return {
    originalText: text,
    translatedText,
    originalLanguage: from,
    targetLanguage: to,
    confidence: 0.85 + Math.random() * 0.15, // Mock confidence 85-100%
  };
};

export const useSpeechTranslation = (): UseSpeechTranslationReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [lastTranslation, setLastTranslation] = useState<TranslationResult | null>(null);
  const [translations, setTranslations] = useState<TranslationResult[]>([]);
  const [targetLanguage, setTargetLanguage] = useState('ur');

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      recognition.onresult = async (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        setCurrentTranscript(finalTranscript + interimTranscript);

        // Process final transcript for translation
        if (finalTranscript.trim()) {
          try {
            setIsTranslating(true);
            const translation = await mockTranslateText(finalTranscript.trim(), 'en', targetLanguage);
            setLastTranslation(translation);
            setTranslations(prev => [...prev, translation]);
            
            // Speak the translation
            await speakText(translation.translatedText, targetLanguage);
          } catch (error) {
            console.error('Translation error:', error);
          } finally {
            setIsTranslating(false);
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('Speech recognition not supported in this browser');
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [targetLanguage]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const translateText = useCallback(async (text: string, from: string, to: string): Promise<TranslationResult> => {
    setIsTranslating(true);
    try {
      const result = await mockTranslateText(text, from, to);
      setLastTranslation(result);
      setTranslations(prev => [...prev, result]);
      return result;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const speakText = useCallback(async (text: string, language: string): Promise<void> => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ur' ? 'ur-PK' : 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;

      speechSynthesisRef.current = utterance;

      return new Promise((resolve, reject) => {
        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(event.error);
        
        window.speechSynthesis.speak(utterance);
      });
    } else {
      console.warn('Speech synthesis not supported in this browser');
    }
  }, []);

  return {
    isListening,
    isTranslating,
    currentTranscript,
    lastTranslation,
    translations,
    startListening,
    stopListening,
    translateText,
    speakText,
    setTargetLanguage: (lang: string) => setTargetLanguage(lang),
    targetLanguage,
  };
};