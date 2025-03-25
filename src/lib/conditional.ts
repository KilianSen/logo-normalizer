import {cloneElement, ReactElement} from "react";

export function Conditional({condition, children, truthy, falsy}: {
	condition: boolean;
	children: ReactElement,
	truthy?: ReactElement,
	falsy?: ReactElement
}) {
	if (condition && truthy) {
		return cloneElement(truthy, {children: children});
	}
	if (!condition && falsy) {
		return cloneElement(falsy, {children: children});
	}
	
	return children;
}