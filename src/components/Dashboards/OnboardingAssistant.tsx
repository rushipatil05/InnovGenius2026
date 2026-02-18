import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, RotateCcw, ChevronDown } from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  content: string | JSX.Element;
}

export default function OnboardingAssistant() {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      content:
        "Welcome 👋 I’m your Intelligent Onboarding Assistant. Select a category below to explore."
    }
  ]);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages]);

  const resetChat = () => {
    setMessages([
      {
        id: "1",
        sender: "bot",
        content:
          "Welcome 👋 I’m your Intelligent Onboarding Assistant. Select a category below to explore."
      }
    ]);
    setActiveCategory(null);
  };

  const addMessage = (sender: "bot" | "user", content: string | JSX.Element) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), sender, content }
    ]);
  };

  const handleOption = (option: string) => {
    addMessage("user", option);

    setTimeout(() => {
      if (option === "Account Opening Process") {
        addMessage(
          "bot",
          <div className="space-y-4">
            <p className="font-semibold text-gray-800">
              Our 7-Step Smart Registration:
            </p>

            <div className="relative border-l-2 border-indigo-400 ml-4 space-y-4">
              {[
                "Personal Details",
                "Contact Information",
                "KYC Verification",
                "Account Preferences",
                "Financial Information",
                "Nominee Details",
                "Banking Services Selection"
              ].map((step, index) => (
                <div key={index} className="ml-5 relative">
                  <div className="absolute -left-6 top-2 w-3 h-3 bg-indigo-600 rounded-full"></div>
                  <div className="bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-lg text-sm text-gray-700">
                    <span className="font-semibold">
                      Step {index + 1}:
                    </span>{" "}
                    {step}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500">
              The form dynamically adapts based on user profile and risk signals.
            </p>
          </div>
        );
      }

      else if (option === "Risk Scoring") {
        addMessage(
          "bot",
          "Risk scoring analyzes income data, KYC validation, behavioral patterns, and compliance indicators to detect fraud probability."
        );
      }

      else if (option === "Escalation Logic") {
        addMessage(
          "bot",
          "Applications exceeding risk thresholds are automatically escalated to officers or auditors for deeper review."
        );
      }

      else if (option === "Required Documents") {
        addMessage(
          "bot",
          "Identity Proof, Address Proof, PAN Card, Income Proof, and additional documents depending on account type."
        );
      }

      else if (option === "Approval Timeline") {
        addMessage(
          "bot",
          "Low-risk cases may be auto-approved. Medium/high-risk applications require officer or auditor review."
        );
      }

      else if (option === "Compliance & Audit Tracking") {
        addMessage(
          "bot",
          "All onboarding events are time-stamped and stored in a compliance timeline for full regulatory traceability."
        );
      }
    }, 400);
  };

  const categories = [
    {
      title: "Onboarding",
      items: ["Account Opening Process"]
    },
    {
      title: "Risk & Compliance",
      items: ["Risk Scoring", "Escalation Logic", "Compliance & Audit Tracking"]
    },
    {
      title: "Documentation",
      items: ["Required Documents"]
    },
    {
      title: "Approval",
      items: ["Approval Timeline"]
    }
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition z-50"
      >
        {open ? <X /> : <MessageCircle />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-96 h-[540px] backdrop-blur-xl bg-white/90 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex justify-between items-center">
            <span className="font-semibold">
              Intelligent Onboarding Assistant
            </span>
            <button onClick={resetChat}>
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={chatRef}
            className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50"
          >
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-xl text-sm max-w-[85%] shadow-sm ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-white border text-gray-700"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Categorized Scrollable Options */}
          <div className="border-t bg-white max-h-44 overflow-y-auto scrollbar-hide">
            {categories.map((category, index) => (
              <div key={index} className="border-b">
                <button
                  onClick={() =>
                    setActiveCategory(
                      activeCategory === category.title
                        ? null
                        : category.title
                    )
                  }
                  className="w-full px-4 py-2 text-left text-sm font-medium flex justify-between items-center hover:bg-gray-50 transition"
                >
                  {category.title}
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${
                      activeCategory === category.title
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </button>

                {activeCategory === category.title && (
                  <div className="px-4 pb-3 space-y-2">
                    {category.items.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handleOption(item)}
                        className="w-full text-left px-3 py-2 text-xs bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}
    </>
  );
}
