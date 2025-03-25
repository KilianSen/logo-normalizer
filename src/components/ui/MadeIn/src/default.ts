import {i18nFmt} from "@/components/ui/MadeIn/src/utils/i18n.ts";
import {Language} from "@/components/ui/MadeIn/src/languageTypeDefinition.lang.ts";

export type MadeInOptions = {
	madeInCC: string,
	displayLanguageCC?: string;
	
	showEU?: boolean
	showHeart?: boolean
}

function getFlagByCountryCode(countryCode: string): string {
	return countryCode.replace(/./g, (ch) => String.fromCodePoint(0x1f1a5 + ch.toUpperCase().charCodeAt(0)))
}

function isInEU(countryCode: string): boolean {
	const euCountries = [
		"AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
		"DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
		"PL", "PT", "RO", "SK", "SI", "ES", "SE"
	]
	return euCountries.includes(countryCode.toUpperCase())
}

export function madeInText({madeInCC, displayLanguageCC, ...props}: MadeInOptions) {
	const texts = i18nFmt({
		params: {
			country: {madeInCC: madeInCC, flag: getFlagByCountryCode(madeInCC), aria: madeInCC},
			eu: {flag: "🇪🇺", aria: "EU"},
			heart: {flag: "❤️"}
		},
		translation: Language
	}, displayLanguageCC ?? navigator.language ?? "en")
	
	if (props.showHeart && !props.showEU && !isInEU(madeInCC)) return [texts["format"]["love"], texts["aria-description"]]
	if (props.showEU && !props.showHeart && !isInEU(madeInCC)) return [texts["format"]["eu"], texts["aria-description"]]
	if (props.showEU && props.showHeart && !isInEU(madeInCC)) return [texts["format"]["eu-love"], texts["aria-description"]]
	if (!props.showEU && props.showHeart && isInEU(madeInCC)) return [texts["format"]["country-love"], texts["aria-description"]]
	if (!props.showEU && !props.showHeart && isInEU(madeInCC)) return [texts["format"]["country"], texts["aria-description"]]
	if (props.showEU && props.showHeart && isInEU(madeInCC)) return [texts["format"]["country-eu-love"], texts["aria-description"]]
	if (props.showEU && !props.showHeart && isInEU(madeInCC)) return [texts["format"]["country-eu"], texts["aria-description"]]
	
	return ["error","error"]
}
