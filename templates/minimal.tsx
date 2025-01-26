/* eslint-disable jsx-a11y/alt-text */
import { Button } from '@/components/ui/button';
import { InvoiceData, placeholders } from '@/lib/types';
import { Page, View, Text, Font, Image, StyleSheet } from '@react-pdf/renderer';
import { PlusCircleIcon } from 'lucide-react';

const styles = StyleSheet.create({
	page: {
		padding: '16pt',
		backgroundColor: '#ffffff',
		color: '#252525',
		lineHeight: '1',
		fontSize: '12pt',
		fontFamily: 'Inter',
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'flex-start',
		alignItems: 'center',
	},
	header: {
		backgroundColor: 'whitesmoke',
		color: 'black',
		padding: '16pt',
		display: 'flex',
		flexDirection: 'row',
		borderRadius: '12pt',
		width: '100%',
	},
	logo: {
		width: '96pt',
		height: '96pt',
		borderRadius: '8pt',
	},
	company: {
		marginLeft: '16pt',
		display: 'flex',
		flexDirection: 'column',
		gap: '2pt',
		backgroundColor: 'transparent',
	},
	name: {
		fontSize: '20pt',
		fontWeight: 'bold',
		backgroundColor: 'transparent',
	},
	address: {
		fontSize: '12pt',
		backgroundColor: 'transparent',
	},
	items: {
		marginTop: '32pt',
		marginBottom: '16pt',
		width: '100%',
		height: '100%',
	},
	theading: {
		fontSize: '10pt',
		letterSpacing: '1pt',
		color: '#afafaf',
		textAlign: 'center',
		backgroundColor: 'transparent',
		fontWeight: 'bold',
	},
	tbody: {
		marginTop: '16pt',
	},
	trow: {
		fontSize: '12pt',
		lineHeight: '24pt',
		textAlign: 'left',
		backgroundColor: 'transparent',
	},
	headdesc: {
		width: '50%',
		textAlign: 'left',
	},
	headqty: {
		width: '10%',
		textAlign: 'center',
	},
	headunit: {
		width: '20%',
		textAlign: 'right',
	},
	headtotal: {
		width: '20%',
		textAlign: 'right',
	},
	itemdesc: {
		width: '50%',
		textAlign: 'left',
	},
	itemqty: {
		width: '10%',
		textAlign: 'center',
	},
	itemunit: {
		width: '20%',
		textAlign: 'right',
	},
	itemtotal: {
		width: '20%',
		textAlign: 'right',
	},
	addbutton: {
		marginTop: '16pt',
		marginBottom: '16pt',
		backgroundColor: '#252525',
		color: '#ffffff',
		fontSize: '10pt',
	},
	footer: {
		backgroundColor: 'whitesmoke',
		color: '#afafaf',
		fontSize: '10pt',
		padding: '8pt',
		borderRadius: '4pt',
		width: '100%',
		textAlign: 'center',
	},
});

export const MinimalTemplate = ({
	data,
	onEdit,
	onArrayEdit,
	onImageEdit,
}: {
	data: InvoiceData;
	onEdit: (field: keyof InvoiceData | string, value: any) => void;
	onArrayEdit: (path: string, index: number, value: any, field?: string) => void;
	onImageEdit: (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
	const { company, items } = data;

	return (
		<div className='editor-light' style={{ ...styles.page, width: '595pt', height: '842pt', borderStyle: 'dashed', borderWidth: '1pt', borderColor: '#afafaf', borderRadius: '12pt' }}>
			{/* Header */}
			<div style={styles.header}>
				<img src={company.logo} className='editable' alt='hyperbooks Logo' style={styles.logo} onClick={() => document.getElementById('logoInput')?.click()} />
				<input className='editable' id='logoInput' type='file' accept='image/png, image/jpeg' style={{ display: 'none' }} onChange={onImageEdit('company.logo')} />
				<div style={styles.company}>
					<input className='editable' style={styles.name} value={company.name} placeholder={placeholders.company.name} onChange={(e) => onEdit('company.name', e.target.value)} />
					{company.address.map((line, index) => (
						<input
							className='editable'
							key={index}
							style={styles.address}
							value={line ?? ''}
							placeholder={placeholders.company.address[index]}
							onChange={(e) => onArrayEdit('company.address', index, e.target.value)}
						/>
					))}
				</div>
			</div>

			{/* Items Table */}
			<div className='items' style={styles.items}>
				<table style={{ width: '100%', tableLayout: 'fixed' }}>
					<thead style={styles.theading}>
						<tr>
							<th style={styles.headdesc}>DESCRIPTION</th>
							<th style={styles.headqty}>QTY</th>
							<th style={styles.headunit}>UNIT PRICE</th>
							<th style={styles.headtotal}>TOTAL</th>
						</tr>
					</thead>
					<tbody style={styles.tbody}>
						{items.map((item, index) => (
							<tr key={index} style={styles.trow}>
								<td style={styles.itemdesc}>
									<input
										style={{ width: '100%' }}
										className='editable'
										value={item.description ?? ''}
										placeholder={placeholders.item.description}
										onChange={(e) => onArrayEdit('items', index, e.target.value, 'description')}
									/>
								</td>
								<td style={styles.itemqty}>
									<input
										style={{ width: '100%', textAlign: 'center' }}
										type='number'
										pattern='[0-9]*'
										inputMode='numeric'
										className='editable'
										value={item.quantity ?? ''}
										placeholder={placeholders.item.quantity}
										onChange={(e) => onArrayEdit('items', index, e.target.value ? +e.target.value : undefined, 'quantity')}
									/>
								</td>
								<td style={styles.itemunit}>
									<input
										style={{ width: '100%', textAlign: 'right' }}
										type='number'
										step='.01'
										pattern='[0-9]*'
										inputMode='numeric'
										className='editable'
										value={item.amount ?? ''}
										placeholder={placeholders.item.amount}
										onChange={(e) => onArrayEdit('items', index, e.target.value ? +e.target.value : undefined, 'amount')}
									/>
								</td>
								<td style={styles.itemtotal}>{item.quantity && item.amount ? (item.quantity * item.amount).toFixed(2) : ''}</td>
							</tr>
						))}
					</tbody>
				</table>
				<Button style={styles.addbutton} className='shadow-md hover:shadow-xl' onClick={() => onArrayEdit('items', -1, { description: '', quantity: 0, amount: 0 })}>
					<PlusCircleIcon />
					Add Item
				</Button>
			</div>

			{/* Footer */}
			<div style={styles.footer}>
				<p>Invoice generated by hyperbooks.</p>
			</div>
		</div>
	);
};

// PDF View
export const renderMinimalTemplate = (data: InvoiceData) => {
	const { company, items } = data;

	Font.register({
		family: 'Inter',
		fonts: [
			{
				src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-Medium.ttf',
			},
			{
				src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-Bold.ttf',
				fontWeight: 'bold',
			},
		],
	});
	return (
		<Page size='A4' style={styles.page}>
			<View style={styles.header}>
				<Image src={company.logo} style={styles.logo} />
				<View style={styles.company}>
					<Text style={styles.name}>{company.name}</Text>
					{company.address.map((line, index) => (
						<Text style={styles.address} key={index}>
							{line}
						</Text>
					))}
				</View>
			</View>

			{/* Items Table Equivalent */}
			<View style={styles.items}>
				{/* Table Header */}
				<View style={{ ...styles.theading, flexDirection: 'row', width: '100%' }}>
					<Text style={{ ...styles.headdesc, flex: 5 }}>DESCRIPTION</Text>
					<Text style={{ ...styles.headqty, flex: 1 }}>QTY</Text>
					<Text style={{ ...styles.headunit, flex: 2 }}>UNIT PRICE</Text>
					<Text style={{ ...styles.headtotal, flex: 2 }}>TOTAL</Text>
				</View>

				{/* Table Body */}
				<View style={styles.tbody}>
					{items.map((item, index) => (
						<View key={index} style={{ ...styles.trow, flexDirection: 'row', width: '100%' }}>
							<Text style={{ ...styles.itemdesc, flex: 5 }}>{item.description}</Text>
							<Text style={{ ...styles.itemqty, flex: 1, textAlign: 'right' }}>{item.quantity}</Text>
							<Text style={{ ...styles.itemunit, flex: 2, textAlign: 'right' }}>{item.amount}</Text>
							<Text style={{ ...styles.itemtotal, flex: 2, textAlign: 'right' }}>{item.quantity && item.amount ? item.quantity * item.amount : ''}</Text>
						</View>
					))}
				</View>
			</View>

			{/* Footer */}
			<View style={styles.footer} fixed>
				<Text>Invoice generated by hyperbooks.</Text>
			</View>
		</Page>
	);
};
