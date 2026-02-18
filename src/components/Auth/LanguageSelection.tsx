import { useLanguage } from "../../contexts/LanguageContext";

export default function LanguageSelection({ onClose }: any) {
  const { setLanguage } = useLanguage();

  const handleSelect = (lang: string) => {
    setLanguage(lang);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center space-y-6 animate-fade-in-up">

        <h2 className="text-xl font-bold text-gray-800">
          Select Your Language
        </h2>

        <div className="space-y-3">
          <button
            onClick={() => handleSelect("en")}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            English
          </button>

          <button
            onClick={() => handleSelect("hi")}
            className="w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            हिंदी
          </button>

          <button
            onClick={() => handleSelect("mr")}
            className="w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            मराठी
          </button>
        </div>

      </div>
    </div>
  );
}
