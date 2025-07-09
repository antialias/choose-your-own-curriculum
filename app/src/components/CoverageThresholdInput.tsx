'use client'
import { useState, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { css } from '@/styled-system/css'
import { Tooltip } from './Tooltip'
import { InfoIcon } from './InfoIcon'

export function CoverageThresholdInput({ studentId, initial }: { studentId: string; initial: number }) {
  const { t } = useTranslation()
  const [value, setValue] = useState(String(initial))
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (debounce.current) clearTimeout(debounce.current)
    const val = value
    debounce.current = setTimeout(async () => {
      const num = Number(val) || 0
      await fetch(`/api/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverageMasteryThreshold: num }),
      })
      window.dispatchEvent(new Event('coverageThresholdChanged'))
    }, 500)
  }, [value, studentId])

  return (
    <label className={css({ display: 'flex', alignItems: 'center', gap: '1', marginBottom: '1rem' })}>
      {t('coverageThreshold')}
      <Tooltip content={t('coverageThresholdInfo')}>
        <span className={css({ color: 'blue.500', cursor: 'pointer' })}>
          <InfoIcon />
        </span>
      </Tooltip>
      <input
        type="number"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className={css({ width: '12' })}
      />
    </label>
  )
}
