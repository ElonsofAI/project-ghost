'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ghostLog } from './ConsoleLog'

type NodeStatus = 'active' | 'degraded' | 'offline'

interface Node {
  id: string
  name: string
  system: string
  description: string
  status: NodeStatus
  completed: boolean
  metric?: string
}

const INITIAL_NODES: Node[] = [
  {
    id: 'n8n',
    name: 'n8n Automations',
    system: 'WORKFLOW_ENGINE',
    description: 'Orchestrates all webhook triggers, lead routing, and multi-step sequences.',
    status: 'active',
    completed: false,
    metric: '12 workflows',
  },
  {
    id: 'retell',
    name: 'Retell AI',
    system: 'VOICE_LAYER',
    description: 'AI voice agents handling inbound calls, triage, and appointment booking.',
    status: 'active',
    completed: false,
    metric: '4 agents live',
  },
  {
    id: 'ghl',
    name: 'GoHighLevel',
    system: 'CRM_PIPELINE',
    description: 'Contact management, pipeline stages, follow-up sequences, and reputation.',
    status: 'active',
    completed: false,
    metric: '247 contacts',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    system: 'DATA_LAYER',
    description: 'Auth, database, and real-time subscriptions powering Ghost intelligence.',
    status: 'active',
    completed: false,
    metric: 'Online',
  },
  {
    id: 'square',
    name: 'Square Payments',
    system: 'REVENUE_LAYER',
    description: '$49/mo Ghost Protocol subscriptions. Recurring billing via Square SDK.',
    status: 'degraded',
    completed: false,
    metric: 'Sandbox',
  },
  {
    id: 'claude',
    name: 'Claude Agent SDK',
    system: 'INTELLIGENCE_LAYER',
    description: 'Research agent, morning briefings, prospect scoring, and SOP generation.',
    status: 'active',
    completed: false,
    metric: 'claude-sonnet-4-6',
  },
]

const STATUS_CONFIG: Record<NodeStatus, { color: string; label: string; glow: string }> = {
  active:   { color: '#00FFFF', label: 'ONLINE',   glow: 'rgba(0,255,255,0.6)' },
  degraded: { color: '#fa7002', label: 'DEGRADED', glow: 'rgba(250,112,2,0.6)' },
  offline:  { color: '#ef4444', label: 'OFFLINE',  glow: 'rgba(239,68,68,0.6)' },
}

export function NodeGrid() {
  const [nodes, setNodes] = useState<Node[]>(INITIAL_NODES)

  function toggleNode(id: string) {
    setNodes((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n
        const next = !n.completed
        ghostLog('BYPASS_FRICTION_NODE', `${n.name} marked ${next ? 'COMPLETE' : 'PENDING'}`)
        return { ...n, completed: next }
      })
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {nodes.map((node, i) => {
        const status = STATUS_CONFIG[node.status]
        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.35 }}
            onClick={() => toggleNode(node.id)}
            className={`
              group cursor-pointer p-5 flex flex-col gap-4 transition-all duration-200
              ${node.completed ? 'opacity-40' : ''}
            `}
            style={{
              background: node.completed ? '#0a0a0a' : '#0d0d0d',
              border: '1px solid transparent',
              backgroundImage: node.completed
                ? undefined
                : `linear-gradient(#0d0d0d, #0d0d0d), linear-gradient(135deg, rgba(255,255,255,0.12), rgba(250,112,2,0.15))`,
              backgroundOrigin: 'border-box',
              backgroundClip: node.completed ? undefined : 'padding-box, border-box',
              borderColor: node.completed ? 'rgba(242,241,234,0.06)' : undefined,
            }}
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-[9px] text-bone/30 tracking-[0.25em] uppercase mb-1.5">
                  {node.system}
                </p>
                <h3 className="text-sm font-bold uppercase tracking-wide leading-tight text-bone"
                  style={{ fontFamily: 'var(--font-display)' }}>
                  {node.name}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    backgroundColor: status.color,
                    boxShadow: `0 0 6px ${status.glow}`,
                  }}
                />
                <span className="font-mono text-[9px] tracking-[0.2em]" style={{ color: status.color }}>
                  {status.label}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="font-sans text-xs text-bone/40 leading-relaxed flex-1 font-light">
              {node.description}
            </p>

            {/* Bottom row */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-orange">
                {node.metric}
              </span>
              <div className={`w-3.5 h-3.5 border flex items-center justify-center transition-all ${
                node.completed ? 'border-orange/60 bg-orange/10' : 'border-bone/20 group-hover:border-bone/40'
              }`}>
                {node.completed && (
                  <svg width="7" height="7" viewBox="0 0 7 7" fill="none">
                    <path d="M1 3.5L2.5 5L6 1.5" stroke="#fa7002" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                )}
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
