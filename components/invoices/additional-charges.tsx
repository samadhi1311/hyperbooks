'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdditionalCharge } from '@/lib/types';
import { PlusCircleIcon, XCircleIcon } from 'lucide-react';
import { fmtPrice } from '@/lib/utils';

interface AdditionalChargesProps {
	charges: AdditionalCharge[];
	onAdd: () => void;
	onUpdate: (index: number, field: string, value: string) => void;
	onRemove: (index: number) => void;
}

export function AdditionalCharges({ charges, onAdd, onUpdate, onRemove }: AdditionalChargesProps) {
	const totalCharges = charges.reduce((sum, charge) => sum + charge.amount, 0);

	return (
		<Card className="mt-4">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>Additional Charges</span>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onAdd}
						className="flex items-center gap-2"
					>
						<PlusCircleIcon className="h-4 w-4" />
						Add Charge
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{charges.length === 0 ? (
					<p className="text-sm text-muted-foreground">No additional charges added</p>
				) : (
					<>
						{charges.map((charge, index) => (
							<div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
								<div className="flex-1 grid grid-cols-12 gap-2">
									<div className="col-span-5">
										<Label htmlFor={`charge-desc-${index}`} className="sr-only">
											Description
										</Label>
										<Input
											id={`charge-desc-${index}`}
											placeholder="Description (e.g., Courier charges)"
											value={charge.description}
											onChange={(e) => onUpdate(index, 'description', e.target.value)}
										/>
									</div>
									<div className="col-span-3">
										<Label htmlFor={`charge-amount-${index}`} className="sr-only">
											Amount
										</Label>
										<Input
											id={`charge-amount-${index}`}
											type="number"
											placeholder="0.00"
											value={charge.amount || ''}
											onChange={(e) => onUpdate(index, 'amount', e.target.value)}
										/>
									</div>
									<div className="col-span-3">
										<Label htmlFor={`charge-type-${index}`} className="sr-only">
											Type
										</Label>
										<Select
											value={charge.type}
											onValueChange={(value: 'income' | 'expense') => onUpdate(index, 'type', value)}
										>
											<SelectTrigger id={`charge-type-${index}`}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="income">Income</SelectItem>
												<SelectItem value="expense">Expense</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="col-span-1">
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => onRemove(index)}
											className="h-8 w-8 p-0"
										>
											<XCircleIcon className="h-4 w-4" />
										</Button>
									</div>
								</div>
							</div>
						))}
						<div className="flex justify-between items-center pt-2 border-t">
							<span className="font-medium">Total Additional Charges:</span>
							<span className="font-medium">{fmtPrice(totalCharges)}</span>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
