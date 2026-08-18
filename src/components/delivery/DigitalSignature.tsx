'use client'

import { useRef, useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2, Save, Pen } from 'lucide-react'

interface DigitalSignatureProps {
  onSave: (signatureData: { svg: string; points: { x: number; y: number }[] }) => void
  width?: number
  height?: number
}

export function DigitalSignature({ onSave, width = 500, height = 200 }: DigitalSignatureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [points, setPoints] = useState<{ x: number; y: number }[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = width
    canvas.height = height
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = '#000'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [width, height])

  const getPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    
    const rect = canvas.getBoundingClientRect()
    
    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      }
    }
    
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const pos = getPosition(e)
    setIsDrawing(true)
    setPoints([pos])
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    ctx.beginPath()
    ctx.moveTo(pos.x, pos.y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return
    
    const pos = getPosition(e)
    setPoints(prev => [...prev, pos])
    
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    setHasSignature(true)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    setPoints([])
  }

  const saveSignature = () => {
    const canvas = canvasRef.current
    if (!canvas || !hasSignature) return

    // ذخیره به صورت SVG
    const svgData = canvas.toDataURL('image/svg+xml')
    
    onSave({
      svg: svgData,
      points,
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Pen className="w-4 h-4" />
        <span className="text-sm font-medium">امضای دیجیتال دریافت‌کننده</span>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-1 bg-white">
        <canvas
          ref={canvasRef}
          className="w-full touch-none cursor-crosshair"
          style={{ height: `${height}px` }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div className="flex gap-2 justify-end">
  {hasSignature && (
    <>
      <Button
        type="button"
        onClick={clearSignature}
        className="border px-3 py-2 rounded-md"
      >
        <Trash2 className="w-4 h-4 ml-1" />
        پاک کردن
      </Button>

      <Button
        type="button"
        className="px-3 py-2 text-sm"
        onClick={saveSignature}
      >
        <Save className="w-4 h-4 ml-1" />
        ثبت امضا
      </Button>
    </>
  )}
</div>
    </div>
  )
}
