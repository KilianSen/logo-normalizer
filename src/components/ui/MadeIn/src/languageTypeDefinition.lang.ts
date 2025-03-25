import {Translation} from "@/components/ui/MadeIn/src/utils/i18n.ts";

type LanguageTypeDefinitionLang = {
	[key: string]: {
		"aria-description": string;
		"format": {[key: string]: string};
	}
} & Translation;

export const Language: LanguageTypeDefinitionLang = {
	"de": {
		"aria-description": "Gemacht mit Liebe in der {lang.eu.aria} und {lang.country.aria}",
		"format": {
			"love": "Gemacht mit {lang.heart.flag}",
			
			"eu": "Gemacht in {lang.eu.flag}",
			"eu-love": "Gemacht mit {lang.heart.flag} in {lang.eu.flag}",
			
			"country": "Gemacht in {lang.country.flag}",
			"country-love": "Gemacht mit {lang.heart.flag} in {lang.country.flag}",
			
			"country-eu": "Gemacht in {lang.eu.flag}{lang.country.flag}",
			"country-eu-love": "Gemacht mit {lang.heart.flag} in {lang.eu.flag}{lang.country.flag}",
		}
	},
	"en": {
		"aria-description": "Made with love in the {lang.eu.aria} and {lang.country.aria}",
		"format": {
			"love": "Made with {lang.heart.flag}",
			
			"eu": "Made in {lang.eu.flag}",
			"eu-love": "Made with {lang.heart.flag} in {lang.eu.flag}",
			
			"country": "Made in {lang.country.flag}",
			"country-love": "Made with {lang.heart.flag} in {lang.country.flag}",
			
			"country-eu": "Made in {lang.eu.flag}{lang.country.flag}",
			"country-eu-love": "Made with {lang.heart.flag} in {lang.eu.flag}{lang.country.flag}",
		}
	}
	
}