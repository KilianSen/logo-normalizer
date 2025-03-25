export type Translation = {
	  [key: string]: {
	"aria-description": string;
	"format": {[key: string]: string};
  };
}

type TKey = ((key?: string, lang?: string) => string) | string;
type RTKey = {[key: string]: TKey} | TKey;

export type TranslationProvider = {
	params: {
		[key: string]: RTKey;
	}
	translation: Translation;
}

/**
 * Recursively get all keys of an object as a flat array of strings
 * @param obj
 * @param prefix - optional prefix for the keys
 * @returns {string[]} - array of keys
 * @example
 * const obj = { a: { b: { c: 1 } } }
 * const keys = getAbsoluteKeys(obj);
 * console.log(keys); // ["a.b.c"]
 */
function getAbsoluteKeys<T extends object>(obj: T, prefix = ""): string[] {
	const keys: string[] = [];
	for (const key in obj) {
		if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
			keys.push(...getAbsoluteKeys(obj[key] as T, prefix ? `${prefix}.${key}` : key));
		} else {
			keys.push(prefix ? `${prefix}.${key}` : key);
		}
	}

	return keys;
}

/**
 * Get a value by absolute key from an object
 * @param obj - object to get the value from
 * @param key - absolute key to get the value from
 * @param prefixed - optional prefix for the keys
 * @returns {T} - value of the key
 * @throws {Error} - if the key is not found
 */
function getValueByAbsoluteKey<T, Z>(obj: Z, key: string, prefixed?: string): T {
	const keys = key.split(".");
	if (prefixed && keys[0] === prefixed) {
		keys.shift();
	}
	// @ts-expect-error "1"
	let value: never = obj;
	for (const k of keys) {
		if (value[k] === undefined) {
			throw new Error("Key not found: " + key);
		}
		value = value[k];
	}
	return value as T;
}

/**
 * Resolve the TKey to a string
 * @param tKey - TKey to resolve
 * @param lang - language to use
 * @param key - key to use
 * @returns {string} - resolved string
 */
function resolveTKey(tKey: TKey | undefined, lang: string, key: string): string {
	if (!tKey) {
		return key;
	}
	
	if (typeof tKey === "function") {
		return tKey(key, lang);
	} else {
		return tKey;
	}
}

/**
 * Format the translation using the keys from the params
 * @param tProvider - TranslationProvider to use
 * @param lang - language to use
 * @returns {X["translation"][keyof X["translation"]]} - formatted translation
 */
export function i18nFmt<X extends TranslationProvider>(tProvider: X, lang: string): X["translation"][keyof X["translation"]] {
	
	const keys = getAbsoluteKeys(tProvider.params, "lang");
	const locale: { "aria-description": string; format: { [p: string]: string } } = tProvider.translation[lang];
	
	for (const key of keys) {
		for (const lKey in locale.format) {
			if (typeof locale.format[lKey] === "string") {
				locale.format[lKey] = locale.format[lKey].replaceAll(`{${key}}`, resolveTKey(getValueByAbsoluteKey(tProvider.params, key, "lang"), lang, key));
			}
		}
		
		if (typeof locale["aria-description"] === "string") {
			locale["aria-description"] = locale["aria-description"].replaceAll(`{${key}}`, resolveTKey(getValueByAbsoluteKey(tProvider.params, key, "lang"), lang, key));
		}
	}
	
	return locale as X["translation"][keyof X["translation"]];
}