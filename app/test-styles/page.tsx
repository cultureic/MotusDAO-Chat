export default function TestStylesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Tailwind Styles Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              ✅ Tailwind is Working!
            </h2>
            <p className="text-gray-600 mb-4">
              If you can see this styled content, Tailwind CSS is properly configured and working.
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              Test Button
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
            <h2 className="text-2xl font-semibold mb-4">
              🎨 Gradient Test
            </h2>
            <p className="mb-4 opacity-90">
              This card tests gradient backgrounds and text colors.
            </p>
            <div className="flex space-x-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                Tag 1
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                Tag 2
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Responsive Grid Test
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-lg p-4 text-center">
                <div className="text-2xl mb-2">📦</div>
                <div className="text-sm text-gray-600">Item {i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
