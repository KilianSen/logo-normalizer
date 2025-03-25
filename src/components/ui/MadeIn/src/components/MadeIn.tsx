import {MadeInOptions, madeInText} from "@/components/ui/MadeIn/src/default.ts";


export function MadeIn({madeInCC, displayLanguageCC, ...props}: MadeInOptions) {
	
	const t = madeInText({madeInCC, displayLanguageCC, ...props})
	
	return (
		<div aria-description={t[1]} className={"px-2 py-1 rounded-lg outline-1 w-fit"}>
			{t[0]}
		</div>
	)
}