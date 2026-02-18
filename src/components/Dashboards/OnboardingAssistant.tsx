import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, RotateCcw, Send, Loader2 } from "lucide-react";
import { useTambo, useTamboThreadInput } from "@tambo-ai/react";
import type { TamboComponentContent } from "@tambo-ai/react";

interface OnboardingAssistantProps {
  /** Current view so the assistant shows context-aware prompts */
  currentView?: 'home' | 'account-opening' | string;
}

export default function OnboardingAssistant({
  currentView = 'home',
}: OnboardingAssistantProps) {
  const [open, setOpen] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  // ── Tambo hooks ──────────────────────────────────────────────────────────
  const { messages: rawMessages, isStreaming, isWaiting } = useTambo();
  const { value, setValue, submit, isPending } = useTamboThreadInput();

  const isLoading = isStreaming || isWaiting || isPending;

  // Sort messages chronologically — Tambo sometimes delivers out of order
  const messages = [...rawMessages].sort((a, b) => {
    const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return ta - tb;
  });

  // Auto-scroll on new messages
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isPending) return;
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
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition z-50"
        title="AI Onboarding Assistant"
      >
        {open ? <X /> : <MessageCircle />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-96 h-[580px] backdrop-blur-xl bg-white/90 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center shrink-0">
            <div>
              <span className="font-semibold font-poppins block">
                AI Onboarding Assistant
              </span>
              <span className="text-xs text-indigo-200 font-poppins">
                {headerSubtitle}
              </span>
            </div>
            <button
              onClick={() => window.location.reload()}
              title="Reset conversation"
              className="hover:bg-white/20 p-1 rounded-lg transition"
            >
              <RotateCcw size={16} />
            </button>
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
            className="p-3 bg-white border-t border-gray-100 flex gap-2 shrink-0"
          >
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={
                isOnForm
                  ? "Tell me your DOB, gender, parent's name…"
                  : "What would you like to do today?"
              }
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-indigo-400 font-poppins bg-gray-50"
              disabled={isPending}
              autoComplete="off"
            />
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
