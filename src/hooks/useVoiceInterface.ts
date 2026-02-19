import { useState, useEffect, useRef, useCallback } from 'react';

// Basic types for SpeechRecognition to avoid 'any'
interface SpeechRecognitionResult {
    isFinal: boolean;
    [key: number]: { transcript: string };
    length: number;
}

interface SpeechRecognitionEvent {
    resultIndex: number;
    results: {
        length: number;
        [key: number]: SpeechRecognitionResult;
    };
    error?: string;
}

// Extend Window to include speech recognition types correctly
declare global {
    interface Window {
        webkitSpeechRecognition: {
            new(): any;
        };
        SpeechRecognition: {
            new(): any;
        };
    }
}

interface UseVoiceInterfaceProps {
    onInputComplete?: (text: string) => void;
}

export function useVoiceInterface({ onInputComplete }: UseVoiceInterfaceProps = {}) {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);

    // Use a ref for the callback to prevent effect re-runs if user forgets useCallback
    const callbackRef = useRef(onInputComplete);
    useEffect(() => {
        callbackRef.current = onInputComplete;
    }, [onInputComplete]);

    // Use 'any' for now as the full SpeechRecognition type is quite complex to mock perfectly
    const recognitionRef = useRef<any>(null);
    const synthesisRef = useRef<SpeechSynthesis>();
    const voiceRef = useRef<SpeechSynthesisVoice | null>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = false; // Stop after one sentence
                recognition.interimResults = true; // Show results as you speak
                recognition.lang = 'en-US'; // Default language

                recognition.onstart = () => {
                    setIsListening(true);
                    setError(null);
                };

                recognition.onresult = (event: SpeechRecognitionEvent) => {
                    let finalTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        const result = event.results[i];
                        if (result.isFinal) {
                            finalTranscript += result[0].transcript;
                        }
                    }

                    if (finalTranscript) {
                        setTranscript(finalTranscript);
                        // Call the latest callback
                        if (callbackRef.current) {
                            callbackRef.current(finalTranscript);
                        }
                    }
                };

                recognition.onerror = (event: { error: string }) => {
                    console.error('Speech recognition error', event.error);
                    setIsListening(false);
                    setError(event.error);
                };

                recognition.onend = () => {
                    setIsListening(false);
                };

                recognitionRef.current = recognition;
            } else {
                setError("Browser does not support Speech Recognition.");
            }

            // Initialize Speech Synthesis
            if ('speechSynthesis' in window) {
                synthesisRef.current = window.speechSynthesis;

                // Wait for voices to load
                const loadVoices = () => {
                    const voices = synthesisRef.current?.getVoices() || [];
                    // Try to find a warm female voice
                    voiceRef.current = voices.find(v => v.name.includes('Google US English'))
                        || voices.find(v => v.name.includes('Zira')) // Windows Default Female
                        || voices.find(v => v.name.includes('Female'))
                        || voices.find(v => v.lang.startsWith('en'))
                        || voices[0];
                };

                loadVoices();
                if (window.speechSynthesis.onvoiceschanged !== undefined) {
                    window.speechSynthesis.onvoiceschanged = loadVoices;
                }
            }
        }
    }, []); // Empty dependency array = run once on mount

    const startListening = useCallback(() => {
        if (recognitionRef.current) {
            // If AI is speaking, shut it up immediately when user wants to talk
            if (synthesisRef.current?.speaking) {
                synthesisRef.current.cancel();
                setSpeaking(false);
            }

            setTranscript('');
            setError(null);
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Recognition start failed: ", e);
            }
        } else {
            setError("Speech recognition not supported.");
        }
    }, []);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (typeof window === 'undefined' || !window.speechSynthesis) return;
        const synthesis = window.speechSynthesis;

        // Clean text (remove markdown like **bold**, links, etc for smoother speech)
        const cleanText = text.replace(/[*#_`]/g, '').trim();
        if (!cleanText) return;

        // Cancel any current speech
        synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(cleanText);

        // Ensure we have a voice
        if (!voiceRef.current) {
            const voices = synthesis.getVoices();
            if (voices.length > 0) {
                voiceRef.current = voices.find(v => v.name.includes('Google US English'))
                    || voices.find(v => v.name.includes('Zira'))
                    || voices.find(v => v.name.includes('Female'))
                    || voices.find(v => v.lang.startsWith('en'))
                    || voices[0];
            } else {
                console.warn("React Speech: No voices found. Retrying...");
            }
        }

        if (voiceRef.current) {
            utterance.voice = voiceRef.current;
        }

        // Adjust for "sweet/warm" effect
        utterance.pitch = 1.05; // Slightly higher but natural
        utterance.rate = 1.0;

        utterance.onstart = () => {
            console.log("React Speech: Started speaking");
            setSpeaking(true);
        };
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = (e) => {
            console.error("Speech synthesis error:", e);
            setSpeaking(false);
        };

        synthesis.resume();
        synthesis.speak(utterance);
    }, []);

    const stopSpeaking = useCallback(() => {
        if (synthesisRef.current) {
            synthesisRef.current.cancel();
            setSpeaking(false);
        }
    }, []);

    return {
        isListening,
        isSpeaking,
        transcript,
        error,
        startListening,
        stopListening,
        speak,
        stopSpeaking
    };
}
