import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Palette, Sun, Moon, Settings, Check, Monitor, Sparkles, Eye, Wand2 } from 'lucide-react'

interface ThemeSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThemeSelector({ open, onOpenChange }: Readonly<ThemeSelectorProps>) {
  const { theme, colors, setTheme, setCustomColors, presetThemes, applyPresetTheme } = useTheme()
  const [activeTab, setActiveTab] = useState("presets")

  const handleColorChange = (colorKey: keyof typeof colors, value: string) => {
    const hsl = hexToHsl(value)
    setCustomColors({ [colorKey]: hsl })
  }

  const hexToHsl = (hex: string): string => {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break
        case g: h = (b - r) / d + 2; break
        case b: h = (r - g) / d + 4; break
      }
      h /= 6
    }

    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
  }

  const hslToHex = (hsl: string): string => {
    const [h, s, l] = hsl.split(' ').map((v, i) => {
      if (i === 0) return parseInt(v) / 360
      return parseInt(v) / 100
    })

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    let r: number, g: number, b: number

    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-hidden bg-primary-custom border-primary-custom shadow-primary-custom">
        <DialogHeader className="bg-secondary-custom rounded-xl p-6 mb-6 border border-primary-custom">
          <DialogTitle className="flex items-center gap-3 text-primary-custom text-2xl font-bold">
            <div className="p-2 accent-primary-custom rounded-lg shadow-primary-custom">
              <Sparkles className="h-6 w-6 text-secondary-custom" />
            </div>
            Theme Studio
          </DialogTitle>
          <p className="text-secondary-custom mt-2 text-sm opacity-80">
            Craft your perfect visual experience with our advanced theme customizer
          </p>
        </DialogHeader>

        <div className="overflow-y-auto px-1 max-h-[60vh]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-secondary-custom border border-primary-custom rounded-xl p-1 mb-8">
              <TabsTrigger
                value="basic"
                className="flex items-center gap-2 rounded-lg transition-all duration-300 hover-primary-custom data-[state=active]:accent-primary-custom data-[state=active]:text-secondary-custom data-[state=active]:shadow-primary-custom"
              >
                <Sun className="h-4 w-4" />
                <span className="font-medium">Quick Select</span>
              </TabsTrigger>
              <TabsTrigger
                value="presets"
                className="flex items-center gap-2 rounded-lg transition-all duration-300 hover-primary-custom data-[state=active]:accent-primary-custom data-[state=active]:text-secondary-custom data-[state=active]:shadow-primary-custom"
              >
                <Palette className="h-4 w-4" />
                <span className="font-medium">Presets</span>
              </TabsTrigger>
              <TabsTrigger
                value="custom"
                className="flex items-center gap-2 rounded-lg transition-all duration-300 hover-primary-custom data-[state=active]:accent-primary-custom data-[state=active]:text-secondary-custom data-[state=active]:shadow-primary-custom"
              >
                <Wand2 className="h-4 w-4" />
                <span className="font-medium">Custom</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <Card
                  className={`group cursor-pointer transition-all duration-500 hover:scale-105 hover-primary-custom bg-secondary-custom border-primary-custom rounded-2xl overflow-hidden relative ${theme === 'light' ? 'ring-0 ring-offset-2 ring-primary-custom accent-primary-custom' : ''}`}
                  onClick={() => setTheme('light')}
                >
                  <CardHeader className="text-center pb-4 bg-gradient-to-br from-yellow-50 to-orange-50">
                    <div className="mx-auto p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg">
                      <Sun className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-primary-custom mt-3">Light Mode</CardTitle>
                    <p className="text-xs text-secondary-custom opacity-70">Clean & bright interface</p>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-24 rounded-xl bg-white border-2 border-gray-200 p-3 space-y-2 shadow-inner">
                      <div className="h-3 bg-gray-800 rounded-full"></div>
                      <div className="h-2 bg-gray-400 rounded-full w-3/4"></div>
                      <div className="h-2 bg-gray-300 rounded-full w-1/2"></div>
                      <div className="flex gap-1 mt-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                  {theme === 'light' && (
                    <div className="absolute top-3 right-3 p-1 bg-green-100 rounded-full">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                </Card>

                <Card
                  className={`group cursor-pointer transition-all duration-500 hover:scale-105 hover-primary-custom bg-secondary-custom border-primary-custom rounded-2xl overflow-hidden relative ${theme === 'dark' ? 'ring-0 ring-offset-2 ring-primary-custom accent-primary-custom' : ''}`}
                  onClick={() => setTheme('dark')}
                >
                  <CardHeader className="text-center pb-4 bg-gradient-to-br from-slate-800 to-slate-900">
                    <div className="mx-auto p-3 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-lg">
                      <Moon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-white mt-3">Dark Mode</CardTitle>
                    <p className="text-xs text-gray-300 opacity-70">Easy on the eyes</p>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-24 rounded-xl bg-gray-900 border-2 border-gray-700 p-3 space-y-2 shadow-inner">
                      <div className="h-3 bg-white rounded-full"></div>
                      <div className="h-2 bg-gray-300 rounded-full w-3/4"></div>
                      <div className="h-2 bg-gray-500 rounded-full w-1/2"></div>
                      <div className="flex gap-1 mt-2">
                        <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                        <div className="w-4 h-4 bg-green-400 rounded-full"></div>
                        <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                  {theme === 'dark' && (
                    <div className="absolute top-3 right-3 p-1 bg-green-100 rounded-full">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                </Card>

                <Card
                  className={`group cursor-pointer transition-all duration-500 hover:scale-105 hover-primary-custom bg-secondary-custom border-primary-custom rounded-2xl overflow-hidden relative ${theme === 'system' ? 'ring-0 ring-offset-2 ring-primary-custom accent-primary-custom' : ''}`}
                  onClick={() => setTheme('system')}
                >
                  <CardHeader className="text-center pb-4 bg-gradient-to-br from-gray-100 to-gray-200">
                    <div className="mx-auto p-3 bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl shadow-lg">
                      <Monitor className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-primary-custom mt-3">System</CardTitle>
                    <p className="text-xs text-secondary-custom opacity-70">Follows OS preference</p>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-24 rounded-xl bg-gradient-to-r from-white to-gray-900 border-2 border-gray-400 p-3 space-y-2 shadow-inner">
                      <div className="h-3 bg-gradient-to-r from-gray-800 to-white rounded-full"></div>
                      <div className="h-2 bg-gray-500 rounded-full w-3/4"></div>
                      <div className="h-2 bg-gray-400 rounded-full w-1/2"></div>
                      <div className="flex gap-1 mt-2">
                        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full"></div>
                        <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-400 rounded-full"></div>
                        <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-400 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                  {theme === 'system' && (
                    <div className="absolute top-3 right-3 p-1 bg-green-100 rounded-full">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                </Card>

                <Card
                  className={`group cursor-pointer transition-all duration-500 hover:scale-105 hover-primary-custom bg-secondary-custom border-primary-custom rounded-2xl overflow-hidden relative ${theme === 'custom' ? 'ring-0 ring-offset-2 ring-primary-custom accent-primary-custom' : ''}`}
                  onClick={() => setActiveTab('custom')}
                >
                  <CardHeader className="text-center pb-4 bg-gradient-to-br from-purple-100 to-pink-100">
                    <div className="mx-auto p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl shadow-lg">
                      <Settings className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-primary-custom mt-3">Custom Theme</CardTitle>
                    <p className="text-xs text-secondary-custom opacity-70">Design your own</p>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="h-24 rounded-xl border-2 border-primary-custom p-3 space-y-2 bg-primary-custom">
                      <div className="h-3 accent-primary-custom rounded-full"></div>
                      <div className="h-2 bg-secondary-custom rounded-full w-3/4"></div>
                      <div className="h-2 border-secondary-custom border rounded-full w-1/2"></div>
                      <div className="flex gap-1 mt-2">
                        <div className="w-4 h-4 accent-primary-custom rounded-full"></div>
                        <div className="w-4 h-4 accent-secondary-custom rounded-full"></div>
                        <div className="w-4 h-4 border-primary-custom border-2 rounded-full"></div>
                      </div>
                    </div>
                  </CardContent>
                  {theme === 'custom' && (
                    <div className="absolute top-3 right-3 p-1 bg-green-100 rounded-full">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="presets" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {presetThemes.map((preset, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer transition-all duration-500 hover:scale-105 hover-primary-custom bg-secondary-custom border-primary-custom rounded-2xl overflow-hidden group shadow-primary-custom"
                    onClick={() => applyPresetTheme(preset)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl font-bold text-primary-custom">{preset.name}</CardTitle>
                          <CardDescription className="text-secondary-custom mt-1">
                            Click to apply this beautiful preset
                          </CardDescription>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Sparkles className="h-5 w-5 text-primary-custom" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div
                        className="h-20 rounded-xl border-2 p-4 transition-all duration-300 group-hover:shadow-lg"
                        style={{
                          backgroundColor: `hsl(${preset.colors['primary-bg']})`,
                          borderColor: `hsl(${preset.colors['primary-border']})`,
                          color: `hsl(${preset.colors['primary-text']})`
                        }}
                      >
                        <div className="space-y-2">
                          <div
                            className="h-3 rounded-full"
                            style={{ backgroundColor: `hsl(${preset.colors['primary-accent']})` }}
                          ></div>
                          <div
                            className="h-2 rounded-full w-2/3"
                            style={{ backgroundColor: `hsl(${preset.colors['secondary-text']})` }}
                          ></div>
                          <div
                            className="h-2 rounded-full w-1/2"
                            style={{ backgroundColor: `hsl(${preset.colors['secondary-border']})` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {Object.entries(preset.colors).slice(0, 6).map(([key, value], colorIndex) => (
                            <div
                              key={colorIndex}
                              className="w-8 h-8 rounded-full border-2 border-primary-custom shadow-sm transition-transform hover:scale-110"
                              style={{ backgroundColor: `hsl(${value})` }}
                              title={key.replace('-', ' ').toUpperCase()}
                            />
                          ))}
                        </div>
                        <Badge variant="outline" className="text-xs border-primary-custom text-primary-custom">
                          {Object.keys(preset.colors).length} colors
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-secondary-custom border border-primary-custom rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-primary-custom mb-4 flex items-center gap-2">
                      <div className="w-4 h-4 accent-primary-custom rounded-full"></div>
                      Background Colors
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="primary-bg" className="w-28 text-sm text-primary-custom font-medium">Primary BG</Label>
                        <Input
                          id="primary-bg"
                          type="color"
                          value={hslToHex(colors['primary-bg'])}
                          onChange={(e) => handleColorChange('primary-bg', e.target.value)}
                          className="w-16 h-12 p-1 cursor-pointer rounded-lg border-primary-custom"
                        />
                        <code className="text-xs text-secondary-custom font-mono bg-primary-custom px-2 py-1 rounded">
                          {colors['primary-bg']}
                        </code>
                      </div>
                      <div className="flex items-center gap-4">
                        <Label htmlFor="secondary-bg" className="w-28 text-sm text-primary-custom font-medium">Secondary BG</Label>
                        <Input
                          id="secondary-bg"
                          type="color"
                          value={hslToHex(colors['secondary-bg'])}
                          onChange={(e) => handleColorChange('secondary-bg', e.target.value)}
                          className="w-16 h-12 p-1 cursor-pointer rounded-lg border-primary-custom"
                        />
                        <code className="text-xs text-secondary-custom font-mono bg-primary-custom px-2 py-1 rounded">
                          {colors['secondary-bg']}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary-custom border border-primary-custom rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-primary-custom mb-4 flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-custom rounded-full"></div>
                      Border Colors
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="primary-border" className="w-28 text-sm text-primary-custom font-medium">Primary Border</Label>
                        <Input
                          id="primary-border"
                          type="color"
                          value={hslToHex(colors['primary-border'])}
                          onChange={(e) => handleColorChange('primary-border', e.target.value)}
                          className="w-16 h-12 p-1 cursor-pointer rounded-lg border-primary-custom"
                        />
                        <code className="text-xs text-secondary-custom font-mono bg-primary-custom px-2 py-1 rounded">
                          {colors['primary-border']}
                        </code>
                      </div>
                      <div className="flex items-center gap-4">
                        <Label htmlFor="secondary-border" className="w-28 text-sm text-primary-custom font-medium">Secondary Border</Label>
                        <Input
                          id="secondary-border"
                          type="color"
                          value={hslToHex(colors['secondary-border'])}
                          onChange={(e) => handleColorChange('secondary-border', e.target.value)}
                          className="w-16 h-12 p-1 cursor-pointer rounded-lg border-primary-custom"
                        />
                        <code className="text-xs text-secondary-custom font-mono bg-primary-custom px-2 py-1 rounded">
                          {colors['secondary-border']}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-secondary-custom border border-primary-custom rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-primary-custom mb-4 flex items-center gap-2">
                      <div className="w-4 h-4 bg-current rounded-full"></div>
                      Text Colors
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="primary-text" className="w-28 text-sm text-primary-custom font-medium">Primary Text</Label>
                        <Input
                          id="primary-text"
                          type="color"
                          value={hslToHex(colors['primary-text'])}
                          onChange={(e) => handleColorChange('primary-text', e.target.value)}
                          className="w-16 h-12 p-1 cursor-pointer rounded-lg border-primary-custom"
                        />
                        <code className="text-xs text-secondary-custom font-mono bg-primary-custom px-2 py-1 rounded">
                          {colors['primary-text']}
                        </code>
                      </div>
                      <div className="flex items-center gap-4">
                        <Label htmlFor="secondary-text" className="w-28 text-sm text-primary-custom font-medium">Secondary Text</Label>
                        <Input
                          id="secondary-text"
                          type="color"
                          value={hslToHex(colors['secondary-text'])}
                          onChange={(e) => handleColorChange('secondary-text', e.target.value)}
                          className="w-16 h-12 p-1 cursor-pointer rounded-lg border-primary-custom"
                        />
                        <code className="text-xs text-secondary-custom font-mono bg-primary-custom px-2 py-1 rounded">
                          {colors['secondary-text']}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary-custom border border-primary-custom rounded-2xl p-6">
                    <h4 className="text-lg font-semibold text-primary-custom mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Accent Colors
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <Label htmlFor="primary-accent" className="w-28 text-sm text-primary-custom font-medium">Primary Accent</Label>
                        <Input
                          id="primary-accent"
                          type="color"
                          value={hslToHex(colors['primary-accent'])}
                          onChange={(e) => handleColorChange('primary-accent', e.target.value)}
                          className="w-16 h-12 p-1 cursor-pointer rounded-lg border-primary-custom"
                        />
                        <code className="text-xs text-secondary-custom font-mono bg-primary-custom px-2 py-1 rounded">
                          {colors['primary-accent']}
                        </code>
                      </div>
                      <div className="flex items-center gap-4">
                        <Label htmlFor="secondary-accent" className="w-28 text-sm text-primary-custom font-medium">Secondary Accent</Label>
                        <Input
                          id="secondary-accent"
                          type="color"
                          value={hslToHex(colors['secondary-accent'])}
                          onChange={(e) => handleColorChange('secondary-accent', e.target.value)}
                          className="w-16 h-12 p-1 cursor-pointer rounded-lg border-primary-custom"
                        />
                        <code className="text-xs text-secondary-custom font-mono bg-primary-custom px-2 py-1 rounded">
                          {colors['secondary-accent']}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}