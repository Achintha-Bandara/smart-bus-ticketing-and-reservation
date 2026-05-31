import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

let _addToast = null

export function toast(message, type = 'success') {
  if (_addToast) _addToast({ message, type, id: Date.now() })
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    _addToast = (t) => {
      setToasts(prev => [...prev, t])
      setTimeout(() => setToasts(prev => prev.filter(x => x.id !== t.id)), 4000)
    }
    return () => { _addToast = null }
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white text-sm font-medium pointer-events-auto transition-all
            ${t.type === 'success' ? 'bg-green-600' : 'bg-red-500'}`}
        >
          {t.type === 'success'
            ? <CheckCircle size={18} className="shrink-0" />
            : <XCircle size={18} className="shrink-0" />}
          <span>{t.message}</span>
          <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} className="ml-2 opacity-70 hover:opacity-100">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
