const ConversationPage = () => {
  return (
    <div className="relative h-screen bg-gradient-to-br from-black via-gray-900 to-[#1a1a2e] overflow-hidden flex flex-col items-center justify-center text-white p-6">
      <div className="absolute w-48 h-48 bg-neutral-400 rounded-full opacity-60  animate-pulse"></div>

      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6 animate-pulse">Blank Universe</h1>
        <div className="w-48 h-48 relative flex items-center justify-center">
          <div className="absolute w-48 h-48 bg-white rounded-full opacity-30 animate-pulse"></div>
        </div>
        <p className="mt-6 text-center text-lg max-w-2xl text-neutral-400 animate-pulse">
          "The blank universe: where the cosmos took a day off, forgot to add stars, and left us with the ultimate existential screensaver. It’s just
          you, the void, and the overwhelming sense that someone really should've hit 'Ctrl+Z' on creation."
        </p>
      </div>
    </div>
  );
};

export default ConversationPage;
