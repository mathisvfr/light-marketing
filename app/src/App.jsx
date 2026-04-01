import { useMemo, useState } from 'react'
import LoginScreen from './components/LoginScreen'
import Header from './components/Header'
import WorkflowGallery from './components/WorkflowGallery'
import BriefBuilder from './components/BriefBuilder'
import ChatInterface from './components/ChatInterface'
import LibraryPanel from './components/LibraryPanel'
import { WORKFLOWS, getWorkflowById, buildWorkflowPrompt } from './config/workflows'

const LIBRARY_STORAGE_KEY = 'lp_library_items'

function readLibraryFromStorage() {
  try {
    const raw = localStorage.getItem(LIBRARY_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeLibraryToStorage(items) {
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(items))
}

export default function App() {
  const [user, setUser] = useState(() => ({
    username: sessionStorage.getItem('lp_username') || null,
    displayName: sessionStorage.getItem('lp_displayName') || null,
  }))
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(WORKFLOWS[0].id)
  const [briefValuesByWorkflow, setBriefValuesByWorkflow] = useState({})
  const [generationRequest, setGenerationRequest] = useState(null)
  const [importedItem, setImportedItem] = useState(null)
  const [libraryItems, setLibraryItems] = useState(() => readLibraryFromStorage())
  const [currentDocument, setCurrentDocument] = useState(null)
  const [taskConfirmed, setTaskConfirmed] = useState(false)
  const [step3Unlocked, setStep3Unlocked] = useState(false)
  const [openStep, setOpenStep] = useState('step1')

  const workflow = getWorkflowById(selectedWorkflowId)
  const briefValues = briefValuesByWorkflow[selectedWorkflowId] || {}
  const missingRequiredFields = getMissingRequiredFields(workflow, briefValues)
  const isBriefComplete = missingRequiredFields.length === 0
  const currentStep = step3Unlocked ? 3 : taskConfirmed ? 2 : 1

  const recentItems = useMemo(() => libraryItems.slice(0, 6), [libraryItems])
  const savedItems = useMemo(
    () => libraryItems.filter((item) => item.saved).slice(0, 6),
    [libraryItems],
  )
  const isCurrentSaved = useMemo(() => {
    if (!currentDocument?.content) return false
    return libraryItems.some(
      (item) => item.saved && item.content === currentDocument.content && item.workflowId === currentDocument.workflowId,
    )
  }, [currentDocument, libraryItems])

  const handleLogin = (username, displayName) => {
    sessionStorage.setItem('lp_username', username)
    sessionStorage.setItem('lp_displayName', displayName)
    setUser({ username, displayName })
  }

  const handleLogout = () => {
    sessionStorage.removeItem('lp_username')
    sessionStorage.removeItem('lp_displayName')
    setUser({ username: null, displayName: null })
  }

  const updateBriefValue = (field, value) => {
    setBriefValuesByWorkflow((current) => ({
      ...current,
      [selectedWorkflowId]: {
        ...current[selectedWorkflowId],
        [field]: value,
      },
    }))
  }

  const persistLibrary = (updater) => {
    setLibraryItems((current) => {
      const next = updater(current)
      writeLibraryToStorage(next)
      return next
    })
  }

  const handleGenerate = () => {
    if (!taskConfirmed || !isBriefComplete) return

    const prompt = buildWorkflowPrompt(workflow, {
      audience: briefValues.audience || workflow.audience,
      channel: briefValues.channel || workflow.channel,
      language: briefValues.language || workflow.language,
      ...briefValues,
    })

    const title = buildDocumentTitle(workflow, briefValues)

    setGenerationRequest({
      id: crypto.randomUUID(),
      prompt,
      meta: {
        title,
        brief: briefValues,
        persistRecent: true,
      },
    })
    setStep3Unlocked(true)
    setOpenStep('step3')
    setCurrentDocument(null)
  }

  const handleAssistantComplete = ({ content, requestMeta, workflowId, workflowTitle }) => {
    const documentItem = {
      id: crypto.randomUUID(),
      title: requestMeta?.title || workflowTitle,
      workflowId,
      workflowTitle,
      brief: requestMeta?.brief || null,
      content,
      preview: content.slice(0, 180),
      createdAt: new Date().toISOString(),
      saved: false,
    }

    setCurrentDocument(documentItem)

    if (!requestMeta?.persistRecent) return

    persistLibrary((current) => [documentItem, ...current].slice(0, 24))
  }

  const handleOpenItem = (item) => {
    setSelectedWorkflowId(item.workflowId)
    setTaskConfirmed(true)
    setStep3Unlocked(true)
    setOpenStep('step3')
    if (item.brief) {
      setBriefValuesByWorkflow((current) => ({
        ...current,
        [item.workflowId]: item.brief,
      }))
    }
    setImportedItem({ ...item, openToken: crypto.randomUUID() })
    setCurrentDocument(item)
  }

  const handleToggleSave = (targetItem) => {
    persistLibrary((current) =>
      current.map((item) =>
        item.id === targetItem.id ? { ...item, saved: !item.saved } : item,
      ),
    )

    if (currentDocument?.id === targetItem.id) {
      setCurrentDocument((current) => (current ? { ...current, saved: !current.saved } : current))
    }
  }

  const handleSaveCurrent = (item) => {
    const existing = libraryItems.find(
      (entry) => entry.content === item.content && entry.workflowId === item.workflowId,
    )

    if (existing) {
      persistLibrary((current) =>
        current.map((entry) => (entry.id === existing.id ? { ...entry, saved: true } : entry)),
      )
      setCurrentDocument({ ...existing, saved: true })
      return
    }

    const nextItem = {
      id: crypto.randomUUID(),
      title: item.title,
      workflowId: item.workflowId,
      workflowTitle: item.workflowTitle,
      brief: item.brief || null,
      content: item.content,
      preview: item.content.slice(0, 180),
      createdAt: new Date().toISOString(),
      saved: true,
    }

    persistLibrary((current) => [nextItem, ...current].slice(0, 24))
    setCurrentDocument(nextItem)
  }

  if (!user.username) {
    return <LoginScreen onLogin={handleLogin} />
  }

  const handleWorkflowSelect = (workflowId) => {
    setSelectedWorkflowId(workflowId)
    setTaskConfirmed(false)
    setStep3Unlocked(false)
    setOpenStep('step1')
    setGenerationRequest(null)
    setImportedItem(null)
    setCurrentDocument(null)
  }

  const confirmTaskSelection = () => {
    setTaskConfirmed(true)
    setOpenStep('step2')
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#f4f6fb_44%,#eef2ff_100%)]">
      <Header displayName={user.displayName} onLogout={handleLogout} activeWorkflow={workflow} />

      <main className="mx-auto max-w-7xl px-4 pb-10 pt-5">
        <section className="rounded-4xl border border-slate-200 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.14),transparent_24%),linear-gradient(145deg,#ffffff,#f8fafc)] px-6 py-5 shadow-[0_24px_55px_-42px_rgba(15,23,42,0.45)]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                Simpler workflow
              </p>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                Choose a task, fill in the brief, review the draft.
              </h1>
              <p className="mt-2 text-sm leading-7 text-slate-500">
                The screen is now structured around one clear path so it feels easier to use during live client sessions.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <TopMetric label="Current" value={`Step ${currentStep}`} active />
              {currentStep >= 1 ? <TopMetric label="Step 1" value="Choose task" active /> : null}
              {currentStep >= 2 ? <TopMetric label="Step 2" value="Fill brief" active /> : null}
              {currentStep >= 3 ? <TopMetric label="Step 3" value="Review draft" active /> : null}
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white shadow-sm">
          <SectionHeader
            step="Step 1"
            title="Choose task"
            isOpen={openStep === 'step1'}
            isCompleted={taskConfirmed}
            onClick={() => setOpenStep(openStep === 'step1' ? '' : 'step1')}
          />
          {openStep === 'step1' ? (
            <div className="border-t border-slate-100 p-4">
              <WorkflowGallery
                workflows={WORKFLOWS}
                activeWorkflowId={selectedWorkflowId}
                onSelect={handleWorkflowSelect}
              />
              <div className="mt-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <p className="text-sm text-slate-500">
                  Selected: <span className="font-semibold text-slate-700">{workflow.title}</span>
                </p>
                {taskConfirmed ? (
                  <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    Step 1 complete
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={confirmTaskSelection}
                    className="rounded-full bg-blue-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-950"
                  >
                    Continue to Step 2
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </section>

        {taskConfirmed ? (
          <section className="mt-4 rounded-3xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              step="Step 2"
              title="Fill brief"
              isOpen={openStep === 'step2'}
              isCompleted={step3Unlocked}
              onClick={() => setOpenStep(openStep === 'step2' ? '' : 'step2')}
            />
            {openStep === 'step2' ? (
              <div className="border-t border-slate-100 p-4">
                <BriefBuilder
                  workflow={workflow}
                  values={briefValues}
                  onChange={updateBriefValue}
                  onGenerate={handleGenerate}
                  isLoading={Boolean(generationRequest && generationRequest.id && !currentDocument)}
                  isLocked={false}
                  canGenerate={isBriefComplete}
                  missingRequiredFields={missingRequiredFields}
                />
              </div>
            ) : null}
          </section>
        ) : null}

        {step3Unlocked ? (
          <section className="mt-4 rounded-3xl border border-slate-200 bg-white shadow-sm">
            <SectionHeader
              step="Step 3"
              title="Review draft"
              isOpen={openStep === 'step3'}
              isCompleted={Boolean(currentDocument?.content)}
              onClick={() => setOpenStep(openStep === 'step3' ? '' : 'step3')}
            />
            {openStep === 'step3' ? (
              <div className="border-t border-slate-100 p-4">
                <ChatInterface
                  workflow={workflow}
                  generationRequest={generationRequest}
                  onRequestConsumed={() => setGenerationRequest(null)}
                  importedItem={importedItem}
                  onImportedItemConsumed={() => setImportedItem(null)}
                  onAssistantComplete={handleAssistantComplete}
                  onSaveCurrent={handleSaveCurrent}
                  isCurrentSaved={isCurrentSaved}
                  currentDocument={currentDocument}
                  isLocked={false}
                />
              </div>
            ) : null}
          </section>
        ) : null}

        {step3Unlocked ? (
          <section className="mt-6">
            <LibraryPanel
              recentItems={recentItems}
              savedItems={savedItems}
              onOpenItem={handleOpenItem}
              onToggleSave={handleToggleSave}
            />
          </section>
        ) : null}
      </main>
    </div>
  )
}

function TopMetric({ label, value, active = false }) {
  return (
    <div
      className={`rounded-2xl border px-4 py-2.5 shadow-sm backdrop-blur ${
        active
          ? 'border-white/70 bg-white/85'
          : 'border-slate-200 bg-slate-100/70'
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className={`mt-1 text-sm font-medium ${active ? 'text-slate-700' : 'text-slate-400'}`}>{value}</p>
    </div>
  )
}

function SectionHeader({ step, title, isOpen, isCompleted, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
    >
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{step}</p>
        <p className="mt-1 text-lg font-semibold text-slate-900">{title}</p>
      </div>

      <div className="flex items-center gap-2">
        {isCompleted ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            Complete
          </span>
        ) : null}
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {isOpen ? 'Collapse' : 'Open'}
        </span>
      </div>
    </button>
  )
}

function getMissingRequiredFields(workflow, values) {
  return workflow.fields
    .filter((field) => field.required)
    .map((field) => field.name)
    .filter((fieldName) => !(values[fieldName] || '').trim())
}

function buildDocumentTitle(workflow, values) {
  const primaryValue =
    values.jobTitle ||
    values.companyName ||
    values.topic ||
    values.theme ||
    values.timeframe ||
    values.keyword ||
    workflow.title

  return `${workflow.title} · ${primaryValue}`
}
