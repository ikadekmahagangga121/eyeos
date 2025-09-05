import { useCallback, useMemo, useRef, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import './App.css'

type AppId = 'files' | 'notes' | 'editor' | 'settings'

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
  maximized?: boolean
}

const initialWindows: WindowRecord[] = []

type FsNode = {
  id: string
  name: string
  type: 'folder' | 'file'
  children?: FsNode[]
}

function App() {
  const [user, setUser] = useState<string | null>(() => localStorage.getItem('session:user'))
  const [windows, setWindows] = useState<WindowRecord[]>(initialWindows)
  const [zCounter, setZCounter] = useState(1)
  const [desktopBg, setDesktopBg] = useState<string>(() => {
    const u = localStorage.getItem('session:user')
    const key = u ? `u:${u}:desktop:bg` : 'desktop:bg'
    return localStorage.getItem(key) || 'bg-gradient-to-br from-slate-900 via-neutral-900 to-black'
  })
  const [startOpen, setStartOpen] = useState(false)
  const [notifications, setNotifications] = useState<{ id: string; text: string }[]>([])

  const bringToFront = useCallback((id: string) => {
    setWindows(prev => {
      const nextZ = zCounter + 1
      setZCounter(nextZ)
      return prev.map(w => w.id === id ? { ...w, zIndex: nextZ } : w)
    })
  }, [zCounter])

  const openApp = useCallback((app: AppId) => {
    const id = `${app}-${Date.now()}`
    const title = app === 'files' ? 'File Manager' : app === 'notes' ? 'Notes' : app === 'editor' ? 'Text Editor' : 'Settings'
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
        maximized: false,
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

  const toggleMaximize = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, maximized: !w.maximized, minimized: false } : w))
  }, [])

  const pushNotification = useCallback((text: string) => {
    const id = `n-${Date.now()}`
    setNotifications(prev => [...prev, { id, text }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 3000)
  }, [])

  useEffect(() => {
    const handler = () => setStartOpen(false)
    window.addEventListener('click', handler)
    return () => window.removeEventListener('click', handler)
  }, [])

  return (
    <div className={`h-full w-full ${desktopBg} relative overflow-hidden`}> 
      {!user ? (
        <LoginScreen onLogin={(u) => { localStorage.setItem('session:user', u); setUser(u); pushNotification(`Welcome, ${u}!`) }} />
      ) : (
        <>
          <DesktopShortcuts onOpenApp={openApp} />

          {windows.map(win => (
            <Window
              key={win.id}
              win={win}
              onFocus={() => bringToFront(win.id)}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => toggleMinimize(win.id)}
              onMaximize={() => toggleMaximize(win.id)}
              onDrag={(x, y) => setPosition(win.id, x, y)}
              onResize={(w, h) => setSize(win.id, w, h)}
            >
              {win.app === 'files' && <FileManager user={user} />}
              {win.app === 'notes' && <Notes user={user} />}
              {win.app === 'editor' && <TextEditor user={user} />}
              {win.app === 'settings' && <Settings user={user} setDesktopBg={(v) => { setDesktopBg(v); localStorage.setItem(`u:${user}:desktop:bg`, v) }} />}
            </Window>
          ))}

          <Taskbar
            windows={windows}
            onOpenApp={openApp}
            onToggleMinimize={toggleMinimize}
            onFocus={bringToFront}
            onToggleStart={() => setStartOpen(v => !v)}
            onOpenSettings={() => openApp('settings')}
            onLogout={() => { localStorage.removeItem('session:user'); setUser(null) }}
          />

          {startOpen && (
            <StartMenu onOpenApp={(app) => { setStartOpen(false); openApp(app) }} user={user} onOpenSettings={() => openApp('settings')} />
          )}

          <Notifications items={notifications} />
        </>
      )}
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
    <div className="absolute inset-0 p-6 grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] auto-rows-min gap-6 content-start pointer-events-none">
      <div className="pointer-events-auto"><DesktopShortcut label="Files" onDoubleClick={() => onOpenApp('files')} /></div>
      <div className="pointer-events-auto"><DesktopShortcut label="Notes" onDoubleClick={() => onOpenApp('notes')} /></div>
      <div className="pointer-events-auto"><DesktopShortcut label="Editor" onDoubleClick={() => onOpenApp('editor')} /></div>
    </div>
  )
}

function Window({
  win,
  children,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  onDrag,
  onResize,
}: {
  win: WindowRecord
  children: React.ReactNode
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
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
      className="absolute shadow-2xl rounded-lg ring-1 ring-black/20 bg-neutral-900/80 backdrop-blur supports-[backdrop-filter]:bg-neutral-900/60"
      style={win.maximized ? { left: 0, top: 0, width: '100%', height: 'calc(100% - 48px)', zIndex: win.zIndex } : { left: win.x, top: win.y, width: win.width, height: win.height, zIndex: win.zIndex }}
      onMouseDown={onFocus}
    >
      <div
        className="h-9 flex items-center gap-2 px-3 cursor-move select-none rounded-t-lg bg-gradient-to-b from-white/10 to-white/0"
        onMouseDown={onMouseDownHeader}
        onDoubleClick={onMaximize}
      >
        <div className="flex items-center gap-2">
          <button aria-label="Close" className="size-3.5 rounded-full bg-red-500/90 hover:bg-red-500" onClick={onClose} />
          <button aria-label="Minimize" className="size-3.5 rounded-full bg-yellow-400/90 hover:bg-yellow-400" onClick={onMinimize} />
          <button aria-label="Maximize" className="size-3.5 rounded-full bg-green-500/90 hover:bg-green-500" onClick={onMaximize} />
        </div>
        <div className="mx-auto text-sm font-medium text-white/90">
          {win.title}
        </div>
      </div>
      <div className="h-[calc(100%-2.25rem)] p-3 overflow-auto">
        {children}
      </div>
      {!win.maximized && (
      <div className="absolute right-1 bottom-1 size-4 cursor-se-resize" onMouseDown={onMouseDownResize}>
        <div className="w-full h-full border-r-2 border-b-2 border-white/20" />
      </div>
      )}
    </div>
  )
}

function Taskbar({
  windows,
  onOpenApp,
  onToggleMinimize,
  onFocus,
  onToggleStart,
  onOpenSettings,
  onLogout,
}: {
  windows: WindowRecord[]
  onOpenApp: (app: AppId) => void
  onToggleMinimize: (id: string) => void
  onFocus: (id: string) => void
  onToggleStart: () => void
  onOpenSettings: () => void
  onLogout: () => void
}) {
  return (
    <div className="absolute left-0 right-0 bottom-0 h-12 bg-black/40 backdrop-blur border-t border-white/10 flex items-center px-2 gap-2">
      <button className="px-3 py-1.5 rounded-md bg-white/10 text-sm hover:bg-white/15" onClick={onToggleStart}>Start</button>
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
      <div className="ml-auto flex items-center gap-2 pr-2">
        <div className="text-xs text-white/70">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <button className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/15" onClick={onOpenSettings}>Settings</button>
        <button className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/15" onClick={onLogout}>Logout</button>
      </div>
    </div>
  )
}

function StartMenu({ onOpenApp, user, onOpenSettings }: { onOpenApp: (app: AppId) => void; user: string; onOpenSettings: () => void }) {
  return (
    <div className="absolute left-2 bottom-14 w-80 rounded-lg bg-neutral-900/90 backdrop-blur border border-white/10 p-3" onClick={e => e.stopPropagation()}>
      <div className="text-xs text-white/60 mb-2">Welcome, {user}</div>
      <div className="grid grid-cols-3 gap-2">
        <button className="h-20 rounded-md bg-white/10 hover:bg-white/15 flex flex-col items-center justify-center gap-1" onClick={() => onOpenApp('files')}>
          <div className="size-8 rounded bg-gradient-to-br from-blue-400 to-indigo-500" />
          <span className="text-xs">Files</span>
        </button>
        <button className="h-20 rounded-md bg-white/10 hover:bg-white/15 flex flex-col items-center justify-center gap-1" onClick={() => onOpenApp('notes')}>
          <div className="size-8 rounded bg-gradient-to-br from-yellow-300 to-orange-400" />
          <span className="text-xs">Notes</span>
        </button>
        <button className="h-20 rounded-md bg-white/10 hover:bg-white/15 flex flex-col items-center justify-center gap-1" onClick={() => onOpenApp('editor')}>
          <div className="size-8 rounded bg-gradient-to-br from-emerald-400 to-green-500" />
          <span className="text-xs">Editor</span>
        </button>
        <button className="h-20 rounded-md bg-white/10 hover:bg-white/15 flex flex-col items-center justify-center gap-1" onClick={onOpenSettings}>
          <div className="size-8 rounded bg-gradient-to-br from-fuchsia-400 to-purple-500" />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </div>
  )
}

function Notifications({ items }: { items: { id: string; text: string }[] }) {
  return (
    <div className="absolute right-3 top-3 space-y-2">
      {items.map(n => (
        <div key={n.id} className="px-3 py-2 rounded bg-black/60 text-white text-sm shadow">
          {n.text}
        </div>
      ))}
    </div>
  )
}

function LoginScreen({ onLogin }: { onLogin: (u: string) => void }) {
  const [name, setName] = useState('')
  const users: string[] = useMemo(() => JSON.parse(localStorage.getItem('users:list') || '[]'), [])
  const addUser = () => {
    const n = name.trim()
    if (!n) return
    const next = Array.from(new Set([...(JSON.parse(localStorage.getItem('users:list') || '[]') as string[]), n]))
    localStorage.setItem('users:list', JSON.stringify(next))
    onLogin(n)
  }
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-neutral-900 to-black flex items-center justify-center">
      <div className="w-96 rounded-xl bg-white/5 border border-white/10 p-6 backdrop-blur">
        <div className="text-lg font-semibold mb-3 text-white">Sign in</div>
        <div className="space-y-2 mb-3">
          <input className="w-full px-3 py-2 rounded bg-white/10 border border-white/10 outline-none" placeholder="Enter username" value={name} onChange={e => setName(e.target.value)} />
          <button className="w-full px-3 py-2 rounded bg-blue-500/90 hover:bg-blue-500" onClick={addUser}>Continue</button>
        </div>
        {users.length > 0 && (
          <div className="text-xs text-white/70 mb-1">Or pick an existing user</div>
        )}
        <div className="grid grid-cols-2 gap-2">
          {users.map(u => (
            <button key={u} className="px-3 py-2 rounded bg-white/10 hover:bg-white/15" onClick={() => onLogin(u)}>{u}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

function useUserKey(user: string, key: string) {
  return `u:${user}:${key}`
}

function loadFs(user: string): FsNode {
  const raw = localStorage.getItem(`u:${user}:fs`)
  if (raw) return JSON.parse(raw)
  const root: FsNode = {
    id: 'root',
    name: 'Home',
    type: 'folder',
    children: [
      { id: 'desktop', name: 'Desktop', type: 'folder', children: [] },
      { id: 'trash', name: 'Trash', type: 'folder', children: [] },
    ]
  }
  localStorage.setItem(`u:${user}:fs`, JSON.stringify(root))
  return root
}

function saveFs(user: string, root: FsNode) {
  localStorage.setItem(`u:${user}:fs`, JSON.stringify(root))
}

function findNode(root: FsNode, id: string): { node: FsNode | null; parent: FsNode | null } {
  if (root.id === id) return { node: root, parent: null }
  const stack: { node: FsNode; parent: FsNode | null }[] = [{ node: root, parent: null }]
  while (stack.length) {
    const cur = stack.pop()!
    if (cur.node.children) {
      for (const child of cur.node.children) {
        if (child.id === id) return { node: child, parent: cur.node }
        stack.push({ node: child, parent: cur.node })
      }
    }
  }
  return { node: null, parent: null }
}

function removeNode(root: FsNode, id: string): FsNode | null {
  if (!root.children) return null
  root.children = root.children.filter(c => c.id !== id)
  return root
}

function FileManager({ user }: { user: string }) {
  const [root, setRoot] = useState<FsNode>(() => loadFs(user))
  const [cwdId, setCwdId] = useState<string>(() => localStorage.getItem(`u:${user}:files:cwd`) || 'root')
  const [newName, setNewName] = useState('')
  const cwd = useMemo(() => findNode(root, cwdId).node || root, [root, cwdId])

  useEffect(() => { saveFs(user, root) }, [user, root])
  useEffect(() => { localStorage.setItem(`u:${user}:files:cwd`, cwdId) }, [user, cwdId])

  const createFolder = () => {
    if (!cwd.children) cwd.children = []
    cwd.children.push({ id: `f-${Date.now()}`, name: newName || 'New Folder', type: 'folder', children: [] })
    setRoot({ ...root })
    setNewName('')
  }
  const createFile = () => {
    if (!cwd.children) cwd.children = []
    cwd.children.push({ id: `f-${Date.now()}`, name: newName || 'New File.txt', type: 'file' })
    setRoot({ ...root })
    setNewName('')
  }
  const del = (id: string) => {
    const { node, parent } = findNode(root, id)
    if (!node || !parent) return
    const { node: trash } = findNode(root, 'trash')
    if (!trash) return
    parent.children = (parent.children || []).filter(c => c.id !== id)
    if (!trash.children) trash.children = []
    trash.children.push(node)
    setRoot({ ...root })
  }
  const emptyTrash = () => {
    const { node: trash } = findNode(root, 'trash')
    if (trash) { trash.children = []; setRoot({ ...root }) }
  }
  const rename = (id: string, name: string) => {
    const { node } = findNode(root, id)
    if (node) { node.name = name; setRoot({ ...root }) }
  }
  const onDropItem = (targetFolderId: string, dragId: string) => {
    if (targetFolderId === dragId) return
    const { node, parent } = findNode(root, dragId)
    const { node: target } = findNode(root, targetFolderId)
    if (!node || !parent || !target || target.type !== 'folder') return
    if (!target.children) target.children = []
    parent.children = (parent.children || []).filter(c => c.id !== dragId)
    target.children.push(node)
    setRoot({ ...root })
  }

  const breadcrumbs = useMemo(() => {
    const list: FsNode[] = []
    const buildPath = (n: FsNode, acc: FsNode[]): boolean => {
      acc.push(n)
      if (n.id === cwdId) return true
      for (const ch of n.children || []) {
        if (buildPath(ch, acc)) return true
      }
      acc.pop()
      return false
    }
    buildPath(root, list)
    return list
  }, [root, cwdId])

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((b, i) => (
          <div key={b.id} className="flex items-center gap-2">
            <button className="hover:underline" onClick={() => setCwdId(b.id)}>{b.name}</button>
            {i < breadcrumbs.length - 1 && <span className="text-white/40">/</span>}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name" className="px-2 py-1 rounded bg-white/5 ring-1 ring-white/10 w-64" />
        <button className="px-3 py-1 rounded bg-blue-500/90 hover:bg-blue-500" onClick={createFolder}>New Folder</button>
        <button className="px-3 py-1 rounded bg-emerald-500/90 hover:bg-emerald-500" onClick={createFile}>New File</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 content-start overflow-auto">
        {(cwd.children || []).map(item => (
          <div key={item.id}
               className="rounded p-2 hover:bg-white/5 group"
               draggable
               onDragStart={(e) => { e.dataTransfer.setData('text/node-id', item.id) }}
               onDragOver={(e) => { if (item.type === 'folder') e.preventDefault() }}
               onDrop={(e) => { const dragId = e.dataTransfer.getData('text/node-id'); if (item.type === 'folder') onDropItem(item.id, dragId) }}
          >
            <button className="w-full text-left" onDoubleClick={() => { if (item.type === 'folder') setCwdId(item.id) }}>
              <div className="size-14 rounded-lg bg-white/5 ring-1 ring-inset ring-white/10 flex items-center justify-center">
                <div className={`size-8 rounded-md ${item.type === 'folder' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' : 'bg-gradient-to-br from-emerald-400 to-green-500'}`}></div>
              </div>
              <div className="mt-1 text-xs truncate">{item.name}</div>
            </button>
            <div className="opacity-0 group-hover:opacity-100 transition flex gap-2 mt-1 text-xs">
              <button className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/15" onClick={() => del(item.id)}>Delete</button>
              <button className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/15" onClick={() => {
                const n = prompt('Rename to:', item.name) || item.name
                rename(item.id, n)
              }}>Rename</button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <button className="px-2 py-1 text-xs rounded bg-white/10 hover:bg-white/15" onClick={emptyTrash}>Empty Trash</button>
      </div>
    </div>
  )
}

function Notes({ user }: { user: string }) {
  const key = useUserKey(user, 'notes:text')
  const [text, setText] = useState<string>(() => localStorage.getItem(key) || '')
  useEffect(() => { localStorage.setItem(key, text) }, [key, text])
  return (
    <textarea
      className="w-full h-full resize-none rounded bg-white/5 ring-1 ring-white/10 p-3 outline-none"
      value={text}
      onChange={e => setText(e.target.value)}
      placeholder="Write your notes..."
    />
  )
}

function TextEditor({ user }: { user: string }) {
  const key = useUserKey(user, 'editor:content')
  const [content, setContent] = useState<string>(() => localStorage.getItem(key) || 'Hello, world!')
  useEffect(() => { localStorage.setItem(key, content) }, [key, content])
  return (
    <div className="h-full flex flex-col">
      <div className="text-xs text-white/60 mb-2">Plain Text</div>
      <textarea
        className="w-full h-full resize-none rounded bg-white/5 ring-1 ring-white/10 p-3 outline-none font-mono"
        value={content}
        onChange={e => setContent(e.target.value)}
      />
    </div>
  )
}

function Settings({ user, setDesktopBg }: { user: string; setDesktopBg: (v: string) => void }) {
  const options = [
    { id: 'bg-1', class: 'bg-gradient-to-br from-slate-900 via-neutral-900 to-black', name: 'Dark Slate' },
    { id: 'bg-2', class: 'bg-gradient-to-br from-indigo-950 via-indigo-900 to-sky-900', name: 'Indigo' },
    { id: 'bg-3', class: 'bg-gradient-to-br from-emerald-950 via-emerald-900 to-lime-900', name: 'Emerald' },
    { id: 'bg-4', class: 'bg-gradient-to-br from-fuchsia-900 via-purple-900 to-indigo-900', name: 'Fuchsia' },
  ]
  const current = localStorage.getItem(`u:${user}:desktop:bg`) || options[0].class
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm font-medium mb-2">Wallpaper</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {options.map(o => (
            <button key={o.id} className={`h-20 rounded-lg border ${current === o.class ? 'border-white/60' : 'border-white/10'} overflow-hidden`} onClick={() => setDesktopBg(o.class)}>
              <div className={`w-full h-full ${o.class}`} />
              <div className="text-xs px-2 py-1 text-left">{o.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
