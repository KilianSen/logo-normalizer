import {cloneElement, ReactElement} from "react";

export function Conditional({condition, children, truthy, falsy}: {
	condition: boolean;
	children: ReactElement,
	truthy?: ReactElement,
	falsy?: ReactElement
}) {
	if (condition && truthy) {
		// @ts-expect-error TODO: Fix this
		return cloneElement(truthy, {children: children});
	}
	if (!condition && falsy) {
		// @ts-expect-error TODO: Fix this
		return cloneElement(falsy, {children: children});
	}
	
	return children;
}