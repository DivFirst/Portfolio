import { BookOpen, Star, Bookmark, Quote, ExternalLink } from 'lucide-react';
import { portfolioData } from '../../../data/portfolioData';

export const BookstagramDossier: React.FC = () => {
  const { bookstagram } = portfolioData;
  const goal = bookstagram.yearlyGoal;
  const progressPercent = goal ? Math.round((goal.read / goal.target) * 100) : 0;

  return (
    <div className="space-y-6 text-slate-200">
      {/* Account / Reading Goal & Currently Reading Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goal ? (
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5" />
                {goal.year} Reading Goal
              </span>
              <span className="text-xs font-mono font-bold text-purple-400">
                {goal.read} / {goal.target} Books
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-300 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5" />
              {bookstagram.account?.name ?? 'Reading Journal'}
            </span>
            <p className="text-xs text-slate-300 leading-relaxed">{bookstagram.summary}</p>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {bookstagram.booksRead !== undefined && (
                <span className="text-xs font-mono font-bold text-purple-400">
                  {bookstagram.booksRead} books finished
                </span>
              )}
              {bookstagram.account && (
                <a
                  href={bookstagram.account.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-purple-300 hover:text-white transition-colors"
                >
                  {bookstagram.account.handle}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Currently Reading */}
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-3">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
            Currently Reading
          </span>
          {bookstagram.currentlyReading.map((cr) => (
            <div key={cr.title} className="space-y-1">
              <div>
                <h5 className="text-sm font-bold text-white">{cr.title}</h5>
                <span className="text-xs text-purple-400">by {cr.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full rounded-full bg-purple-400" style={{ width: `${cr.progress}%` }} />
                </div>
                <span className="text-[10px] font-mono text-slate-400">{cr.progress}%</span>
              </div>
            </div>
          ))}
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
                {book.rating !== undefined && (
                  <div className="flex items-center gap-1 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700/60">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {book.rating}
                    </span>
                  </div>
                )}
              </div>

              <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-slate-800 text-purple-300 font-mono">
                {book.genre}
              </span>

              {book.review && (
                <p className="text-xs text-slate-300 leading-relaxed">
                  {book.review}
                </p>
              )}

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
