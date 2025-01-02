/* eslint-disable jsx-a11y/alt-text */
import { InvoiceData } from '@/lib/types';
import { Page, View, Text, Font, Image } from '@react-pdf/renderer';

// JSX View
export const ClassicTemplate = ({
	data,
	onEdit,
	onArrayEdit,
	onImageEdit,
}: {
	data: InvoiceData;
	onEdit: (field: any, value: any) => void;
	onArrayEdit: (field: any, index: any, value: any) => void;
	onImageEdit: (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	const { company } = data;
	return (
		<div style={{ padding: '12pt', backgroundColor: 'white' }}>
			<div style={{ backgroundColor: 'midnightblue', color: 'white', padding: '8pt' }}>
				<div style={{ backgroundColor: 'transparent', width: '64pt', height: '64pt', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<img src={company.logo || '/logo-mono.svg'} alt='hyperbooks Logo' style={{ width: '48pt', height: '48pt' }} onClick={() => document.getElementById('logoInput')?.click()} />
					<input
						id='logoInput'
						type='file'
						accept='image/*'
						style={{ display: 'none' }}
						onChange={onImageEdit('company.logo')} // Use the universal handler
					/>
				</div>
				<div>
					<input
						style={{ fontSize: '20pt', color: 'white', background: 'transparent', border: 'none', width: '100%' }}
						value={company.name}
						onChange={(e) => onEdit('company.name', e.target.value)}
					/>
					{company.address.map((line, index) => (
						<input
							key={index}
							style={{ color: 'white', background: 'transparent', border: 'none', width: '100%' }}
							value={line}
							onChange={(e) => onArrayEdit('company.address', index, e.target.value)}
						/>
					))}
				</div>
			</div>
			<div style={{ marginTop: '16pt' }}></div>
		</div>
	);
};

// PDF View
export const renderClassicTemplate = (data: InvoiceData) => {
	const { company } = data;

	Font.register({
		family: 'Inter',
		src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-Medium.ttf',
	});
	return (
		<Page size='A4' style={{ padding: 12 }}>
			<View style={{ backgroundColor: 'midnightblue', color: 'white', padding: 8, display: 'flex', flexDirection: 'row' }}>
				<View style={{ backgroundColor: 'transparent', width: '64pt', height: '64pt', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					<Image src={company.logo || '/logo-mono.svg'} style={{ width: '48pt', height: '48pt' }} />
				</View>

				<View style={{ marginLeft: 8 }}>
					<Text style={{ fontSize: '20pt' }}>{company.name}</Text>
					{company.address.map((line, index) => (
						<Text style={{ fontSize: '12pt' }} key={index}>
							{line}
						</Text>
					))}
				</View>
			</View>
			<View style={{ marginTop: 16 }}></View>
		</Page>
	);
};
