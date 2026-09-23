import { BookOpen, Star, Bookmark, Quote } from 'lucide-react';
import { portfolioData } from '../../../data/portfolioData';

export const BookstagramDossier: React.FC = () => {
  const { bookstagram } = portfolioData;
  const progressPercent = Math.round(
    (bookstagram.yearlyGoal.read / bookstagram.yearlyGoal.target) * 100
  );

  return (
    <div className="space-y-6 text-slate-200">
      {/* Reading Challenge & Currently Reading Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Goal Card */}
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" />
              {bookstagram.yearlyGoal.year} Reading Goal
            </span>
            <span className="text-xs font-mono font-bold text-purple-400">
              {bookstagram.yearlyGoal.read} / {bookstagram.yearlyGoal.target} Books
            </span>
          </div>

          <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400">
            On track! {progressPercent}% of the yearly reading challenge completed.
          </p>
        </div>

        {/* Currently Reading */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Currently Reading
          </span>
          <div>
            <h5 className="text-sm font-bold text-white">
              {bookstagram.currentlyReading.title}
            </h5>
            <span className="text-xs text-purple-400">
              by {bookstagram.currentlyReading.author}
            </span>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-purple-400"
                style={{ width: `${bookstagram.currentlyReading.progress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              {bookstagram.currentlyReading.progress}%
            </span>
          </div>
        </div>
      </div>

      {/* Book Reviews List */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          Featured Book Reviews & Favorites
        </h4>

        <div className="space-y-4">
          {bookstagram.books.map((book, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-purple-500/30 transition-all space-y-2.5"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h5 className="text-base font-bold text-white">{book.title}</h5>
                    {book.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {book.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">by {book.author}</span>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/60">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-mono font-bold text-slate-200">
                    {book.rating}
                  </span>
                </div>
              </div>

              <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-mono">
                {book.genre}
              </span>

              <p className="text-xs text-slate-300 leading-relaxed">
                {book.review}
              </p>

              {book.favoriteQuote && (
                <div className="p-2.5 rounded-lg bg-purple-950/30 border border-purple-900/40 flex items-start gap-2">
                  <Quote className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-xs italic text-purple-200/90 font-serif">
                    "{book.favoriteQuote}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
