'use client'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { css } from '@/styled-system/css'
import { Tooltip } from './Tooltip'
import { InfoIcon } from './InfoIcon'

export function CoverageThresholdInput({ studentId, initial }: { studentId: string; initial: number }) {
  const { t } = useTranslation()
  const [value, setValue] = useState(String(initial))

  const save = async (val: string) => {
    const num = Number(val) || 0
    setValue(val)
    await fetch(`/api/students/${studentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coverageMasteryThreshold: num }),
    })
    window.dispatchEvent(new Event('coverageThresholdChanged'))
  }

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
        onBlur={(e) => save(e.target.value)}
        className={css({ width: '12' })}
      />
    </label>
  )
}
