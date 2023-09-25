import React, { ReactNode } from 'react';

type FiltersProps = {
	[key: string]: any;
};

// Utility function to format date
const formatDate = (dateStr: string): string => {
	const date = new Date(dateStr);
	return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
};

// Utility function to format array values
const formatArray = (arr: string[]): string => {
	if (arr.length === 0) return 'all';
	if (arr.length === 1) return arr[0];
	console.log(arr);
	return `${arr.join(', ')}`;
};

const camelCaseRenderer = (value: string) => {
	return value.replace(/([A-Z])/g, ' $1').replace(/^./, function (str) { return str.toUpperCase(); })
}

export default function FilterTooltip({ filters }: any) {
	return (
		<div
			id="tooltip-light"
			role="tooltip"
			className="absolute -top-10 z-20 inline-block px-3 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg shadow-lg whitespace-nowrap"
		>
			{Object.entries(filters).map(([key, value]) => {
				let displayValue: string | ReactNode = "";
				let displayKey = camelCaseRenderer(key);
				if (key.includes('date') || key.includes('Date')) {
					displayValue = formatDate(value as string);
				} else if (Array.isArray(value)) {
					displayValue = formatArray(value);
				} else {
					displayValue = String(value);
				}
				return (<>
					<div key={key}>
						<span className="font-bold">{displayKey}:</span> {displayValue}
					</div>
				</>
				);
			})}
			<div className="tooltip-arrow" data-popper-arrow></div>
		</div>
	);
};
