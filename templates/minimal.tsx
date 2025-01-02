/* eslint-disable jsx-a11y/alt-text */
import { InvoiceData } from '@/lib/types';
import { Page, View, Text, Font, Image } from '@react-pdf/renderer';

// JSX View
export const MinimalTemplate = ({
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
		<div style={{ padding: '12pt', backgroundColor: 'white', lineHeight: '1', fontSize: '12pt', fontFamily: 'Inter' }}>
			<div style={{ backgroundColor: 'whitesmoke', color: 'black', padding: '8pt', display: 'flex', flexDirection: 'row' }}>
				<img src={company.logo || '/logo-mono.svg'} alt='hyperbooks Logo' style={{ width: '128pt', height: '128pt' }} onClick={() => document.getElementById('logoInput')?.click()} />
				<input
					id='logoInput'
					type='file'
					accept='image/*'
					style={{ display: 'none' }}
					onChange={onImageEdit('company.logo')} // Use the universal handler
				/>
				<div style={{ marginLeft: '8pt' }}>
					<input
						style={{ fontSize: '20pt', color: 'black', background: 'transparent', border: 'none', width: '100%' }}
						value={company.name}
						onChange={(e) => onEdit('company.name', e.target.value)}
					/>
					{company.address.map((line, index) => (
						<input
							key={index}
							style={{ color: 'black', background: 'transparent', border: 'none', width: '100%', fontSize: '12pt', padding: '0pt' }}
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
export const renderMinimalTemplate = (data: InvoiceData) => {
	const { company } = data;

	Font.register({
		family: 'Inter',
		src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-Medium.ttf',
	});
	return (
		<Page size='A4' style={{ padding: '12pt', fontSize: '12pt', fontFamily: 'Inter' }}>
			<View style={{ backgroundColor: 'whitesmoke', color: 'black', padding: '8pt', display: 'flex', flexDirection: 'row' }}>
				<View style={{ backgroundColor: 'red', width: '128pt', height: '128pt', display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
					<Image src={'/logo-mono.svg'} style={{ width: '128pt', height: '128pt' }} />
				</View>
				<View style={{ marginLeft: '8pt' }}>
					<Text style={{ fontSize: 20 }}>{company.name}</Text>
					{company.address.map((line, index) => (
						<Text style={{ fontSize: 12 }} key={index}>
							{line}
						</Text>
					))}
				</View>
			</View>
			<View style={{ marginTop: 16 }}></View>
		</Page>
	);
};
