
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useTheme } from '@/components/providers/ThemeProvider'
import { Palette, Sun, Moon, Settings, Check, Monitor } from 'lucide-react'

interface ThemeSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ThemeSelector({ open, onOpenChange }: ThemeSelectorProps) {
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
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }

    let r: number, g: number, b: number

    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme Customizer
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Sun className="h-4 w-4" />
              Basic
            </TabsTrigger>
            <TabsTrigger value="presets" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Presets
            </TabsTrigger>
            <TabsTrigger value="custom" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Custom
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card 
                className={`cursor-pointer transition-all hover:scale-105 ${theme === 'light' ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setTheme('light')}
              >
                <CardHeader className="text-center pb-3">
                  <Sun className="h-8 w-8 mx-auto text-yellow-500" />
                  <CardTitle className="text-sm">Light Mode</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="h-20 rounded bg-white border-2 border-gray-200 p-2">
                    <div className="h-2 bg-gray-800 rounded mb-1"></div>
                    <div className="h-1 bg-gray-400 rounded w-3/4 mb-1"></div>
                    <div className="h-1 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </CardContent>
                {theme === 'light' && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                )}
              </Card>

              <Card 
                className={`cursor-pointer transition-all hover:scale-105 ${theme === 'dark' ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <CardHeader className="text-center pb-3">
                  <Moon className="h-8 w-8 mx-auto text-blue-400" />
                  <CardTitle className="text-sm">Dark Mode</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="h-20 rounded bg-gray-900 border-2 border-gray-700 p-2">
                    <div className="h-2 bg-white rounded mb-1"></div>
                    <div className="h-1 bg-gray-300 rounded w-3/4 mb-1"></div>
                    <div className="h-1 bg-gray-500 rounded w-1/2"></div>
                  </div>
                </CardContent>
                {theme === 'dark' && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                )}
              </Card>

              <Card 
                className={`cursor-pointer transition-all hover:scale-105 ${theme === 'system' ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setTheme('system')}
              >
                <CardHeader className="text-center pb-3">
                  <Monitor className="h-8 w-8 mx-auto text-gray-500" />
                  <CardTitle className="text-sm">System</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="h-20 rounded bg-gradient-to-r from-white to-gray-900 border-2 border-gray-400 p-2">
                    <div className="h-2 bg-gradient-to-r from-gray-800 to-white rounded mb-1"></div>
                    <div className="h-1 bg-gray-500 rounded w-3/4 mb-1"></div>
                    <div className="h-1 bg-gray-400 rounded w-1/2"></div>
                  </div>
                </CardContent>
                {theme === 'system' && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                )}
              </Card>

              <Card 
                className={`cursor-pointer transition-all hover:scale-105 ${theme === 'custom' ? 'ring-2 ring-primary' : ''}`}
              >
                <CardHeader className="text-center pb-3">
                  <Settings className="h-8 w-8 mx-auto text-purple-500" />
                  <CardTitle className="text-sm">Custom Theme</CardTitle>
                </CardHeader>
                <CardContent className="p-3">
                  <div className="h-20 rounded border-2 p-2" style={{ 
                    backgroundColor: `hsl(${colors['primary-bg']})`,
                    borderColor: `hsl(${colors['primary-border']})`,
                    color: `hsl(${colors['primary-text']})`
                  }}>
                    <div className="h-2 rounded mb-1" style={{ backgroundColor: `hsl(${colors['primary-accent']})` }}></div>
                    <div className="h-1 rounded w-3/4 mb-1" style={{ backgroundColor: `hsl(${colors['secondary-text']})` }}></div>
                    <div className="h-1 rounded w-1/2" style={{ backgroundColor: `hsl(${colors['secondary-border']})` }}></div>
                  </div>
                </CardContent>
                {theme === 'custom' && (
                  <div className="absolute top-2 right-2">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {presetThemes.map((preset, index) => (
                <Card 
                  key={index}
                  className="cursor-pointer transition-all hover:scale-105 group"
                  onClick={() => applyPresetTheme(preset)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{preset.name}</CardTitle>
                    <CardDescription>Click to apply this preset theme</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-16 rounded-lg border-2 p-3" style={{ 
                        backgroundColor: `hsl(${preset.colors['primary-bg']})`,
                        borderColor: `hsl(${preset.colors['primary-border']})`,
                        color: `hsl(${preset.colors['primary-text']})`
                      }}>
                        <div className="h-3 rounded mb-2" style={{ backgroundColor: `hsl(${preset.colors['primary-accent']})` }}></div>
                        <div className="h-2 rounded w-2/3" style={{ backgroundColor: `hsl(${preset.colors['secondary-text']})` }}></div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(preset.colors).slice(0, 4).map(([key, value]) => (
                          <div
                            key={key}
                            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                            style={{ backgroundColor: `hsl(${value})` }}
                            title={key}
                          />
                        ))}
                        <Badge variant="outline" className="text-xs">+{Object.keys(preset.colors).length - 4}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Background Colors</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="primary-bg" className="w-24 text-sm">Primary BG</Label>
                    <Input
                      id="primary-bg"
                      type="color"
                      value={hslToHex(colors['primary-bg'])}
                      onChange={(e) => handleColorChange('primary-bg', e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground font-mono">{colors['primary-bg']}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label htmlFor="secondary-bg" className="w-24 text-sm">Secondary BG</Label>
                    <Input
                      id="secondary-bg"
                      type="color"
                      value={hslToHex(colors['secondary-bg'])}
                      onChange={(e) => handleColorChange('secondary-bg', e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground font-mono">{colors['secondary-bg']}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Text Colors</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="primary-text" className="w-24 text-sm">Primary Text</Label>
                    <Input
                      id="primary-text"
                      type="color"
                      value={hslToHex(colors['primary-text'])}
                      onChange={(e) => handleColorChange('primary-text', e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground font-mono">{colors['primary-text']}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label htmlFor="secondary-text" className="w-24 text-sm">Secondary Text</Label>
                    <Input
                      id="secondary-text"
                      type="color"
                      value={hslToHex(colors['secondary-text'])}
                      onChange={(e) => handleColorChange('secondary-text', e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground font-mono">{colors['secondary-text']}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Border Colors</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="primary-border" className="w-24 text-sm">Primary Border</Label>
                    <Input
                      id="primary-border"
                      type="color"
                      value={hslToHex(colors['primary-border'])}
                      onChange={(e) => handleColorChange('primary-border', e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground font-mono">{colors['primary-border']}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label htmlFor="secondary-border" className="w-24 text-sm">Secondary Border</Label>
                    <Input
                      id="secondary-border"
                      type="color"
                      value={hslToHex(colors['secondary-border'])}
                      onChange={(e) => handleColorChange('secondary-border', e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground font-mono">{colors['secondary-border']}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Accent Colors</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Label htmlFor="primary-accent" className="w-24 text-sm">Primary Accent</Label>
                    <Input
                      id="primary-accent"
                      type="color"
                      value={hslToHex(colors['primary-accent'])}
                      onChange={(e) => handleColorChange('primary-accent', e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground font-mono">{colors['primary-accent']}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label htmlFor="secondary-accent" className="w-24 text-sm">Secondary Accent</Label>
                    <Input
                      id="secondary-accent"
                      type="color"
                      value={hslToHex(colors['secondary-accent'])}
                      onChange={(e) => handleColorChange('secondary-accent', e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <span className="text-xs text-muted-foreground font-mono">{colors['secondary-accent']}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg border-2" style={{ 
              backgroundColor: `hsl(${colors['primary-bg']})`,
              borderColor: `hsl(${colors['primary-border']})`,
              color: `hsl(${colors['primary-text']})`
            }}>
              <h4 className="text-lg font-semibold mb-2">Live Preview</h4>
              <p className="mb-3" style={{ color: `hsl(${colors['secondary-text']})` }}>
                This is how your custom theme will look with the current color settings.
              </p>
              <Button style={{ backgroundColor: `hsl(${colors['primary-accent']})` }}>
                Primary Button
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
