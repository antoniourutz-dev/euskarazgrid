/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { GridCard } from './components/GridCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Printer, Settings2, LayoutGrid, Type, FileDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { toCanvas } from 'html-to-image';

import { BackCard } from './components/BackCard';

interface GridItem {
  id: string;
  topText: string;
  bottomText: string;
  topFontSize?: number;
  bottomFontSize?: number;
  underlineLastA?: boolean;
}

const INITIAL_ITEMS: GridItem[] = [
  { id: '1', topText: 'BULTZATU', bottomText: 'ZUZENDU' },
  { id: '2', topText: 'ARTEZTU', bottomText: 'TREBATU' },
  { id: '3', topText: 'PRESTATU', bottomText: 'AHULDU' },
  { id: '4', topText: 'MAKALDU', bottomText: 'JASAN' },
  { id: '5', topText: 'NOZITU', bottomText: 'ERRAZTU' },
  { id: '6', topText: 'SAMURTU', bottomText: 'EZKUTATU' },
  { id: '7', topText: 'GORDE', bottomText: 'GAITZETSI' },
  { id: '8', topText: 'MESPRETXATU', bottomText: 'ESKABIDE' },
  { id: '9', topText: 'ESKAERA', bottomText: 'HORTAZ' },
  { id: '10', topText: 'BERAZ', bottomText: 'BESTELA' },
  { id: '11', topText: 'OSTERANTZEAN', bottomText: 'ADIBIDEZ' },
  { id: '12', topText: 'ESATERAKO', bottomText: 'ONURA' },
  { id: '13', topText: 'PROBETXU', bottomText: 'GABEZIA' },
  { id: '14', topText: 'FALTA', bottomText: 'BIDE BATEZ' },
  { id: '15', topText: 'BIDENABAR', bottomText: 'BALIATU' },
  { id: '16', topText: 'ERABILI', bottomText: 'MURRIZTU' },
  { id: '17', topText: 'ESKASTU', bottomText: 'ABIARAZI' },
  { id: '18', topText: 'MARTXAN JARRI', bottomText: 'HARREZKERO' },
  { id: '19', topText: 'GEROZTIK', bottomText: 'HORRELA' },
  { id: '20', topText: 'HARTARA', bottomText: 'BEREZ' },
  { id: '21', topText: 'IZATEZ', bottomText: 'HORREGATIK' },
  { id: '22', topText: 'HORI DELA ETA', bottomText: 'EZEZTATU' },
  { id: '23', topText: 'UKATU', bottomText: 'IZENPETU' },
  { id: '24', topText: 'SINATU', bottomText: 'SUSTATU' },
].map(item => ({ ...item, underlineLastA: item.topText.endsWith('A') }));

const SYNONYMS: Record<string, string> = {
  // SET 1
  'BULTZATU': 'ZUZENDU',
  'ARTEZTU': 'TREBATU',
  'PRESTATU': 'AHULDU',
  'MAKALDU': 'JASAN',
  'NOZITU': 'ERRAZTU',
  'SAMURTU': 'EZKUTATU',
  'GORDE': 'GAITZETSI',
  'MESPRETXATU': 'ESKABIDE',
  'ESKAERA': 'HORTAZ',
  'BERAZ': 'BESTELA',
  'OSTERANTZEAN': 'ADIBIDEZ',
  'ESATERAKO': 'ONURA',
  'PROBETXU': 'GABEZIA',
  'FALTA': 'BIDE BATEZ',
  'BIDENABAR': 'BALIATU',
  'ERABILI': 'MURRIZTU',
  'ESKASTU': 'ABIARAZI',
  'MARTXAN JARRI': 'HARREZKERO',
  'GEROZTIK': 'HORRELA',
  'HARTARA': 'BEREZ',
  'IZATEZ': 'HORREGATIK',
  'HORI DELA ETA': 'EZEZTATU',
  'UKATU': 'IZENPETU',
  'SINATU': 'SUSTATU',
  // SET 2
  'BEHINTZAT': 'ANTZA',
  'ITXURAZ': 'INGURATU',
  'GERTURATU': 'GAINERA',
  'HALABER': 'OSTERA',
  'ALDIZ': 'JAKINA',
  'PREFOSTA': 'KEINU',
  'IMINTZIO': 'LEHIA',
  'NORGEHIAGOKA': 'ERRONKA',
  'APUSTU': 'ARDURA',
  'ERANTZUKIZUN': 'BERRITSU',
  'HITZONTZI': 'ADIMENTSU',
  'BURUTSU': 'AGORTU',
  'AMAITU': 'MOTELDU',
  'GELDOTU': 'AREAGOTU',
  'HANDITU': 'OZTOPATU',
  'ERAGOTZI': 'BURUTAZIO',
  'ATERALDI': 'HUTSUNE',
  'ZEHATZ-MEHATZ': 'BERRITU',
  'BERRIZTATU': 'MENDERATU',
  'MENPERATU': 'ERAGOZPEN',
  'TRABA': 'BERMATU',
  'ZIURTATU': 'ORDUAN',
  'BAT-BATEAN': 'BEDEREN',
  // SET 3
  'BITARTEKO': 'GALARAZI',
  'DEBEKATU': 'ETORKIZUN',
  'GERO(ALDI)': 'ERALDATU',
  'ALDATU': 'HUTSAL',
  'BALIOGABE': 'OSASUNGARRI',
  'OSASUNTSU': 'URRATU',
  'ZAURITU': 'GEHIEGIZKO',
  'LARREGIZKO': 'FUNTSEZKO',
  'OINARRIZKO': 'EZOHIKO',
  'ARRARO': 'DOAKO',
  'DEBALDEKO': 'AZALEKO',
  'FUNSGABE': 'DUDAZKO',
  'ZALANTZAZKO': 'ORDEZKATU',
  'ORDEZTU': 'KORAPILATU',
  'NAHASPILATU': 'GAUZATU',
  'BURUTU': 'IZENDATU',
  'HAUTATU': 'EKIMEN',
  'EKINALDI': 'OROIMEN',
  'MEMORIA': 'AHALMEN',
  'GAITASUN': 'SUSTATU',
  'EKIDIN': 'BAZTERTU',
  'ZOKORATU': 'BURUTAPEN',
  // SET 4
  'XAHUTU': 'AGORTU',
  'BUKATU': 'ERRAZTU',
  'DENA DEN': 'HAU DA',
  'HOTS': 'ARRISKU',
  'PERIL': 'MIAKETA',
  'ARAKETA': 'TRIKIMAILU',
  'AZPIKERIA': 'JARDUERA',
  'EKINTZA': 'OINARRI',
  'FUNTS': 'IKUR',
  'SINBOLO': 'BALIOGABETU',
  'INDARGABETU': 'PRESTAKUNTZA',
  'TREBAKUNTZA': 'ALDAKUNTZA',
  'ALDAKETA': 'ERRAKUNTZA',
  'HUTSEGITE': 'GORABEHERATSU',
  'DESOREKATU': 'GATAZKATSU',
  'ARAZOTSU': 'ESANGURATSU',
  'DEIGARRI': 'BEREZ',
  'BEHARBADA': 'HALABER',
  'ERA BEREAN': 'ESTUTU',
  'LARRITU': 'ANIMATU',
  'ADORETU': 'GOGAITU',
  'ASPERTU': 'GASTATU',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  const [items, setItems] = useState<GridItem[]>(INITIAL_ITEMS);
  const [columns, setColumns] = useState(4);
  const [fontSize, setFontSize] = useState(24);
  const [isBold, setIsBold] = useState(true);
  const [isUnderlined, setIsUnderlined] = useState(false);
  const [showLogo, setShowLogo] = useState(true);
  const [logoSizeMultiplier, setLogoSizeMultiplier] = useState(2.1);

  // Back side state
  const [backText1, setBackText1] = useState('IVAP 2. HE 2022-11-05');
  const [backText2, setBackText2] = useState('SINONIMO');
  const [backText3, setBackText3] = useState('DOMINOA 1');
  const [backFontSize, setBackFontSize] = useState(15);

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Euskaraz-Grid',
  });

  const exportPDF = async () => {
    try {
      if (!componentRef.current) return;

      const previousTab = activeTab;

      const waitForPaint = () =>
        new Promise<void>((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve())));

      const captureTabToCanvas = async (tab: 'front' | 'back') => {
        setActiveTab(tab);
        await waitForPaint();
        if (!componentRef.current) throw new Error('Missing export ref');

        return await toCanvas(componentRef.current, {
          backgroundColor: '#ffffff',
          cacheBust: true,
          pixelRatio: 2,
        });
      };

      const frontCanvas = await captureTabToCanvas('front');
      const backCanvas = await captureTabToCanvas('back');
      setActiveTab(previousTab);

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const addCanvasAsPage = (canvas: HTMLCanvasElement, isFirstPage: boolean) => {
        const imgData = canvas.toDataURL('image/png');
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const ratio = Math.min(pageW / imgProps.width, pageH / imgProps.height);
        const renderW = imgProps.width * ratio;
        const renderH = imgProps.height * ratio;
        const x = (pageW - renderW) / 2;
        const y = (pageH - renderH) / 2;

        if (!isFirstPage) pdf.addPage();
        pdf.addImage(imgData, 'PNG', x, y, renderW, renderH, undefined, 'FAST');
      };

      addCanvasAsPage(frontCanvas, true);
      addCanvasAsPage(backCanvas, false);
      pdf.save('euskaraz-anverso-reverso.pdf');
    } catch (error) {
      console.error('Error al exportar PDF:', error);
    }
  };

  const addItem = () => {
    const newId = (Math.max(0, ...items.map(i => parseInt(i.id))) + 1).toString();
    setItems([...items, { id: newId, topText: 'BERRIA', bottomText: 'ZUZENDU' }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const updateItem = (id: string, field: keyof GridItem, value: any) => {
    setItems(items.map(i => {
      if (i.id === id) {
        const updatedItem = { ...i, [field]: value };
        
        // Automatic synonym mapping when topText changes
        if (field === 'topText') {
          const upperText = value.toUpperCase().trim();
          if (SYNONYMS[upperText]) {
            updatedItem.bottomText = SYNONYMS[upperText];
          }
          // Also update underlineLastA if it's the topText
          updatedItem.underlineLastA = upperText.endsWith('A');
        }
        
        return updatedItem;
      }
      return i;
    }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-4 md:p-8 font-sans text-slate-900">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Euskarazko Sare Sortzailea</h1>
            <p className="text-slate-500">Sortu eta pertsonalizatu zure hiztegi-orriak.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => handlePrint()} className="gap-2">
              <Printer className="h-4 w-4" />
              Inprimatu
            </Button>
            <Button variant="outline" onClick={exportPDF} className="gap-2 border-blue-200 text-blue-700 hover:bg-blue-50">
              <FileDown className="h-4 w-4" />
              Esportatu PDFa
            </Button>
            <Button onClick={addItem} className="gap-2 bg-[#1D3A8A] hover:bg-[#1e3a8a]/90">
              <Plus className="h-4 w-4" />
              Gehitu Hitza
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Controls */}
          <aside className="lg:col-span-4 space-y-6">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings2 className="h-5 w-5 text-slate-500" />
                    Konfigurazioa
                  </CardTitle>
                </div>
                <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="front">Aurrealdea</TabsTrigger>
                    <TabsTrigger value="back">Atzealdea</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="space-y-6">
                {activeTab === 'front' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-logo" className="font-medium">Logo Modua (2. Irudia)</Label>
                      <Switch 
                        id="show-logo" 
                        checked={showLogo} 
                        onCheckedChange={setShowLogo} 
                      />
                    </div>
                  
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2">
                          <LayoutGrid className="h-4 w-4" />
                          Zutabeak
                        </Label>
                        <Input 
                          type="number" 
                          value={columns ?? 1} 
                          onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
                          className="w-16 h-8 text-right font-mono"
                          min={1}
                          max={12}
                        />
                      </div>
                      <Slider 
                        value={[columns ?? 1]} 
                        min={1} 
                        max={8} 
                        step={1} 
                        onValueChange={(val) => setColumns(val[0] ?? 1)} 
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="flex items-center gap-2">
                          <Type className="h-4 w-4" />
                          Letra-tamaina
                        </Label>
                        <Input 
                          type="number" 
                          value={fontSize ?? 12} 
                          onChange={(e) => setFontSize(parseInt(e.target.value) || 12)}
                          className="w-16 h-8 text-right font-mono"
                          min={8}
                          max={120}
                        />
                      </div>
                      <Slider 
                        value={[fontSize ?? 12]} 
                        min={12} 
                        max={120} 
                        step={1} 
                        onValueChange={(val) => setFontSize(val[0] ?? 12)} 
                      />
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <Switch 
                          id="bold" 
                          checked={isBold} 
                          onCheckedChange={setIsBold} 
                        />
                        <Label htmlFor="bold">Lodia</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch 
                          id="underline" 
                          checked={isUnderlined} 
                          onCheckedChange={setIsUnderlined} 
                        />
                        <Label htmlFor="underline">Azpimarratua</Label>
                      </div>
                    </div>

                    {showLogo && (
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                          <Label className="flex items-center gap-2">
                            Logoaren tamaina
                          </Label>
                          <Input 
                            type="number" 
                            value={logoSizeMultiplier ?? 1} 
                            onChange={(e) => setLogoSizeMultiplier(parseFloat(e.target.value) || 1)}
                            className="w-16 h-8 text-right font-mono"
                            step={0.1}
                            min={0.5}
                            max={10}
                          />
                        </div>
                        <Slider 
                          value={[logoSizeMultiplier ?? 1]} 
                          min={1} 
                          max={5} 
                          step={0.1} 
                          onValueChange={(val) => setLogoSizeMultiplier(val[0] ?? 1)} 
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="space-y-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">Atzealdeko Testua</h3>
                      
                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">1. Lerroa</Label>
                          <Input value={backText1} onChange={(e) => setBackText1(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">2. Lerroa</Label>
                          <Input value={backText2} onChange={(e) => setBackText2(e.target.value)} />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] uppercase font-bold text-slate-400">3. Lerroa</Label>
                          <Input value={backText3} onChange={(e) => setBackText3(e.target.value)} />
                        </div>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-bold uppercase text-slate-500">Atzealdeko Letra-tamaina</Label>
                          <Input 
                            type="number" 
                            value={backFontSize} 
                            onChange={(e) => setBackFontSize(parseInt(e.target.value) || 12)}
                            className="w-16 h-8 text-right font-mono"
                          />
                        </div>
                        <Slider 
                          value={[backFontSize]} 
                          min={12} 
                          max={60} 
                          step={1} 
                          onValueChange={(val) => setBackFontSize(val[0])} 
                        />
                      </div>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-blue-700 text-sm">
                      <p className="font-medium mb-1">Oharra:</p>
                      <p>Atzealdea automatikoki sortuko da aurrealdeko gelaxka eta zutabe kopuru berdinarekin, alde bietatik inprimatzean bat etor daitezen.</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {activeTab === 'front' && (
              <Card className="border-slate-200 shadow-sm overflow-hidden">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Edukiaren Editorea</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px] px-6 pb-6">
                    <div className="space-y-4">
                      <AnimatePresence initial={false}>
                        {items.map((item) => (
                          <motion.div 
                            key={item.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="group relative flex flex-col gap-2 p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-slate-200 transition-all"
                          >
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <Input 
                                  value={item.topText ?? ''} 
                                  onChange={(e) => updateItem(item.id, 'topText', e.target.value)}
                                  placeholder="Goiko testua"
                                  className="h-8 text-sm"
                                />
                                {showLogo && (
                                  <Input 
                                    value={item.bottomText ?? ''} 
                                    onChange={(e) => updateItem(item.id, 'bottomText', e.target.value)}
                                    placeholder="Beheko testua"
                                    className="h-8 text-sm"
                                  />
                                )}
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeItem(item.id)}
                                  className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-2 flex-1">
                                  <span className="text-[10px] uppercase font-bold text-slate-400 w-12">Goiko tamaina</span>
                                  <Slider 
                                    value={[item.topFontSize || fontSize]} 
                                    min={8} 
                                    max={120} 
                                    step={1} 
                                    onValueChange={(val) => updateItem(item.id, 'topFontSize', val[0])}
                                    className="flex-1"
                                  />
                                  <Input 
                                    type="number" 
                                    value={item.topFontSize || fontSize} 
                                    onChange={(e) => updateItem(item.id, 'topFontSize', parseInt(e.target.value) || fontSize)}
                                    className="w-12 h-6 text-[10px] p-1 text-right font-mono"
                                  />
                                </div>
                                
                                {showLogo && (
                                  <div className="flex items-center gap-2 flex-1">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 w-12">Beheko tamaina</span>
                                    <Slider 
                                      value={[item.bottomFontSize || fontSize]} 
                                      min={8} 
                                      max={120} 
                                      step={1} 
                                      onValueChange={(val) => updateItem(item.id, 'bottomFontSize', val[0])}
                                      className="flex-1"
                                    />
                                    <Input 
                                      type="number" 
                                      value={item.bottomFontSize || fontSize} 
                                      onChange={(e) => updateItem(item.id, 'bottomFontSize', parseInt(e.target.value) || fontSize)}
                                      className="w-12 h-6 text-[10px] p-1 text-right font-mono"
                                    />
                                  </div>
                                )}

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Switch 
                                      id={`underline-a-${item.id}`}
                                      checked={item.underlineLastA ?? false}
                                      onCheckedChange={(val) => updateItem(item.id, 'underlineLastA', val)}
                                    />
                                    <Label htmlFor={`underline-a-${item.id}`} className="text-[10px] uppercase font-bold text-slate-400">Azken <u>A</u></Label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </aside>

          {/* Preview Area */}
          <main className="lg:col-span-8">
            <div className="sticky top-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Aurrebista</h2>
                <div className="text-xs text-slate-400">A4 Bertikala</div>
              </div>
              
              <div className="bg-white shadow-2xl rounded-sm overflow-hidden border border-slate-200">
                <div 
                  ref={componentRef}
                  className="p-8 bg-white print:p-0"
                  style={{ minHeight: '297mm' }}
                >
                  <div 
                    className="grid w-full border-t-8 border-l-8 border-black"
                    style={{ 
                      gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                    }}
                  >
                    {activeTab === 'front' ? (
                      items.map((item) => (
                        <GridCard 
                          key={item.id}
                          topText={item.topText}
                          bottomText={item.bottomText}
                          showLogo={showLogo}
                          isBold={isBold}
                          isUnderlined={isUnderlined}
                          underlineLastA={item.underlineLastA}
                          topFontSize={item.topFontSize ?? fontSize}
                          bottomFontSize={item.bottomFontSize ?? fontSize}
                          logoSize={fontSize * logoSizeMultiplier}
                          className="border-r-8 border-b-8 border-black"
                        />
                      ))
                    ) : (
                      items.map((item) => (
                        <BackCard 
                          key={`back-${item.id}`}
                          text1={backText1}
                          text2={backText2}
                          text3={backText3}
                          fontSize={backFontSize}
                          className="border-r-8 border-b-8 border-black"
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
