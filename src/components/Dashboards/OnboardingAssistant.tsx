import { useState, useEffect, useRef, useCallback } from "react";
import { MessageCircle, X, RotateCcw, Send, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useTambo, useTamboThreadInput } from "@tambo-ai/react";
import type { TamboComponentContent } from "@tambo-ai/react";
import { useVoiceInterface } from "../../hooks/useVoiceInterface";

interface OnboardingAssistantProps {
  /** Current view so the assistant shows context-aware prompts */
  currentView?: 'home' | 'account-opening' | string;
}

export default function OnboardingAssistant({
  currentView = 'home',
}: OnboardingAssistantProps) {
  const [open, setOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // ── Tambo hooks ──────────────────────────────────────────────────────────
  const { messages: rawMessages, isStreaming, isWaiting } = useTambo();
  const { value, setValue, submit, isPending } = useTamboThreadInput();

  const isLoading = isStreaming || isWaiting || isPending;

  // Sort messages chronologically
  const messages = [...rawMessages].sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return ta - tb;
  });

  // ── Voice Interface ──────────────────────────────────────────────────────
  // Memoize callback to prevent infinite loops in the hook
  const handleInputComplete = useCallback((text: string) => {
    setValue(text); // Just fill, user manually sends
  }, [setValue]);

  const {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    stopSpeaking
  } = useVoiceInterface({
    onInputComplete: handleInputComplete
  });

  // Auto-scroll on new messages & Speak AI response
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Track last spoken message to prevent repeat
  const lastSpokenIdRef = useRef<string | null>(null);
  const [hasWelcomed, setHasWelcomed] = useState(false);

  // Speak Welcome Message when opened
  // Also ensures audio context is unlocked by user interaction (opening the chat)
  useEffect(() => {
    if (open && !hasWelcomed && !isMuted) {
      const text = currentView === 'account-opening'
        ? "Hi! I'm your AI assistant. Tell me your details and I'll fill the form."
        : "Hi! I'm your InnovGenius AI Assistant. How can I help you today?";

      // Small delay to ensure voices loaded or transition finished
      setTimeout(() => speak(text), 500);
      setHasWelcomed(true);
    }
  }, [open, hasWelcomed, isMuted, currentView, speak]);

  useEffect(() => {
    // Wait for streaming to finish before speaking to avoid partial reads/stuttering
    if (!isStreaming && !isWaiting && !isMuted && open) {
      // Find the latest message from the assistant
      // We reverse a copy of the array to find the last one first
      const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');

      if (lastAssistantMessage) {
        // Log for debugging
        // console.log("Checking speech for msg:", lastAssistantMessage.id, "Last spoken:", lastSpokenIdRef.current);

        if (lastAssistantMessage.id !== lastSpokenIdRef.current) {
          // Extract text from content blocks
          const text = lastAssistantMessage.content
            .filter(b => b.type === 'text')
            .map(b => b.text)
            .join(' ');

          if (text) {
            console.log("Speaking AI Message:", text.substring(0, 50) + "...");
            speak(text);
            lastSpokenIdRef.current = lastAssistantMessage.id;
          }
        }
      }
    }
  }, [messages, isStreaming, isWaiting, isMuted, speak, open]);

  // Stop speaking when closed
  useEffect(() => {
    if (!open) {
      stopSpeaking();
      stopListening();
    }
  }, [open, stopSpeaking, stopListening]);


  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isPending) return;
    stopSpeaking(); // Stop AI if I interrupt
    await submit();
  };

  // Render a single message — handles text blocks + component blocks correctly
  const renderMessageContent = (message: (typeof messages)[0]) => {
    return (
      <div className="space-y-2">
        {message.content.map((block, i) => {
          if (block.type === "text") {
            return (
              <p key={i} className="text-sm font-poppins leading-relaxed whitespace-pre-wrap">
                {block.text}
              </p>
            );
          }
          if (block.type === "component") {
            const compBlock = block as TamboComponentContent;
            return (
              <div key={i}>
                {compBlock.renderedComponent ?? null}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // ── Context-aware prompts & welcome message ───────────────────────────────
  const isOnForm = currentView === 'account-opening';

  const quickPrompts = isOnForm
    ? [
      "Fill my personal details: DOB 14 May 1998, Male, Single, Father: Rajesh Pandey",
      "I'm born on 1995-08-22, female, married, mother's name is Sunita Sharma",
      "What fields are needed for personal details?",
    ]
    : [
      "I want to open a new bank account",
      "How do I apply for account opening?",
      "What services are available?",
    ];

  const welcomeMessage = isOnForm
    ? (
      <>
        👋 Hi! I'm your AI assistant. I can help fill your{" "}
        <strong>Personal Details</strong> form automatically.
        <br /><br />
        Just tell me your details — like{" "}
        <em>"I'm born on 14 May 1998, male, single, father's name is Rajesh"</em>{" "}
        and I'll fill the form for you!
      </>
    )
    : (
      <>
        👋 Hi! I'm your <strong>InnovGenius AI Assistant</strong>.
        <br /><br />
        I can help you navigate the app. Try saying{" "}
        <em>"I want to open a new account"</em> and I'll take you straight there! 🚀
      </>
    );

  const headerSubtitle = isOnForm
    ? "📝 Helping with Personal Details"
    : "🏦 Your Banking Assistant";

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition z-50 flex items-center justify-center"
        title="AI Onboarding Assistant"
      >
        {isSpeaking ? (
          <div className="flex gap-1 h-4 items-center">
            <div className="w-1 h-2 bg-white animate-pulse"></div>
            <div className="w-1 h-4 bg-white animate-pulse delay-75"></div>
            <div className="w-1 h-2 bg-white animate-pulse delay-150"></div>
          </div>
        ) : (
          open ? <X /> : <MessageCircle />
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-96 h-[580px] backdrop-blur-xl bg-white/90 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 animate-fadeInUp">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center shrink-0">
            <div>
              <span className="font-semibold font-poppins block">
                AI Onboarding Assistant
              </span>
              <span className="text-xs text-indigo-200 font-poppins">
                {isSpeaking ? "Speaking..." : headerSubtitle}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (isMuted) {
                    setIsMuted(false);
                  } else {
                    setIsMuted(true);
                    stopSpeaking();
                  }
                }}
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
                className="hover:bg-white/20 p-1.5 rounded-lg transition text-white/80 hover:text-white"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button
                onClick={() => window.location.reload()}
                title="Reset conversation"
                className="hover:bg-white/20 p-1.5 rounded-lg transition text-white/80 hover:text-white"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            ref={chatRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50"
          >
            {/* Welcome message if no messages yet */}
            {messages.length === 0 && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-xl text-sm max-w-[85%] shadow-sm bg-white border text-gray-700 font-poppins">
                  {welcomeMessage}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-xl text-sm max-w-[88%] shadow-sm ${msg.role === "user"
                    ? "bg-indigo-600 text-white font-poppins"
                    : "bg-white border text-gray-700"
                    }`}
                >
                  {renderMessageContent(msg)}
                </div>
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-4 py-2 rounded-xl bg-white border shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />
                  <span className="text-sm text-gray-500 font-poppins">Thinking…</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={async () => {
                  setValue(prompt);
                  stopSpeaking(); // quiet if speaking
                  setTimeout(async () => { await submit(); }, 50);
                }}
                className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-indigo-100 transition font-poppins shrink-0"
              >
                {prompt.length > 40 ? prompt.slice(0, 40) + "…" : prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className={`p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0 transition-colors ${isListening ? 'bg-red-50' : ''}`}
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={
                  isListening
                    ? "Listening..."
                    : (isOnForm ? "Tell me your details..." : "Ask me anything...")
                }
                className={`w-full px-3 py-2 pr-10 text-sm border rounded-lg focus:outline-none focus:border-indigo-400 font-poppins transition-colors ${isListening ? 'border-red-300 bg-white placeholder-red-400' : 'border-gray-200 bg-gray-50'}`}
                disabled={isPending}
                autoComplete="off"
              />

              {/* Mic Button inside Input */}
              <button
                type="button"
                onClick={() => {
                  if (isListening) stopListening();
                  else startListening();
                }}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${isListening ? 'text-white bg-red-500 animate-pulse' : 'text-gray-400 hover:text-indigo-600 hover:bg-gray-100'}`}
                title={isListening ? "Stop listening" : "Start voice input"}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isPending || !value.trim()}
              className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
