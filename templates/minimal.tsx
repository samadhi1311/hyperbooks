/* eslint-disable jsx-a11y/alt-text */
import { Button } from '@/components/ui/button';
import { InvoiceData, placeholders, ProfileData } from '@/lib/types';
import { Page, View, Text, Font, Image, StyleSheet, Svg, Line } from '@react-pdf/renderer';
import { PlusCircleIcon, XCircleIcon } from 'lucide-react';

const styles = StyleSheet.create({
	page: {
		position: 'relative',
		padding: '16pt',
		backgroundColor: '#ffffff',
		color: '#252525',
		lineHeight: '1',
		fontSize: '12pt',
		fontFamily: 'Inter',
	},
	header: {
		backgroundColor: 'whitesmoke',
		color: 'black',
		padding: '16pt',
		display: 'flex',
		flexDirection: 'column',
		borderRadius: '12pt',
		width: '100%',
	},
	headerRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'flex-start',
		alignItems: 'center',
		width: '100%',
		gap: '16pt',
	},
	logo: {
		width: '96pt',
		height: '96pt',
		borderRadius: '8pt',
	},
	profile: {
		marginLeft: '16pt',
		display: 'flex',
		flexDirection: 'column',
		gap: '2pt',
		backgroundColor: 'transparent',
	},
	profileTextMain: {
		fontSize: '20pt',
		fontWeight: 'bold',
		backgroundColor: 'transparent',
	},
	profileTextSecondary: {
		fontSize: '12pt',
		backgroundColor: 'transparent',
	},
	billedTo: {
		marginTop: '16pt',
		display: 'flex',
		flexDirection: 'column',
		gap: '2pt',
		backgroundColor: 'transparent',
	},
	billedToRow: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	billedField: {
		display: 'flex',
		flexDirection: 'row',
		gap: '8pt',
		alignItems: 'center',
		justifyContent: 'flex-start',
		width: '100%',
	},
	billedTextMain: {
		fontSize: '12pt',
		fontWeight: 'bold',
		backgroundColor: 'transparent',
	},
	billedTextSecondary: {
		fontSize: '12pt',
		backgroundColor: 'transparent',
		textAlign: 'left',
	},
	icon: {
		width: '14pt',
		height: '14pt',
	},
	items: {
		marginTop: '32pt',
		marginBottom: '16pt',
		width: '100%',
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
		textAlign: 'left',
		display: 'flex',
		flexDirection: 'row',
		gap: '8pt',
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
	removebutton: {
		backgroundColor: '#ffffff',
		color: '#a65858',
		width: '26pt',
		height: '24pt',
	},
	total: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: '16pt',
		fontSize: '12pt',
		fontWeight: 'bold',
	},
	totalColumn: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'stretch',
		gap: '8pt',
	},
	totalField: {
		display: 'flex',
		flexDirection: 'row',
		gap: '32pt',
		justifyContent: 'space-between',
	},
	footer: {
		position: 'absolute',
		backgroundColor: 'whitesmoke',
		color: '#afafaf',
		fontSize: '10pt',
		padding: '8pt',
		borderRadius: '4pt',
		textAlign: 'center',
		bottom: '8pt',
		left: '8pt',
		right: '8pt',
	},
});

export const MinimalTemplate = ({
	data,
	profile,
	removeItem,
	onEdit,
	onArrayEdit,
}: {
	data: InvoiceData;
	profile: ProfileData;
	removeItem: (index: number) => void;
	onEdit: (field: keyof InvoiceData | string | keyof ProfileData, value: any) => void;
	onArrayEdit: (path: string, index: number, value: any, field?: string) => void;
}) => {
	const { billedTo, items, discount, tax, total } = data;

	return (
		<div className='editor-light' style={{ ...styles.page, width: '595pt', height: '842pt', borderStyle: 'dashed', borderWidth: '1pt', borderColor: '#afafaf', borderRadius: '12pt' }}>
			{/* Header */}
			<div style={styles.header}>
				<div style={styles.headerRow}>
					<img src={profile.logo} className='editable' alt='hyperbooks Logo' style={styles.logo} />
					<div style={styles.profile}>
						<p className='editable' style={styles.profileTextMain}>
							{profile.name ?? placeholders.company.name}
						</p>
						{profile.address?.map((line, index) => (
							<p className='editable' key={index} style={styles.profileTextSecondary}>
								{line ?? placeholders.company.address[index]}
							</p>
						))}
					</div>
				</div>

				{/* BilledTo */}
				<div style={styles.billedToRow}>
					<div style={styles.billedTo}>
						<p className='editable'>Billed to:</p>

						<input
							className='editable'
							style={styles.billedTextMain}
							value={billedTo.name}
							placeholder={placeholders.billedTo.name}
							onChange={(e) => onEdit('billedTo.name', e.target.value)}
						/>

						{billedTo.address?.map((line, index) => (
							<input
								type='text'
								className='editable'
								key={index}
								style={styles.billedTextSecondary}
								value={line ?? ''}
								placeholder={placeholders.billedTo.address[index]}
								onChange={(e) => onArrayEdit('billedTo.address', index, e.target.value)}
							/>
						))}
					</div>
					<div style={styles.billedTo}>
						<div style={styles.billedField}>
							<img src='/template-data/icons/email.png' style={styles.icon} />
							<input
								className='editable'
								type='email'
								style={styles.billedTextSecondary}
								value={billedTo.email}
								placeholder={placeholders.billedTo.email}
								onChange={(e) => onEdit('billedTo.email', e.target.value)}
							/>
						</div>
						<div style={styles.billedField}>
							<img src='/template-data/icons/phone.png' style={styles.icon} />
							<input
								className='editable'
								type='text'
								style={styles.billedTextSecondary}
								value={billedTo.phone}
								placeholder={placeholders.billedTo.phone}
								onChange={(e) => onEdit('billedTo.phone', e.target.value)}
							/>
						</div>
					</div>
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
									<Button variant='outline' size='icon' style={styles.removebutton} className='shadow-md hover:shadow-xl' onClick={() => removeItem(index)}>
										<XCircleIcon />
									</Button>
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
				<div style={styles.total}>
					<div></div>
					<div style={styles.totalColumn}>
						<div style={styles.totalField}>
							<p>Subtotal:</p>
							<p>{items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0), 0).toFixed(2)}</p>
						</div>
						<div style={styles.totalField}>
							<p>{'Tax: '}</p>
							<div className='input-wrapper'>
								<input
									className='editable'
									type='number'
									style={{ textAlign: 'right' }}
									min={0}
									step='.1'
									max={100}
									placeholder={placeholders.tax}
									value={tax}
									onChange={(e) => onEdit('tax', e.target.value)}
								/>
								<span className='suffix'>%</span>
							</div>

							<p>{items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0) * (tax / 100), 0).toFixed(2)}</p>
						</div>
						<div style={styles.totalField}>
							<p>{'Discount: '}</p>
							<div className='input-wrapper'>
								<input
									className='editable'
									type='number'
									style={{ textAlign: 'right' }}
									min={0}
									step='.1'
									max={100}
									placeholder={placeholders.discount}
									value={discount}
									onChange={(e) => onEdit('discount', e.target.value)}
								/>
								<span className='suffix'>%</span>
							</div>
							<p>{items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0) * (discount / 100), 0).toFixed(2)}</p>
						</div>
						<div>
							<hr />
						</div>
						<div style={styles.totalField}>
							<p>{'Total: '}</p>
							<p>{total.toFixed(2)}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			<div style={styles.footer}>
				<p>Invoice generated by hyperbooks.</p>
			</div>
		</div>
	);
};

// PDF View
export const renderMinimalTemplate = ({ data, profile }: { data: InvoiceData; profile: ProfileData | null }) => {
	const { billedTo, items, tax, discount, total } = data;

	Font.register({
		family: 'Inter',
		fonts: [
			{
				src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-Medium.ttf',
			},
			{
				src: 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-SemiBold.ttf',
				fontWeight: 'bold',
			},
		],
	});
	return (
		<Page size='A4' style={styles.page}>
			{/* Header */}
			<View style={styles.header}>
				<View style={styles.headerRow}>
					{profile?.logo && <Image src={profile.logo} style={styles.logo} />}
					<View style={styles.profile}>
						<Text style={styles.profileTextMain}>{profile?.name}</Text>
						{profile?.address?.map((line, index) => (
							<Text style={styles.profileTextSecondary} key={index}>
								{line}
								{index === profile.address!.length - 1 ? '' : ','}
							</Text>
						))}
					</View>
				</View>

				{/* Billed To */}
				<View style={styles.billedToRow}>
					<View style={styles.billedTo}>
						<Text style={styles.billedTextSecondary}>Billed to:</Text>
						<Text style={styles.billedTextMain}>{billedTo.name}</Text>
						{billedTo.address?.map((line, index) => (
							<Text style={styles.billedTextSecondary} key={index}>
								{line}
								{index === billedTo.address!.length - 1 ? '' : ','}
							</Text>
						))}
					</View>
					<View style={styles.billedTo}>
						<View style={styles.billedField}>
							<Image src={'/template-data/icons/email.png'} style={styles.icon} />
							<Text style={styles.billedTextSecondary}>{billedTo.email}</Text>
						</View>
						<View style={styles.billedField}>
							<Image src={'/template-data/icons/phone.png'} style={styles.icon} />
							<Text style={styles.billedTextSecondary}>{billedTo.phone}</Text>
						</View>
					</View>
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
							<Text style={{ ...styles.itemdesc, flex: 5, textAlign: 'left' }}>{item.description}</Text>
							<Text style={{ ...styles.itemqty, flex: 1, textAlign: 'center' }}>{item.quantity}</Text>
							<Text style={{ ...styles.itemunit, flex: 2, textAlign: 'right' }}>{item.amount}</Text>
							<Text style={{ ...styles.itemtotal, flex: 2, textAlign: 'right' }}>{item.quantity && item.amount ? item.quantity * item.amount : ''}</Text>
						</View>
					))}
				</View>

				<View style={styles.total}>
					<View></View>
					<View style={styles.totalColumn}>
						<View style={styles.totalField}>
							<Text>Subtotal:</Text>
							<Text>{items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0), 0).toFixed(2)}</Text>
						</View>

						<View style={styles.totalField}>
							<Text>{`Tax: ${tax}%`}</Text>
							<Text>{items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0) * (tax / 100), 0).toFixed(2)}</Text>
						</View>

						<View style={styles.totalField}>
							<Text>{`Discount: ${discount}%`}</Text>
							<Text>{items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0) * (discount / 100), 0).toFixed(2)}</Text>
						</View>

						<Svg viewBox='0 0 200% 1%' height='1%' width='100%'>
							<Line x1='0%' y1='1' x2='100%' y2='1' strokeWidth={1} stroke='#252525' />
						</Svg>

						<View style={styles.totalField}>
							<Text>Total: </Text>
							<Text>{total.toFixed(2)}</Text>
						</View>
					</View>
				</View>
			</View>

			{/* Footer */}
			<View style={styles.footer} fixed>
				<Text>Invoice generated by hyperbooks.</Text>
			</View>
		</Page>
	);
};
