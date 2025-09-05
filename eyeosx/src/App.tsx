import { useCallback, useMemo, useRef, useState } from 'react'
import './App.css'

type AppId = 'files' | 'notes' | 'editor'

type WindowRecord = {
  id: string
  app: AppId
  title: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  minimized: boolean
}

const initialWindows: WindowRecord[] = []

function App() {
  const [windows, setWindows] = useState<WindowRecord[]>(initialWindows)
  const [zCounter, setZCounter] = useState(1)
  const [desktopBg, setDesktopBg] = useState<string>(() => {
    return localStorage.getItem('desktop:bg') || 'bg-gradient-to-br from-slate-900 via-neutral-900 to-black'
  })

  const bringToFront = useCallback((id: string) => {
    setWindows(prev => {
      const nextZ = zCounter + 1
      setZCounter(nextZ)
      return prev.map(w => w.id === id ? { ...w, zIndex: nextZ } : w)
    })
  }, [zCounter])

  const openApp = useCallback((app: AppId) => {
    const id = `${app}-${Date.now()}`
    const title = app === 'files' ? 'File Manager' : app === 'notes' ? 'Notes' : 'Text Editor'
    setWindows(prev => ([
      ...prev,
      {
        id,
        app,
        title,
        x: 120 + (prev.length * 24),
        y: 100 + (prev.length * 24),
        width: 720,
        height: 480,
        zIndex: zCounter + 1,
        minimized: false,
      }
    ]))
    setZCounter(zCounter + 1)
  }, [zCounter])

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id))
  }, [])

  const toggleMinimize = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: !w.minimized } : w))
  }, [])

  const setPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w))
  }, [])

  const setSize = useCallback((id: string, width: number, height: number) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w))
  }, [])

  return (
    <div className={`h-full w-full ${desktopBg} relative overflow-hidden`}> 
      <DesktopShortcuts onOpenApp={openApp} />

      {windows.map(win => (
        <Window
          key={win.id}
          win={win}
          onFocus={() => bringToFront(win.id)}
          onClose={() => closeWindow(win.id)}
          onMinimize={() => toggleMinimize(win.id)}
          onDrag={(x, y) => setPosition(win.id, x, y)}
          onResize={(w, h) => setSize(win.id, w, h)}
        >
          {win.app === 'files' && <FileManager />}
          {win.app === 'notes' && <Notes />}
          {win.app === 'editor' && <TextEditor />}
        </Window>
      ))}

      <Taskbar
        windows={windows}
        onOpenApp={openApp}
        onToggleMinimize={toggleMinimize}
        onFocus={bringToFront}
      />
    </div>
  )
}

function DesktopShortcut({ label, onDoubleClick }: { label: string, onDoubleClick: () => void }) {
  return (
    <button onDoubleClick={onDoubleClick} className="flex flex-col items-center gap-1 text-neutral-100/90 hover:text-white">
      <div className="size-16 rounded-lg bg-white/5 ring-1 ring-inset ring-white/10 flex items-center justify-center">
        <div className="size-8 rounded-md bg-gradient-to-br from-blue-400 to-indigo-500"></div>
      </div>
      <span className="text-xs/5 px-1 py-0.5 bg-black/30 rounded">
        {label}
      </span>
    </button>
  )
}

function DesktopShortcuts({ onOpenApp }: { onOpenApp: (app: AppId) => void }) {
  return (
    <div className="absolute inset-0 p-6 grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] auto-rows-min gap-6 content-start">
      <DesktopShortcut label="Files" onDoubleClick={() => onOpenApp('files')} />
      <DesktopShortcut label="Notes" onDoubleClick={() => onOpenApp('notes')} />
      <DesktopShortcut label="Editor" onDoubleClick={() => onOpenApp('editor')} />
    </div>
  )
}

function Window({
  win,
  children,
  onFocus,
  onClose,
  onMinimize,
  onDrag,
  onResize,
}: {
  win: WindowRecord
  children: React.ReactNode
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onDrag: (x: number, y: number) => void
  onResize: (w: number, h: number) => void
}) {
  const draggingRef = useRef<{ dx: number; dy: number } | null>(null)
  const resizingRef = useRef<{ dw: number; dh: number } | null>(null)

  const onMouseDownHeader = (e: React.MouseEvent) => {
    onFocus()
    draggingRef.current = { dx: e.clientX - win.x, dy: e.clientY - win.y }
    const onMove = (ev: MouseEvent) => {
      if (!draggingRef.current) return
      onDrag(ev.clientX - draggingRef.current.dx, ev.clientY - draggingRef.current.dy)
    }
    const onUp = () => {
      draggingRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const onMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFocus()
    resizingRef.current = { dw: win.width - e.clientX, dh: win.height - e.clientY }
    const onMove = (ev: MouseEvent) => {
      if (!resizingRef.current) return
      const nextW = Math.max(320, ev.clientX + resizingRef.current.dw)
      const nextH = Math.max(240, ev.clientY + resizingRef.current.dh)
      onResize(nextW, nextH)
    }
    const onUp = () => {
      resizingRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  if (win.minimized) return null

  return (
    <div
      className="absolute shadow-2xl rounded-lg ring-1 ring-black/20 bg-neutral-925/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60"
      style={{ left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex }}
      onMouseDown={onFocus}
    >
      <div
        className="h-9 flex items-center gap-2 px-3 cursor-move select-none rounded-t-lg bg-gradient-to-b from-white/10 to-white/0"
        onMouseDown={onMouseDownHeader}
      >
        <div className="flex items-center gap-2">
          <button aria-label="Close" className="size-3.5 rounded-full bg-red-500/90 hover:bg-red-500" onClick={onClose} />
          <button aria-label="Minimize" className="size-3.5 rounded-full bg-yellow-400/90 hover:bg-yellow-400" onClick={onMinimize} />
          <button aria-label="Maximize" className="size-3.5 rounded-full bg-green-500/90 hover:bg-green-500" />
        </div>
        <div className="mx-auto text-sm font-medium text-white/90">
          {win.title}
        </div>
      </div>
      <div className="h-[calc(100%-2.25rem)] p-3 overflow-auto">
        {children}
      </div>
      <div className="absolute right-1 bottom-1 size-4 cursor-se-resize" onMouseDown={onMouseDownResize}>
        <div className="w-full h-full border-r-2 border-b-2 border-white/20" />
      </div>
    </div>
  )
}

function Taskbar({
  windows,
  onOpenApp,
  onToggleMinimize,
  onFocus,
}: {
  windows: WindowRecord[]
  onOpenApp: (app: AppId) => void
  onToggleMinimize: (id: string) => void
  onFocus: (id: string) => void
}) {
  return (
    <div className="absolute left-0 right-0 bottom-0 h-12 bg-black/40 backdrop-blur ring-t-1 ring-white/10 flex items-center px-2 gap-2">
      <button className="px-3 py-1.5 rounded-md bg-white/10 text-sm hover:bg-white/15" onClick={() => onOpenApp('files')}>Files</button>
      <button className="px-3 py-1.5 rounded-md bg-white/10 text-sm hover:bg-white/15" onClick={() => onOpenApp('notes')}>Notes</button>
      <button className="px-3 py-1.5 rounded-md bg-white/10 text-sm hover:bg-white/15" onClick={() => onOpenApp('editor')}>Editor</button>
      <div className="mx-2 w-px self-stretch bg-white/10" />
      <div className="flex items-center gap-2 overflow-x-auto">
        {windows.map(w => (
          <button key={w.id} className="px-2 py-1 rounded bg-white/10 text-xs hover:bg-white/15" onClick={() => { onToggleMinimize(w.id); onFocus(w.id) }}>
            {w.title}
          </button>
        ))}
      </div>
      <div className="ml-auto text-xs text-white/70 pr-2">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  )
}

function FileManager() {
  const [files, setFiles] = useState<string[]>(() => JSON.parse(localStorage.getItem('files:list') || '[]'))
  const [name, setName] = useState('')
  const save = (next: string[]) => {
    setFiles(next)
    localStorage.setItem('files:list', JSON.stringify(next))
  }
  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex gap-2">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="New file name" className="px-2 py-1 rounded bg-white/5 ring-1 ring-white/10 w-64" />
        <button className="px-3 py-1 rounded bg-blue-500/90 hover:bg-blue-500" onClick={() => { if (!name) return; save([...files, name]); setName('') }}>Add</button>
      </div>
      <ul className="space-y-1">
        {files.map((f, i) => (
          <li key={i} className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5">
            <span>{f}</span>
            <button className="text-red-300 hover:text-red-200" onClick={() => save(files.filter(x => x !== f))}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Notes() {
  const [text, setText] = useState<string>(() => localStorage.getItem('notes:text') || '')
  return (
    <textarea
      className="w-full h-full resize-none rounded bg-white/5 ring-1 ring-white/10 p-3 outline-none"
      value={text}
      onChange={e => { setText(e.target.value); localStorage.setItem('notes:text', e.target.value) }}
      placeholder="Write your notes..."
    />
  )
}

function TextEditor() {
  const [content, setContent] = useState<string>(() => localStorage.getItem('editor:content') || 'Hello, world!')
  return (
    <div className="h-full flex flex-col">
      <div className="text-xs text-white/60 mb-2">Plain Text</div>
      <textarea
        className="w-full h-full resize-none rounded bg-white/5 ring-1 ring-white/10 p-3 outline-none font-mono"
        value={content}
        onChange={e => { setContent(e.target.value); localStorage.setItem('editor:content', e.target.value) }}
      />
    </div>
  )
}

export default App
