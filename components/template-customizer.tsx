import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Template } from '@/lib/types';
import { Paintbrush2Icon, RotateCcwIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import templates, { TemplateKey } from '@/templates';
import { useDebounce } from '@/hooks/use-debounce';

interface TemplateCustomizerProps {
	templateKey: string;
	customization?: Template;
	onCustomizationChange: (customization: Template) => void;
}

export function TemplateCustomizer({ templateKey, customization, onCustomizationChange }: TemplateCustomizerProps) {
	// Get default colors from the selected template
	const getTemplateDefaultColors = () => {
		const template = templates[templateKey as TemplateKey];
		return {
			foreground: template?.defaultColors?.foreground,
			background: template?.defaultColors?.background,
			foregroundMuted: template?.defaultColors?.foregroundMuted,
			backgroundMuted: template?.defaultColors?.backgroundMuted,
		};
	};

	// Initialize with current customization or template defaults
	const [colors, setColors] = useState(() => {
		if (customization?.colors) {
			return customization.colors;
		}
		return getTemplateDefaultColors();
	});

	const [fonts, setFonts] = useState({
		regular: customization?.font?.regular || 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-Medium.ttf',
		bold: customization?.font?.bold || 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-SemiBold.ttf',
	});

	// Add debounced colors
	const debouncedColors = useDebounce(colors, 500);

	// Single effect to handle template changes
	useEffect(() => {
		if (!customization?.colors || customization.templateKey !== templateKey) {
			const defaultColors = getTemplateDefaultColors();
			setColors(defaultColors);
		}
	}, [templateKey, customization?.templateKey]);

	// Update customization when debounced colors change
	useEffect(() => {
		if (customization?.templateKey === templateKey) {
			onCustomizationChange({
				templateKey,
				colors: debouncedColors,
				font: fonts,
			});
		}
	}, [debouncedColors]);

	// Modify color change handler to only update local state
	const handleColorChange = (key: keyof typeof colors, value: string) => {
		const newColors = { ...colors, [key]: value };
		setColors(newColors);
	};

	const handleFontChange = (key: keyof typeof fonts, value: string) => {
		const newFonts = { ...fonts, [key]: value };
		setFonts(newFonts);

		onCustomizationChange({
			templateKey,
			colors,
			font: newFonts,
		});
	};

	const handleResetColors = () => {
		const defaultColors = getTemplateDefaultColors();
		setColors(defaultColors);
		onCustomizationChange({
			templateKey,
			colors: defaultColors,
			font: fonts,
		});
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant='outline' size='sm' className='ml-auto'>
					<Paintbrush2Icon className='mr-2 h-4 w-4' />
					Customize Template
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-80'>
				<div className='space-y-4'>
					<h4 className='font-medium leading-none'>Template Customization</h4>
					<p className='text-sm text-muted-foreground'>Customize colors and fonts for your invoice template.</p>

					<Tabs defaultValue='colors'>
						<TabsList className='grid w-full grid-cols-2'>
							<TabsTrigger value='colors'>Colors</TabsTrigger>
							<TabsTrigger value='fonts'>Fonts</TabsTrigger>
						</TabsList>

						<TabsContent value='colors' className='space-y-4'>
							<div className='space-y-2'>
								<div className='flex items-center justify-between'>
									<Label htmlFor='primary-color'>Main text color</Label>
									<div className='flex items-center gap-2'>
										<span className='text-xs text-muted-foreground'>{colors.foreground}</span>
										<div
											className='h-8 w-8 cursor-pointer rounded-md border shadow-sm'
											style={{ backgroundColor: colors.foreground }}
											onClick={() => document.getElementById('primary-color')?.click()}
										/>
										<Input id='primary-color' type='color' value={colors.foreground} onChange={(e) => handleColorChange('foreground', e.target.value)} className='sr-only' />
									</div>
								</div>
							</div>

							<div className='space-y-2'>
								<div className='flex items-center justify-between'>
									<Label htmlFor='background-color'>Main background color</Label>
									<div className='flex items-center gap-2'>
										<span className='text-xs text-muted-foreground'>{colors.background}</span>
										<div
											className='h-8 w-8 cursor-pointer rounded-md border shadow-sm'
											style={{ backgroundColor: colors.background }}
											onClick={() => document.getElementById('background-color')?.click()}
										/>
										<Input id='background-color' type='color' value={colors.background} onChange={(e) => handleColorChange('background', e.target.value)} className='sr-only' />
									</div>
								</div>
							</div>

							<div className='space-y-2'>
								<div className='flex items-center justify-between'>
									<Label htmlFor='text-color'>Secondary text color</Label>
									<div className='flex items-center gap-2'>
										<span className='text-xs text-muted-foreground'>{colors.foregroundMuted}</span>
										<div
											className='h-8 w-8 cursor-pointer rounded-md border shadow-sm'
											style={{ backgroundColor: colors.foregroundMuted }}
											onClick={() => document.getElementById('text-color')?.click()}
										/>
										<Input id='text-color' type='color' value={colors.foregroundMuted} onChange={(e) => handleColorChange('foregroundMuted', e.target.value)} className='sr-only' />
									</div>
								</div>
							</div>

							<div className='space-y-2'>
								<div className='flex items-center justify-between'>
									<Label htmlFor='background-muted-color'>Header background color</Label>
									<div className='flex items-center gap-2'>
										<span className='text-xs text-muted-foreground'>{colors.backgroundMuted}</span>
										<div
											className='h-8 w-8 cursor-pointer rounded-md border shadow-sm'
											style={{ backgroundColor: colors.backgroundMuted }}
											onClick={() => document.getElementById('background-muted-color')?.click()}
										/>
										<Input
											id='background-muted-color'
											type='color'
											value={colors.backgroundMuted}
											onChange={(e) => handleColorChange('backgroundMuted', e.target.value)}
											className='sr-only'
										/>
									</div>
								</div>
							</div>

							<div className='flex items-center justify-end'>
								<Button variant='outline' size='sm' onClick={handleResetColors} className='h-8 px-2 text-muted-foreground hover:text-foreground'>
									<RotateCcwIcon className='mr-1 h-4 w-4' />
									Reset Colors
								</Button>
							</div>
						</TabsContent>

						<TabsContent value='fonts' className='space-y-4'>
							<div className='space-y-2'>
								<Label htmlFor='regular-font'>Regular Font URL</Label>
								<Input id='regular-font' type='text' value={fonts.regular} onChange={(e) => handleFontChange('regular', e.target.value)} />
								<p className='text-xs text-muted-foreground'>URL to a TTF or OTF font file for regular text</p>
							</div>

							<div className='space-y-2'>
								<Label htmlFor='bold-font'>Bold Font URL</Label>
								<Input id='bold-font' type='text' value={fonts.bold} onChange={(e) => handleFontChange('bold', e.target.value)} />
								<p className='text-xs text-muted-foreground'>URL to a TTF or OTF font file for bold text</p>
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</PopoverContent>
		</Popover>
	);
}
