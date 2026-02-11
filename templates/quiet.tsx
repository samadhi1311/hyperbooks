/* eslint-disable jsx-a11y/alt-text */

import { Button } from '@/components/ui/button';
import { placeholders } from '@/lib/constants';
import { InvoiceData, ProfileData, Template, AdditionalCharge } from '@/lib/types';
import { Page, View, Text, Font, Image, StyleSheet, Svg, Line } from '@react-pdf/renderer';
import { PlusCircleIcon, XCircleIcon } from 'lucide-react';
import { PageSize, PageSizeConfig, getPageSizeConfig } from './index';
import { fmtPrice } from '@/lib/utils';

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
        backgroundColor: '#f1f1f1',
        color: '#5c5c5c',
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
        marginBottom: '8pt',
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
        color: '#5c5c5c',
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
        fontSize: '10pt',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'row',
        gap: '8pt',
    },
    itemqty: {
        fontSize: '10pt',
        width: '10%',
        textAlign: 'center',
    },
    itemunit: {
        fontSize: '10pt',
        width: '20%',
        textAlign: 'right',
    },
    itemtotal: {
        fontSize: '10pt',
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
    totalsText: {
        fontSize: '10pt',
    },
    totalsTextMain: {
        fontSize: '12pt',
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        color: '#5c5c5c',
        fontSize: '10pt',
        padding: '8pt',
        borderRadius: '4pt',
        textAlign: 'center',
        bottom: '8pt',
        left: '8pt',
        right: '8pt',
    },
});

const applyCustomStyles = (baseStyles: any, customization?: Template, pageSizeConfig?: PageSizeConfig) => {
    // Create a deep copy of styles to avoid modifying the original
    const customizedStyles = JSON.parse(JSON.stringify(baseStyles));

    // Set default border color from template defaults
    customizedStyles.border = customization?.colors?.border || '#CCCCCC';

    // Apply page size configurations (always apply if provided)
    if (pageSizeConfig) {
        // Apply font sizes
        customizedStyles.page.fontSize = pageSizeConfig.fontSize.page;
        customizedStyles.profileTextMain.fontSize = pageSizeConfig.fontSize.profileMain;
        customizedStyles.profileTextSecondary.fontSize = pageSizeConfig.fontSize.profileSecondary;
        customizedStyles.billedTextMain.fontSize = pageSizeConfig.fontSize.billedMain;
        customizedStyles.billedTextSecondary.fontSize = pageSizeConfig.fontSize.billedSecondary;
        customizedStyles.theading.fontSize = pageSizeConfig.fontSize.heading;
        customizedStyles.items.fontSize = pageSizeConfig.fontSize.items;
        customizedStyles.trow.fontSize = pageSizeConfig.fontSize.trow;
        customizedStyles.trow.lineHeight = pageSizeConfig.lineHeight.trow;
        customizedStyles.itemdesc.fontSize = pageSizeConfig.fontSize.itemdesc;
        customizedStyles.itemqty.fontSize = pageSizeConfig.fontSize.itemqty;
        customizedStyles.itemunit.fontSize = pageSizeConfig.fontSize.itemunit;
        customizedStyles.itemtotal.fontSize = pageSizeConfig.fontSize.itemtotal;
        customizedStyles.addbutton.fontSize = pageSizeConfig.fontSize.button;
        customizedStyles.removebutton.fontSize = pageSizeConfig.fontSize.button;
        customizedStyles.footer.fontSize = pageSizeConfig.fontSize.footer;
        customizedStyles.totalsText.fontSize = pageSizeConfig.fontSize.totalsText;
        customizedStyles.totalsTextMain.fontSize = pageSizeConfig.fontSize.totalsTextMain;
        customizedStyles.icon.width = pageSizeConfig.fontSize.icon;
        customizedStyles.icon.height = pageSizeConfig.fontSize.icon;

        // Apply spacing
        customizedStyles.page.padding = pageSizeConfig.spacing.pagePadding;
        customizedStyles.header.padding = pageSizeConfig.spacing.headerPadding;
        customizedStyles.headerRow.gap = pageSizeConfig.spacing.headerGap;
        customizedStyles.billedTo.marginTop = pageSizeConfig.spacing.marginTop;
        customizedStyles.logo.width = pageSizeConfig.spacing.logoSize;
        customizedStyles.logo.height = pageSizeConfig.spacing.logoSize;
        customizedStyles.items.gap = pageSizeConfig.spacing.itemsGap;
        customizedStyles.totalField.gap = pageSizeConfig.spacing.totalGap;
        customizedStyles.footer.padding = pageSizeConfig.spacing.footerPadding;
        customizedStyles.items.marginTop = pageSizeConfig.spacing.itemsMarginTop;
        customizedStyles.items.marginBottom = pageSizeConfig.spacing.itemsMarginBottom;
        customizedStyles.tbody.marginTop = pageSizeConfig.spacing.tbodyMarginTop;
        customizedStyles.profile.marginLeft = pageSizeConfig.spacing.profileMarginLeft;
        customizedStyles.profile.gap = pageSizeConfig.spacing.profileGap;
        customizedStyles.billedTo.gap = pageSizeConfig.spacing.billedToGap;
        customizedStyles.billedField.gap = pageSizeConfig.spacing.billedFieldGap;
        customizedStyles.totalColumn.gap = pageSizeConfig.spacing.totalColumnGap;
        customizedStyles.addbutton.marginTop = pageSizeConfig.spacing.addButtonMargin;
        customizedStyles.addbutton.marginBottom = pageSizeConfig.spacing.addButtonMargin;

        // Apply layout
        customizedStyles.billedToRow.flexDirection = pageSizeConfig.layout.billedToDirection;
    }

    // Apply color customizations (only if customization exists)
    if (customization && customization.colors) {
        if (customization.colors.foreground) {
            customizedStyles.page.color = customization.colors.foreground;
        }

        if (customization.colors.background) {
            customizedStyles.page.backgroundColor = customization.colors.background;
        }

        if (customization.colors.foregroundMuted) {
            customizedStyles.header.color = customization.colors.foregroundMuted;
            customizedStyles.footer.color = customization.colors.foregroundMuted;
            customizedStyles.theading.color = customization.colors.foregroundMuted;
        }

        if (customization.colors.backgroundMuted) {
            customizedStyles.header.backgroundColor = customization.colors.backgroundMuted;
        }

        if (customization.colors.border) {
            customizedStyles.page.border = customization.colors.border;
            customizedStyles.border = customization.colors.border;
        }
    }

    return customizedStyles;
};

export const QuietTemplate = ({
    data,
    profile,
    removeItem,
    onEdit,
    onArrayEdit,
    customization,
    userData,
}: {
    data: InvoiceData;
    profile: ProfileData;
    removeItem: (index: number) => void;
    onEdit: (field: keyof InvoiceData | string | keyof ProfileData, value: any) => void;
    onArrayEdit: (path: string, index: number, value: any, field?: string) => void;
    customization?: Template;
    userData?: any;
}) => {
    const { billedTo, items, additionalCharges, discount, tax, total } = data;

    const customizedStyles = applyCustomStyles(styles, customization);

    const fontFamily = customization?.font?.regular || 'Inter';

    return (
        <div
            className='editor-light'
            style={{ ...customizedStyles.page, width: '595pt', height: '842pt', borderStyle: 'dashed', borderWidth: '1pt', border: '#afafaf', borderRadius: '12pt', fontFamily: fontFamily }}>
            {/* Header */}
            <div style={customizedStyles.header}>
                <div style={customizedStyles.headerRow}>
                    <img src={profile.logo} className='editable' alt='hyperbooks Logo' style={customizedStyles.logo} />
                    <div style={customizedStyles.profile}>
                        <p className='editable' style={customizedStyles.profileTextMain}>
                            {profile.name ?? placeholders.company.name}
                        </p>
                        {profile.address?.map((line, index) => (
                            <p className='editable' key={index} style={customizedStyles.profileTextSecondary}>
                                {line ?? placeholders.company.address[index]}
                            </p>
                        ))}
                    </div>
                </div>

                {/* BilledTo */}
                <div style={customizedStyles.billedToRow}>
                    <div style={customizedStyles.billedTo}>
                        <p className='editable'>Billed to</p>

                        <input
                            className='editable'
                            style={customizedStyles.billedTextMain}
                            value={billedTo.name}
                            placeholder={placeholders.billedTo.name}
                            onChange={(e) => onEdit('billedTo.name', e.target.value)}
                        />

                        {billedTo.address && billedTo.address.length > 0 && billedTo.address.map((line, index) => (
                            <input
                                type='text'
                                className='editable'
                                key={index}
                                style={customizedStyles.billedTextSecondary}
                                value={line ?? ''}
                                placeholder={placeholders.billedTo.address[index]}
                                onChange={(e) => onArrayEdit('billedTo.address', index, e.target.value)}
                            />
                        ))}
                    </div>
                    <div style={customizedStyles.billedTo}>
                        <div style={customizedStyles.billedField}>
                            <img src='/template-data/icons/email-dark.png' style={customizedStyles.icon} />
                            <input
                                className='editable'
                                type='email'
                                style={customizedStyles.billedTextSecondary}
                                value={billedTo.email}
                                placeholder={placeholders.billedTo.email}
                                onChange={(e) => onEdit('billedTo.email', e.target.value)}
                            />
                        </div>
                        <div style={customizedStyles.billedField}>
                            <img src='/template-data/icons/phone-dark.png' style={customizedStyles.icon} />
                            <input
                                className='editable'
                                type='text'
                                style={customizedStyles.billedTextSecondary}
                                value={billedTo.phone}
                                placeholder={placeholders.billedTo.phone}
                                onChange={(e) => onEdit('billedTo.phone', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Items Table */}
            <div className='items' style={customizedStyles.items}>
                <table style={{ width: '100%', tableLayout: 'fixed' }}>
                    <thead style={customizedStyles.theading}>
                        <tr>
                            <th style={customizedStyles.headdesc}>DESCRIPTION</th>
                            <th style={customizedStyles.headqty}>QTY</th>
                            <th style={customizedStyles.headunit}>UNIT PRICE</th>
                            <th style={customizedStyles.headtotal}>TOTAL</th>
                        </tr>
                    </thead>
                    <tbody style={customizedStyles.tbody}>
                        {items.map((item, index) => (
                            <tr key={index} style={customizedStyles.trow}>
                                <td style={customizedStyles.itemdesc}>
                                    <Button variant='outline' size='icon' style={customizedStyles.removebutton} className='shadow-md hover:shadow-xl' onClick={() => removeItem(index)}>
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
                                <td style={customizedStyles.itemqty}>
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
                                <td style={customizedStyles.itemunit}>
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
                                <td style={customizedStyles.itemtotal}>{item.quantity && item.amount ? fmtPrice(item.quantity * item.amount) : ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Button style={customizedStyles.addbutton} className='shadow-md hover:shadow-xl' onClick={() => onArrayEdit('items', -1, { description: '', quantity: 0, amount: 0 })}>
                    <PlusCircleIcon />
                    Add Item
                </Button>

                {/* Additional Charges */}
                {additionalCharges && additionalCharges.length > 0 && (
                    <table style={{ width: '100%', tableLayout: 'fixed', marginTop: '16pt' }}>
                        <thead style={customizedStyles.theading}>
                            <tr>
                                <th style={customizedStyles.headdesc}>DESCRIPTION</th>
                                <th style={customizedStyles.headqty}>TYPE</th>
                                <th style={customizedStyles.headtotal}>AMOUNT</th>
                            </tr>
                        </thead>
                        <tbody style={customizedStyles.tbody}>
                            {additionalCharges.map((charge, index) => (
                                <tr key={index} style={customizedStyles.trow}>
                                    <td style={customizedStyles.itemdesc}>
                                        <Button variant='outline' size='icon' style={customizedStyles.removebutton} className='shadow-md hover:shadow-xl' onClick={() => onArrayEdit('additionalCharges', index, null, 'remove')}>
                                            <XCircleIcon />
                                        </Button>
                                        <input
                                            style={{ width: '100%' }}
                                            className='editable'
                                            value={charge.description ?? ''}
                                            placeholder='Description (e.g., Courier charges)'
                                            onChange={(e) => onArrayEdit('additionalCharges', index, e.target.value, 'description')}
                                        />
                                    </td>
                                    <td style={customizedStyles.itemqty}>
                                        <select
                                            style={{ width: '100%', textAlign: 'center' }}
                                            className='editable'
                                            value={charge.type ?? 'expense'}
                                            onChange={(e) => onArrayEdit('additionalCharges', index, e.target.value, 'type')}
                                        >
                                            <option value='income'>Income</option>
                                            <option value='expense'>Expense</option>
                                        </select>
                                    </td>
                                    <td style={customizedStyles.itemqty}>
                                        <input
                                            style={{ width: '100%', textAlign: 'right' }}
                                            type='number'
                                            step='.01'
                                            pattern='[0-9]*'
                                            inputMode='numeric'
                                            className='editable'
                                            value={charge.amount ?? ''}
                                            placeholder='0.00'
                                            onChange={(e) => onArrayEdit('additionalCharges', index, e.target.value ? +e.target.value : undefined, 'amount')}
                                        />
                                    </td>
                                    
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                <Button style={customizedStyles.addbutton} className='shadow-md hover:shadow-xl' onClick={() => onArrayEdit('additionalCharges', -1, { description: '', amount: 0, type: 'expense' })}>
                    <PlusCircleIcon />
                    Add Charge
                </Button>

                <div style={customizedStyles.total}>
                    <div></div>
                    <div style={customizedStyles.totalColumn}>
                        <div style={customizedStyles.totalField}>
                            <p>Subtotal</p>
                            <p>{fmtPrice(items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0), 0))}</p>
                        </div>
                        <div style={customizedStyles.totalField}>
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
                            <p>-{fmtPrice(items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0) * ((discount ?? 0) / 100), 0))}</p>
                        </div>
                        <div style={customizedStyles.totalField}>
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
                            <p>{fmtPrice(((discount && discount > 0) ? (items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0), 0) - items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0) * ((discount ?? 0) / 100), 0)) : items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0), 0)) * ((tax ?? 0) / 100))}</p>
                        </div>
                        <div style={customizedStyles.totalField}>
                            <p style={{ fontWeight: 'bold' }}>Items Total</p>
                            <p style={{ fontWeight: 'bold' }}>{fmtPrice(((discount && discount > 0) ? (items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0), 0) - items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0) * ((discount ?? 0) / 100), 0)) : items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0), 0)) * (1 + ((tax ?? 0) / 100)))}</p>
                        </div>
                        
                        {additionalCharges && additionalCharges.length > 0 ? (
                            <>
                                <div style={{ marginTop: customizedStyles.items.gap }}></div>
                                {additionalCharges.map((charge, index) => (
                                    <div style={customizedStyles.totalField} key={index}>
                                        <p>{charge.description}</p>
                                        <p>{fmtPrice(charge.amount)}</p>
                                    </div>
                                ))}
                            </>
                        ) : null}

                        <div style={{ marginTop: customizedStyles.items.gap }}></div>
                        
                        <div style={customizedStyles.totalField}>
                            <p style={{ fontWeight: 'bold' }}>Total</p>
                            <p style={{ fontWeight: 'bold' }}>{userData?.currency ?? 'LKR'} {fmtPrice(total)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={customizedStyles.footer}>
                <p>hyperbooks.</p>
            </div>
        </div>
    );
};

// PDF View
export const renderQuietTemplate = ({ data, profile, customization, pageSize, userData }: { data: InvoiceData; profile: ProfileData | null; customization?: Template; pageSize?: PageSize; userData?: any }) => {
    const { billedTo, items, additionalCharges, tax, discount, total } = data;

    const pageSizeConfig = pageSize ? getPageSizeConfig(pageSize) : undefined;
    const customizedStyles = applyCustomStyles(styles, customization, pageSizeConfig);

    const fontFamily = 'Inter';
    const regularFontUrl = customization?.font?.regular || 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-Medium.ttf';
    const boldFontUrl = customization?.font?.bold || 'https://cdn.jsdelivr.net/npm/inter-font@3.19.0/ttf/Inter-SemiBold.ttf';

    Font.register({
        family: fontFamily,
        fonts: [
            {
                src: regularFontUrl,
                fontWeight: 'normal',
            },
            {
                src: boldFontUrl,
                fontWeight: 'bold',
            },
        ],
    });

    return (
        <Page size={pageSize || 'A5'} style={customizedStyles.page}>
            {/* Header */}
            <View style={customizedStyles.header}>
                <View style={customizedStyles.headerRow}>
                    {profile?.logo && <Image src={profile.logo} style={customizedStyles.logo} />}
                    <View style={customizedStyles.profile}>
                        <Text style={customizedStyles.profileTextMain}>{profile?.name}</Text>
                        {profile?.address?.map((line, index) => (
                            <Text style={customizedStyles.profileTextSecondary} key={index}>
                                {line}
                                {index === profile.address!.length - 1 ? '' : ','}
                            </Text>
                        ))}
                    </View>
                </View>

                {/* Billed To */}
                <View style={customizedStyles.billedToRow}>
                    <View style={customizedStyles.billedTo}>
                        <Text style={customizedStyles.billedTextSecondary}>Billed to</Text>
                        <Text style={customizedStyles.billedTextMain}>{billedTo.name}</Text>
                        {billedTo.address && billedTo.address.filter(line => line && line.trim()).length > 0 && billedTo.address.filter(line => line && line.trim()).map((line, index, filteredAddress) => (
                            <Text style={customizedStyles.billedTextSecondary} key={index}>
                                {line}
                                {filteredAddress.length > 1 && index < filteredAddress.length - 1 ? ',' : ''}
                            </Text>
                        ))}
                    </View>
                    <View style={customizedStyles.billedTo}>
                        <View style={customizedStyles.billedField}>
                            <Image src={'/template-data/icons/email-dark.png'} style={customizedStyles.icon} />
                            <Text style={customizedStyles.billedTextSecondary}>{billedTo.email}</Text>
                        </View>
                        <View style={customizedStyles.billedField}>
                            <Image src={'/template-data/icons/phone-dark.png'} style={customizedStyles.icon} />
                            <Text style={customizedStyles.billedTextSecondary}>{billedTo.phone}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Items Table Equivalent */}
            <View style={customizedStyles.items}>
                {/* Table Header */}
                <View style={{ ...customizedStyles.theading, flexDirection: 'row', width: '100%' }}>
                    <Text style={{ ...customizedStyles.headdesc, flex: 5 }}>DESCRIPTION</Text>
                    <Text style={{ ...customizedStyles.headqty, flex: 1 }}>QTY</Text>
                    <Text style={{ ...customizedStyles.headunit, flex: 2 }}>UNIT PRICE</Text>
                    <Text style={{ ...customizedStyles.headtotal, flex: 2 }}>TOTAL</Text>
                </View>

                {/* Table Body */}
                <View style={customizedStyles.tbody}>
                    {items.map((item, index) => (
                        <View key={index} style={{ ...customizedStyles.trow, flexDirection: 'row', width: '100%' }}>
                            <Text style={{ ...customizedStyles.itemdesc, flex: 5, textAlign: 'left' }}>{item.description}</Text>
                            <Text style={{ ...customizedStyles.itemqty, flex: 1, textAlign: 'center' }}>{item.quantity}</Text>
                            <Text style={{ ...customizedStyles.itemunit, flex: 2, textAlign: 'right' }}>{item.amount ? fmtPrice(item.amount) : ''}</Text>
                            <Text style={{ ...customizedStyles.itemtotal, flex: 2, textAlign: 'right' }}>{item.quantity && item.amount ? fmtPrice(item.quantity * item.amount) : ''}</Text>
                        </View>
                    ))}
                </View>

                <View style={customizedStyles.total}>
                    <View></View>
                    <View style={customizedStyles.totalColumn}>
                        <View style={customizedStyles.totalField}>
                            <Text style={customizedStyles.totalsText}>Subtotal</Text>
                            <Text style={customizedStyles.totalsText}>{fmtPrice(items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0), 0))}</Text>
                        </View>
                        
                        <View style={customizedStyles.totalField}>
                            <Text style={customizedStyles.totalsText}>Discount ({discount ?? 0}%)</Text>
                            <Text style={customizedStyles.totalsText}>-{fmtPrice(items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0) * ((discount ?? 0) / 100), 0))}</Text>
                        </View>
                        
                        <View style={customizedStyles.totalField}>
                            <Text style={customizedStyles.totalsText}>Tax ({tax ?? 0}%)</Text>
                            <Text style={customizedStyles.totalsText}>{fmtPrice(((discount && discount > 0) ? (items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0), 0) - items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0) * ((discount ?? 0) / 100), 0)) : items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0), 0)) * ((tax ?? 0) / 100))}</Text>
                        </View>
                        
                        <View style={customizedStyles.totalField}>
                            <Text style={{ ...customizedStyles.totalsText, fontWeight: 'bold' }}>Items Total</Text>
                            <Text style={{ ...customizedStyles.totalsText, fontWeight: 'bold' }}>{fmtPrice(((discount && discount > 0) ? (items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0), 0) - items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0) * ((discount ?? 0) / 100), 0)) : items.reduce((acc, item) => acc + (item.quantity || 0) * (item.amount || 0), 0)) * (1 + ((tax ?? 0) / 100)))}</Text>
                        </View>

                        {additionalCharges && additionalCharges.length > 0 ? (
                            <>
                                <View style={{ marginTop: customizedStyles.items.gap }}></View>
                                {additionalCharges.map((charge, index) => (
                                    <View style={customizedStyles.totalField} key={index}>
                                        <Text style={customizedStyles.totalsText}>{charge.description}</Text>
                                        <Text style={customizedStyles.totalsText}>{fmtPrice(charge.amount)}</Text>
                                    </View>
                                ))}
                            </>
                        ) : null}

                        <View style={{ marginTop: customizedStyles.items.gap }}></View>

                        <View style={customizedStyles.totalField}>
                            <Text style={{ ...customizedStyles.totalsTextMain, fontWeight: 'bold' }}>Total</Text>
                            <Text style={{ ...customizedStyles.totalsTextMain, fontWeight: 'bold' }}>{userData?.currency ?? 'LKR'} {fmtPrice(total)}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Footer */}
            <View style={customizedStyles.footer} fixed>
                <Text>hyperbooks.</Text>
            </View>
        </Page>
    );
};
