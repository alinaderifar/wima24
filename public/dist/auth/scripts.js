/*
 * LaraClassifier - Classified Ads Web Application
 * Copyright (c) BeDigit. All Rights Reserved
 *
 * Website: https://laraclassifier.com
 * Author: Mayeul Akpovi (BeDigit - https://bedigit.com)
 *
 * LICENSE
 * -------
 * This software is provided under a license agreement and may only be used or copied
 * in accordance with its terms, including the inclusion of the above copyright notice.
 * As this software is sold exclusively on CodeCanyon,
 * please review the full license details here: https://codecanyon.net/licenses/standard
 */

/**
 * Execute callback function after page is loaded
 *
 * @param callback
 * @param isFullyLoaded
 */
if (!window.onDocumentReady) {
	function onDocumentReady(callback, isFullyLoaded = true) {
		switch (document.readyState) {
			case "loading":
				/* The document is still loading, attach the event listener */
				document.addEventListener("DOMContentLoaded", callback);
				break;
			case "interactive": {
				if (!isFullyLoaded) {
					/*
					 * The document has finished loading, and we can access DOM elements.
					 * Sub-resources such as scripts, images, stylesheets and frames are still loading.
					 * Call the callback (on next available tick (in 500 milliseconds))
					 */
					setTimeout(callback, 500);
				}
				break;
			}
			case "complete":
				/* The page is fully loaded, call the callback directly */
				callback();
				break;
			default:
				document.addEventListener("DOMContentLoaded", callback);
		}
	}
}

/*
 * LaraClassifier - Classified Ads Web Application
 * Copyright (c) BeDigit. All Rights Reserved
 *
 * Website: https://laraclassifier.com
 * Author: Mayeul Akpovi (BeDigit - https://bedigit.com)
 *
 * LICENSE
 * -------
 * This software is provided under a license agreement and may only be used or copied
 * in accordance with its terms, including the inclusion of the above copyright notice.
 * As this software is sold exclusively on CodeCanyon,
 * please review the full license details here: https://codecanyon.net/licenses/standard
 */

/**
 * Observes DOM changes and executes callbacks when matching elements are added or changed
 *
 * SINGLE ELEMENT VERSION (domObserver-single.js)
 * - Fires callbacks for each element individually
 * - Better for simple cases with few elements
 * - Original implementation
 *
 * Note: Best Practices Implemented
 * 1. Reusability: Works with any selector or DOM node
 * 2. Flexibility: Configurable for different observation types
 * 3. Performance: Uses attributeFilter to observe only specific attributes when needed
 * 4. Cleanup: Returns observer instance for proper disconnection
 * 5. Error Handling: Validates inputs and provides clear errors
 * 6. Type Checking: Only processes ELEMENT_NODEs (skips text/comment nodes)
 * 7. Documentation: Full JSDoc comments for IDE support
 *
 * @param {string|Node} target - CSS selector or DOM node to observe
 * @param {Object} options - Configuration options
 * @param {Function|undefined} options.onAdd - Callback for added nodes (receives added node)
 * @param {Function|undefined} options.onChange - Callback for changed nodes (receives changed node)
 * @param {Function|undefined} options.onRemove - Callback for removed nodes (receives removed node)
 * @param {boolean|undefined} options.childList - Observe child nodes (default: true)
 * @param {boolean|undefined} options.subtree - Observe entire subtree (default: true)
 * @param {boolean|undefined} options.attributes - Observe attribute changes (default: false)
 * @param {array|undefined} options.attributeFilter - Specific attributes to observe
 * @param {boolean|undefined} options.characterData - Observe text content changes (default: false)
 * @returns {MutationObserver} The observer instance (can be used to disconnect later)
 */
function domObserver(target, options = {}) {
	// Default options
	const {
		onAdd = null,
		onChange = null,
		onRemove = null,
		childList = true,
		subtree = true,
		attributes = false,
		attributeFilter = undefined,
		characterData = false
	} = options;
	
	// Validate callbacks
	if (!onAdd && !onChange && !onRemove) {
		throw new Error('At least one callback (onAdd, onChange, or onRemove) must be provided');
	}
	
	// Get the target node to observe
	const targetNode = typeof target === 'string'
		? document.querySelector(target)
		: target;
	
	if (!targetNode) {
		throw new Error(`Target element not found: ${target}`);
	}
	
	// Callback function to execute when mutations are observed
	const callback = (mutationsList, observer) => {
		for (const mutation of mutationsList) {
			// Handle added nodes
			if (onAdd && mutation.addedNodes && mutation.addedNodes.length > 0) {
				for (const node of mutation.addedNodes) {
					if (node.nodeType === Node.ELEMENT_NODE) {
						onAdd(node);
					}
				}
			}
			
			// Handle removed nodes
			if (onRemove && mutation.removedNodes && mutation.removedNodes.length > 0) {
				for (const node of mutation.removedNodes) {
					if (node.nodeType === Node.ELEMENT_NODE) {
						onRemove(node);
					}
				}
			}
			
			// Handle attribute changes
			if (onChange && mutation.type === 'attributes') {
				onChange(mutation.target);
			}
			
			// Handle character data changes (text content)
			if (onChange && mutation.type === 'characterData') {
				onChange(mutation.target.parentNode); // Return the parent element
			}
		}
	};
	
	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);
	
	// Start observing the target node for configured mutations
	observer.observe(targetNode, {
		childList,
		subtree,
		attributes,
		attributeFilter,
		characterData
	});
	
	return observer;
}

/*
 Usage Examples
 --------------
 1. Basic Usage - Observe Added Elements
 
 // Observe when new elements are added to the body
 const observer = domObserver('body', {
	 onAdd: (element) => {
	    console.log('Element added:', element);
	 }
 });
 
 // Later, if you need to stop observing:
 // observer.disconnect();
 
 2. Advanced Usage - Observe Changes and Removals
 
 // Observe a specific container for all changes
 const containerObserver = domObserver('#my-container', {
	 onAdd: (element) => {
		 console.log('Added:', element);
		 // Initialize any dynamic components in the new element
	 },
	 onChange: (element) => {
		 console.log('Changed:', element);
		 // Handle attribute or content changes
	 },
	 onRemove: (element) => {
		 console.log('Removed:', element);
		 // Clean up any resources tied to the removed element
	 },
	 attributes: true,
	 attributeFilter: ['class', 'data-status'],
	 characterData: true
 });
 
 3. Observing Specific Attributes
 
 // Only observe class changes on a specific element
 const element = document.getElementById('my-element');
 const attrObserver = domObserver(element, {
	 onChange: (element) => {
	    console.log('Class changed:', element.className);
	 },
	 attributes: true,
	 attributeFilter: ['class'],
	 childList: false,
	 subtree: false
 });
 */

/*
 * LaraClassifier - Classified Ads Web Application
 * Copyright (c) BeDigit. All Rights Reserved
 *
 * Website: https://laraclassifier.com
 * Author: Mayeul Akpovi (BeDigit - https://bedigit.com)
 *
 * LICENSE
 * -------
 * This software is provided under a license agreement and may only be used or copied
 * in accordance with its terms, including the inclusion of the above copyright notice.
 * As this software is sold exclusively on CodeCanyon,
 * please review the full license details here: https://codecanyon.net/licenses/standard
 */

/**
 * Observes DOM changes and executes callbacks when matching elements are added or changed
 *
 * BATCH PROCESSING VERSION (domObserver-batch.js)
 * - Processes additions/removals in arrays
 * - Includes debouncing option
 * - Better for performance with bulk DOM changes
 *
 * @param {string|Node} target - CSS selector or DOM node to observe
 * @param {Object} options - Configuration options
 * @param {Function|undefined} options.onAdd - Callback for added nodes (receives array of added nodes)
 * @param {Function|undefined} options.onChange - Callback for changed nodes (receives array of changed nodes)
 * @param {Function|undefined} options.onRemove - Callback for removed nodes (receives array of removed nodes)
 * @param {boolean|undefined} options.childList - Observe child nodes (default: true)
 * @param {boolean|undefined} options.subtree - Observe entire subtree (default: true)
 * @param {boolean|undefined} options.attributes - Observe attribute changes (default: false)
 * @param {array|undefined} options.attributeFilter - Specific attributes to observe
 * @param {boolean|undefined} options.characterData - Observe text content changes (default: false)
 * @param {number|undefined} options.debounce - Debounce time in ms for rapid changes (default: 0)
 * @returns {MutationObserver} The observer instance (can be used to disconnect later)
 */
function domObserverBatch(target, options = {}) {
	// Default options
	const {
		onAdd = null,
		onChange = null,
		onRemove = null,
		childList = true,
		subtree = true,
		attributes = false,
		attributeFilter = undefined,
		characterData = false,
		debounce = 0
	} = options;
	
	// Validate callbacks
	if (!onAdd && !onChange && !onRemove) {
		throw new Error('At least one callback (onAdd, onChange, or onRemove) must be provided');
	}
	
	// Get the target node to observe
	const targetNode = typeof target === 'string'
		? document.querySelector(target)
		: target;
	
	if (!targetNode) {
		throw new Error(`Target element not found: ${target}`);
	}
	
	// Process mutations in batches
	const processMutations = (mutationsList) => {
		const addedElements = [];
		const removedElements = [];
		const changedElements = new Set();
		
		for (const mutation of mutationsList) {
			// Handle added nodes
			if (onAdd && mutation.addedNodes && mutation.addedNodes.length > 0) {
				Array.from(mutation.addedNodes).forEach(node => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						addedElements.push(node);
					}
				});
			}
			
			// Handle removed nodes
			if (onRemove && mutation.removedNodes && mutation.removedNodes.length > 0) {
				Array.from(mutation.removedNodes).forEach(node => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						removedElements.push(node);
					}
				});
			}
			
			// Handle attribute changes
			if (onChange && mutation.type === 'attributes') {
				changedElements.add(mutation.target);
			}
			
			// Handle character data changes (text content)
			if (onChange && mutation.type === 'characterData') {
				changedElements.add(mutation.target.parentNode);
			}
		}
		
		// Execute callbacks with batches of elements
		if (onAdd && addedElements.length > 0) onAdd(addedElements);
		if (onRemove && removedElements.length > 0) onRemove(removedElements);
		if (onChange && changedElements.size > 0) onChange(Array.from(changedElements));
	};
	
	// Debounce wrapper for callback
	let debounceTimer;
	const callback = (debounce > 0)
		? (mutationsList) => {
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(() => {
				processMutations(mutationsList);
			}, debounce);
		}
		: processMutations;
	
	// Create an observer instance linked to the callback function
	const observer = new MutationObserver(callback);
	
	// Start observing the target node for configured mutations
	observer.observe(targetNode, {
		childList,
		subtree,
		attributes,
		attributeFilter,
		characterData
	});
	
	return observer;
}

/*
 Usage Examples
 --------------
 Example 1: Basic Element Addition/Removal Tracking
 ==================================================
 
 // Track all div additions/removals in the document
 const observer = domObserverBatch(document.body, {
	 onAdd: (addedElements) => {
		 console.log('Added elements:', addedElements);
		 addedElements.forEach(el => {
		 if (el.matches('.important-widget')) {
		    initializeWidget(el);
		 }
	 });
	 },
	 onRemove: (removedElements) => {
		 console.log('Removed elements:', removedElements);
		 removedElements.forEach(el => {
			 if (el.matches('.important-widget')) {
			    cleanupWidgetResources(el);
			 }
		 });
	 }
 });
 
 // Later when you want to stop observing
 // observer.disconnect();
 
 --------------------------------
 Example 2: Shopping Cart Updates
 ================================
 
 // Track items being added/removed from a shopping cart
 const cartObserver = domObserverBatch('#cart-items', {
	 onAdd: (addedElements) => {
		 addedElements.forEach(item => {
			 if (item.matches('.cart-item')) {
		        animateCartAddition(item);
		        updateCartTotal();
			 }
		 });
	 },
	 onRemove: (removedElements) => {
		 removedElements.forEach(item => {
			 if (item.matches('.cart-item')) {
			    updateCartTotal();
			 }
		 });
	 },
	 attributes: true,
	 attributeFilter: ['data-quantity'],
	 onChange: (changedElements) => {
		 changedElements.forEach(el => {
			 if (el.matches('.cart-item')) {
			    updateCartTotal();
			 }
		 });
	 }
 });
 */

/*
 * LaraClassifier - Classified Ads Web Application
 * Copyright (c) BeDigit. All Rights Reserved
 *
 * Website: https://laraclassifier.com
 * Author: Mayeul Akpovi (BeDigit - https://bedigit.com)
 *
 * LICENSE
 * -------
 * This software is provided under a license agreement and may only be used or copied
 * in accordance with its terms, including the inclusion of the above copyright notice.
 * As this software is sold exclusively on CodeCanyon,
 * please review the full license details here: https://codecanyon.net/licenses/standard
 */

/* Polyfill (https://en.wikipedia.org/wiki/Polyfill_(programming)) */
/* Array.isArray() */
if (!Array.isArray) {
	Array.isArray = function (arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

/* Number.isNaN() */
Number.isNaN = Number.isNaN || function (value) {
	return typeof value === 'number' && isNaN(value);
}

/* Number.isInteger() */
Number.isInteger = Number.isInteger || function (value) {
	return typeof value === 'number' && isFinite(value) && Math.floor(value) === value;
};

/* Number.isSafeInteger() */
if (!Number.MAX_SAFE_INTEGER) {
	Number.MAX_SAFE_INTEGER = 9007199254740991; /* Math.pow(2, 53) - 1; */
}
Number.isSafeInteger = Number.isSafeInteger || function (value) {
	return Number.isInteger(value) && Math.abs(value) <= Number.MAX_SAFE_INTEGER;
};

/* str.endsWith() */
if (!String.prototype.endsWith) {
	String.prototype.endsWith = function (searchString, position) {
		let subjectString = this.toString();
		if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
			position = subjectString.length;
		}
		position -= searchString.length;
		let lastIndex = subjectString.lastIndexOf(searchString, position);
		return lastIndex !== -1 && lastIndex === position;
	};
}

/* --- */

/**
 * Submit a form on click its submit button
 * @param formSelector
 * @param submitButtonSelector
 */
function setupFormSubmit(formSelector, submitButtonSelector) {
	const form = document.querySelector(formSelector);
	const submitButton = document.querySelector(submitButtonSelector);
	
	if (form && submitButton) {
		submitButton.addEventListener('click', (event) => {
			event.preventDefault();
			form.submit();
		});
	} else {
		console.error('Form or submit button not found');
	}
}

/**
 * During or after typing, Check if an input field changed
 * @param inputElement
 * @param callback
 */
function addInputChangeListeners(inputElement, callback) {
	// The 'input' event is triggered immediately whenever the value of the input field changes
	inputElement.addEventListener('input', (event) => callback(event));
	
	// The 'change' event is triggered when the input field loses focus after its value has been changed
	inputElement.addEventListener('change', (event) => callback(event));
}

/**
 * Prevent the page to load in IFRAME by redirecting it to the top-level window
 */
function preventPageLoadingInIframe() {
	try {
		if (window.top.location !== window.location) {
			window.top.location.replace(siteUrl);
		}
	} catch (e) {
		console.error(e);
	}
}

/**
 * Redirect URL
 * @param url
 */
function redirect(url) {
	window.location.replace(url);
	window.location.href = url;
}

/**
 * Raw URL encode
 * @param value
 * @returns {string}
 */
function rawurlencode(value) {
	value = (value + '').toString();
	
	return encodeURIComponent(value)
		.replace(/!/g, '%21')
		.replace(/'/g, '%27')
		.replace(/\(/g, '%28')
		.replace(/\)/g, '%29')
		.replace(/\*/g, '%2A');
}

/**
 * Check if variable is defined
 * @param value
 * @returns {boolean}
 */
function isDefined(value) {
	return (typeof value !== 'undefined');
}

/**
 * Check if variable is not defined
 * @param value
 * @returns {boolean}
 */
function isNotDefined(value) {
	return (typeof value === 'undefined');
}

/**
 * Check if pure JS DOM element is found (defined)
 * @param el
 * @returns {boolean}
 */
function isElDefined(el) {
	return (typeof el !== 'undefined' && el !== null);
}

/**
 * Check if pure JS DOM element is not found (not defined)
 * @param el
 * @returns {boolean}
 */
function isElNotDefined(el) {
	return !isElDefined(el);
}

/**
 * Check if variable is undefined, null, 0, or blank
 * @param value
 * @returns {boolean}
 */
function isEmpty(value) {
	if (isBlank(value)) {
		return true;
	}
	
	if (isNumeric(value, true)) {
		return value === 0 || value === '0';
	}
	
	return false;
}

/**
 * Check if variable is blank
 * Support: undefined, null, array, object, date, number and string
 *
 * @param value
 * @returns {boolean}
 */
function isBlank(value) {
	if (!isDefined(value) || value === null) {
		return true;
	}
	
	if (isArray(value)) {
		return value.length === 0;
	}
	
	if (value instanceof Date) {
		return false;
	}
	
	if (isObject(value)) {
		/* 'value' is a JS HTML element */
		if (isDefined(value.nodeName)) {
			return value.nodeName.length === 0;
		}
		
		/* 'value' is a jQuery HTML element */
		if (isDefined(value.get)) {
			return value.get(0).tagName.length === 0;
		}
		
		/* Classic JSON object */
		return Object.keys(value).length === 0;
	}
	
	return [''].includes(value);
}

/**
 * Check if variable is filled
 * @param value
 * @returns {boolean}
 */
function isFilled(value) {
	return !isBlank(value);
}

/**
 * Check if variable is blank or null
 *
 * @param value
 * @returns {boolean}
 */
function isBlankString(value) {
	return (isEmpty(value) || /^\s*$/.test(value));
}

/**
 * Check if variable is a string
 * @param value
 * @returns {boolean}
 */
function isString(value) {
	if (isDefined(value)) {
		return (typeof value === 'string' || value instanceof String);
	}
	
	return false;
}

/**
 * Check if variable is an array
 *
 * @param value
 * @returns {arg is any[]}
 */
function isArray(value) {
	return Array.isArray(value);
}

/**
 * Check if variable is an object
 * Note: Since 'null' is an object in JS, exclude it
 *
 * @param value
 * @returns {boolean}
 */
function isObject(value) {
	return (typeof value === 'object' && value !== null);
}

/**
 * Check if an element is a DOM element
 * @param value
 * @returns {boolean}
 */
function isDomElement(value) {
	return (isElDefined(value) && (value instanceof HTMLElement || value instanceof Element));
}

/**
 * Check if variable is a jQuery object
 * @param value
 * @returns {boolean}
 */
function isJQueryObject(value) {
	return (typeof jQuery !== 'undefined' && value instanceof jQuery);
}

/**
 * Check if variable is a JSON object
 * @param value
 * @returns {boolean}
 */
function isJsonObject(value) {
	return (
		typeof isObject(value)
		&& !isArray(value)
		&& !isJQueryObject(value)
		&& !isDomElement(value)
	);
}

/**
 * Check if variable is numeric (Integer or Float)
 * Note: Second argument to check if string containing an integer
 *
 * @param value
 * @param checkIfStringContainingAnInteger
 * @returns {boolean}
 */
function isNumeric(value, checkIfStringContainingAnInteger = false) {
	let isNumeric = (typeof value === 'number' && !Number.isNaN(value));
	
	if (checkIfStringContainingAnInteger) {
		let parsedValue;
		if (!isNumeric) {
			parsedValue = parseInt(value, 10);
			isNumeric = (value == parsedValue && !Number.isNaN(parsedValue));
		}
		if (!isNumeric) {
			parsedValue = parseFloat(value);
			isNumeric = (value == parsedValue && !Number.isNaN(parsedValue));
		}
	}
	
	return isNumeric;
}

/**
 * Check if variable is an integer (strictly)
 * @param value
 * @returns {boolean}
 */
function isInt(value) {
	return isNumeric(value) && Number.isSafeInteger(value);
}

/**
 * Check if variable is a float number (strictly)
 * @param value
 * @returns {boolean}
 */
function isFloat(value) {
	return isNumeric(value) && !Number.isInteger(value);
}

/**
 * Check if variable is string of JSON or not
 * @param value
 * @returns {boolean}
 */
function isJsonString(value) {
	if (isString(value)) {
		try {
			JSON.parse(value);
			return true;
		} catch (e) {
		}
	}
	return false;
}

/**
 * Check if variable is array of JSON objects
 * @param value
 * @returns {*}
 */
function isArrayOfJsonObjects(value) {
	return isArray(value) && value.every(item => isJsonObject(item));
}

/**
 * Check if variable is array of DOM Elements
 * @param value
 * @returns {*}
 */
function isArrayOfDomElements(value) {
	return isArray(value) && value.every(item => isDomElement(item));
}

/**
 * Get the DOM HTML element
 * @returns {HTMLElement}
 */
function getHtmlElement() {
	return document.documentElement;
}

/**
 * Convert a string to lowercase
 * @param value
 * @returns {string}
 */
function strToLower(value) {
	if (isString(value)) {
		value = value.toLowerCase();
	}
	
	return value;
}

/**
 * Convert a string to uppercase
 * @param value
 * @returns {string}
 */
function strToUpper(value) {
	if (isString(value)) {
		value = value.toUpperCase();
	}
	
	return value;
}

/**
 * sleep() version in JS
 * https://stackoverflow.com/a/39914235
 *
 * Usage:
 * await sleep(2000);
 * or
 * sleep(2000).then(() => {
 *     // Do something after the sleep!
 * });
 *
 * @param ms
 * @returns {Promise<unknown>}
 */
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Array each
 *
 * Usage:
 * forEach(array, function(item, i) {});
 *
 * @param array
 * @param fn
 */
function forEach(array, fn) {
	for (let i = 0; i < array.length; i++) {
		fn(array[i], i);
	}
}

/**
 * Array map
 *
 * Usage:
 * map(array, function(value, index) {});
 *
 * @param array
 * @param fn
 * @returns {*[]}
 */
function map(array, fn) {
	let results = [];
	for (let i = 0; i < array.length; i++) {
		results.push(fn(array[i], i));
	}
	return results;
}

/**
 * Get a DOM element coordinates
 * @param el
 * @returns {{top: *, left: *, bottom: *, width, right: *, height}|null}
 */
function getElementCoords(el) {
	if (!isDomElement(el)) {
		return null;
	}
	
	const scrollY = window.scrollY;
	const scrollX = window.scrollX;
	const rect = el.getBoundingClientRect();
	
	return {
		top: rect.top + scrollY,
		right: rect.right + scrollX,
		bottom: rect.bottom + scrollY,
		left: rect.left + scrollX,
		width: rect.width,
		height: rect.height,
	};
}

/**
 * Extract error message
 * @param value
 * @param defaultMessage
 * @returns {*|null}
 */
function getErrorMessage(value, defaultMessage = null) {
	if (!isDefined(value)) {
		return defaultMessage;
	}
	
	let message = getErrorMessageFromXhr(value);
	if (isEmpty(message)) {
		message = getErrorMessageFromJson(value);
	}
	if (isEmpty(message)) {
		message = isString(value) ? value : null;
	}
	
	return !isEmpty(message) ? message : defaultMessage;
}

/**
 * Extracts a human-readable error message from various error formats, including those from AJAX, fetch, jQuery, Axios, and standard JavaScript errors.
 *
 * This utility is intended to standardize error message extraction for displaying to users or logging.
 *
 * 💡 Supported error formats:
 * - `string`: Raw string errors (`"Something went wrong"`)
 * - `Error`: Standard JS errors (`new Error("...")`)
 * - `Response`: fetch() `Response` objects (`throw response`)
 * - `jqXHR`: jQuery.ajax() error object with `.responseText` and/or `.responseJSON`
 * - `AxiosError`: Axios error with `.response.data.message` or similar
 * - `object`: Custom or nested error objects (e.g., `{ message: "...", detail: "..." }`)
 *
 * ✅ Extraction logic (in order):
 * 1. Direct string values
 * 2. Error object `.message`
 * 3. Known properties: `message`, `error`, `error_message`, `err`, `detail`, `description`
 * 4. Nested response objects: `.response`, `.responseJSON`, `.responseText` (auto-parsed)
 * 5. HTTP status fallback: `error.status` + `error.statusText`
 * 6. `.toString()` if meaningful
 * 7. Developer-provided `defaultMessage`
 * 8. Final fallback: `'An unknown error occurred. Request failed.'`
 *
 * ⚠️ This function is `async` because `fetch()` response bodies must be read asynchronously.
 *
 * @async
 * @function extractAjaxErrorMessage
 * @param {*} error - The error value from a failed AJAX call or exception. Can be of any type.
 * @param {string|null} [defaultMessage=null] - Optional developer-defined fallback error message. If not provided, a built-in fallback is used.
 * @returns {Promise<string>} A user-friendly, trimmed error message string.
 *
 * @example
 * try {
 *   const res = await fetch('/api/user');
 *   if (!res.ok) throw res;
 * } catch (err) {
 *   const message = await extractAjaxErrorMessage(err);
 *   alert(message); // "Unauthorized" or "HTTP error 401: Unauthorized"
 * }
 *
 * @example
 * $.ajax({
 *   url: '/api/user',
 *   method: 'GET',
 *   error: async function(jqXHR) {
 *     const message = await extractAjaxErrorMessage(jqXHR);
 *     console.error(message); // Logs parsed message from responseText or responseJSON
 *   }
 * });
 *
 * @example (Without await usage)
 * fetch('/api/user')
 *   .then(res => {
 *     if (!res.ok) throw res;
 *     return res.json();
 *   })
 *   .then(data => {
 *     console.log('Success:', data);
 *   })
 *   .catch(error => {
 *     extractAjaxErrorMessage(error).then(function (message) {
 *       console.error('Fetch error:', message);
 *     });
 *   });
 *
 * @example (Without await usage)
 * $.ajax({
 *   url: '/api/user',
 *   method: 'GET',
 *   error: function (jqXHR) {
 *     extractAjaxErrorMessage(jqXHR).then(function (message) {
 *       console.error('Error:', message);
 *       alert(message);
 *     });
 *   }
 * });
 */
async function extractAjaxErrorMessage(error, defaultMessage = null) {
	// const fallbackMessage = 'Something went wrong. Please try again.';
	const fallbackMessage = 'An unknown error occurred. Request failed.';
	
	if (!error) return defaultMessage ?? fallbackMessage;
	
	// String error (direct message)
	if (typeof error === 'string') {
		return error.trim() || (defaultMessage ?? fallbackMessage);
	}
	
	// JavaScript Error instance
	if (error instanceof Error) {
		return error.message?.trim() || (defaultMessage ?? fallbackMessage);
	}
	
	// fetch() Response object
	if (typeof Response !== 'undefined' && error instanceof Response) {
		try {
			const json = await error.clone().json();
			const msg = await extractAjaxErrorMessage(json, defaultMessage);
			if (msg) return msg;
		} catch {
			try {
				const text = await error.clone().text();
				if (text.trim()) return text.trim();
			} catch {
				// Ignore
			}
		}
		
		return `HTTP error ${error.status}: ${error.statusText}`.trim();
	}
	
	// Structured objects (Axios, jQuery.ajax, etc.)
	if (typeof error === 'object') {
		// Recursively try common nested paths
		if (error.response) {
			const msg = await extractAjaxErrorMessage(error.response, defaultMessage);
			if (msg) return msg;
		}
		
		if (error.responseJSON) {
			const msg = await extractAjaxErrorMessage(error.responseJSON, defaultMessage);
			if (msg) return msg;
		}
		
		if (typeof error.responseText === 'string') {
			try {
				const parsed = JSON.parse(error.responseText);
				const msg = await extractAjaxErrorMessage(parsed, defaultMessage);
				if (msg) return msg;
			} catch {
				return error.responseText.trim() || (defaultMessage ?? fallbackMessage);
			}
		}
		
		// Try common message keys at current level
		const messageKeys = ['message', 'error', 'error_message', 'err', 'detail', 'description'];
		for (const key of messageKeys) {
			if (typeof error[key] === 'string' && error[key].trim()) {
				return error[key].trim();
			}
		}
		
		// HTTP status fallback
		if (error.status || error.statusText) {
			return `HTTP error ${error.status || ''}: ${error.statusText || ''}`.trim();
		}
	}
	
	// Fallback: error.toString()
	try {
		if (typeof error.toString === 'function') {
			const str = error.toString();
			if (str && str !== '[object Object]') return str.trim();
		}
	} catch {
		// Ignore
	}
	
	return defaultMessage ?? fallbackMessage;
}

/**
 * Get error message from a XHR object
 * @param value
 * @param defaultMessage
 * @returns {*|null}
 */
function getErrorMessageFromXhr(value, defaultMessage = null) {
	let message = null;
	
	if (isDefined(value.responseJSON)) {
		message = getErrorMessageFromJson(value.responseJSON);
	}
	
	if (isEmpty(message)) {
		let responseText;
		if (isDefined(value.responseText)) {
			if (!isObject(value.responseText)) {
				try {
					responseText = JSON.parse(value.responseText);
				} catch (e) {
					responseText = value.responseText;
				}
			} else {
				responseText = value.responseText;
			}
			
			message = getErrorMessageFromJson(responseText);
		}
	}
	
	return !isEmpty(message) ? message : defaultMessage;
}

/**
 * Get error message from a JSON object
 * @param value
 * @param defaultMessage
 * @returns {*|null}
 */
function getErrorMessageFromJson(value, defaultMessage = null) {
	if (!isObject(value)) {
		if (isString(value)) {
			return value;
		}
		return defaultMessage;
	}
	
	let message = isDefined(value.message) ? value.message : null;
	if (isEmpty(message)) {
		message = isDefined(value.error) ? value.error : null;
	}
	
	message = isString(message) ? message : null;
	
	return !isEmpty(message) ? message : defaultMessage;
}

/**
 * Check if string is an email address
 * @param str
 * @returns {boolean}
 */
function isEmailAddress(str) {
	/* Regular expression to match email addresses */
	const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	return emailPattern.test(str);
}

/**
 * Find all email addresses containing in a string
 * @param str
 * @returns {*|*[]}
 */
function findEmailAddresses(str) {
	/* Regular expression to match email addresses */
	const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
	const matches = str.match(emailPattern);
	return matches || [];
}

/**
 * Resolves a selector, DOM element, or an array of selectors/DOM elements
 * into an array of DOM elements.
 *
 * This function accepts a string representing a CSS selector, a single DOM element,
 * or an array of such selectors/elements, including nested arrays. It returns an
 * array of the matched DOM elements. If an invalid input is provided, the function
 * will log a warning to the console and return an empty array.
 *
 * @param {string | Element | Array<string | Element | Array>} selectors - A CSS selector, DOM element,
 * or an array of selectors/DOM elements, including nested arrays.
 * @returns {Element[]} An array of DOM elements corresponding to the provided selectors.
 * If no matches are found or if invalid inputs are provided, an empty array is returned.
 *
 * @example
 * // Get elements by CSS selector
 * resolveDomElements('.example-class');
 *
 * @example
 * // Get a single DOM element
 * const element = document.querySelector('#example-id');
 * resolveDomElements(element);
 *
 * @example
 * // Get elements by an array of selectors
 * resolveDomElements(['.example-class', '#example-id']);
 *
 * @example
 * // Handle nested arrays of selectors
 * resolveDomElements(['.example-class', ['#another-id', element]]);
 */
function resolveDomElements(selectors) {
	if (!selectors || (Array.isArray(selectors) && selectors.length === 0)) {
		return [];
	}
	
	if (!Array.isArray(selectors)) {
		selectors = [selectors];
	}
	
	return selectors.flatMap(selector => {
		if (Array.isArray(selector)) {
			return resolveDomElements(selector); // Recursive call
		} else if (typeof selector === 'string') {
			return Array.from(document.querySelectorAll(selector));
		} else if (selector instanceof Element) {
			return [selector];
		} else {
			console.warn(`Invalid selector: "${selector}". Use a string, a DOM element, or an array of them.`);
			return [];
		}
	});
}

/**
 * Set one or more elements' visibility (by passing their selector in argument)
 * Note: @action can be: hide or show
 * @param action
 * @param selectors
 */
function setElementsVisibility(action, selectors) {
	const elements = resolveDomElements(selectors);
	if (elements.length <= 0) return;
	
	elements.forEach((element) => {
		if (action === 'show') {
			element.style.display = ''; /* Default to empty string to show element */
		} else if (action === 'hide') {
			element.style.display = 'none';
		} else {
			console.warn(`Invalid action: "${action}". Use 'show' or 'hide'.`);
		}
	});
}

/**
 * Toggle one or more elements' classes by adding/removing a specified class
 * Note: @action can be: add or remove
 * @param selectors
 * @param action
 * @param className
 */
function toggleElementsClass(selectors, action, className) {
	const elements = resolveDomElements(selectors);
	if (elements.length <= 0) return;
	
	elements.forEach(function (element) {
		if (action === 'add') {
			element.classList.add(className);
		} else if (action === 'remove') {
			element.classList.remove(className);
		} else {
			console.warn(`Invalid action: "${action}". Use 'add' or 'remove'.`);
		}
	});
}

/**
 * Updates a select box with options from a JSON object and optionally sets a default selected option
 *
 * Example usage:
 * const options = {
 * 	"option1": "Option 1",
 * 	"option2": "Option 2",
 * 	"option3": "Option 3"
 * };
 *
 * Update the select box with ID 'mySelectBox' and set 'option2' as the default selected option
 * updateSelectOptions('#mySelectBox', options, 'option2');
 *
 * @param {string|Element} selectElement
 * @param {object} optionsJson
 * @param {null|string} defaultValue
 */
function updateSelectOptions(selectElement, optionsJson, defaultValue = null) {
	/* Get the select box element with selector */
	const selectBox = isString(selectElement) ? document.querySelector(selectElement) : selectElement;
	
	/* If the select box does not exist, log an error and exit the function */
	if (!isDomElement(selectBox)) {
		if (isString(selectElement)) {
			console.error(`Select box with selector "${selectElement}" not found.`);
		}
		return;
	}
	
	/* Clear the existing options */
	selectBox.innerHTML = '';
	
	/* Iterate through the JSON object and create option elements */
	for (const [value, text] of Object.entries(optionsJson)) {
		const option = document.createElement('option');
		option.value = value;
		option.text = text;
		
		/* If a default value is provided and matches the current option value, set it as selected */
		if (defaultValue !== null && value === defaultValue) {
			option.selected = true;
		}
		
		selectBox.appendChild(option);
	}
}

/**
 * Updates a Select2 select box with options from a JSON object and optionally sets a default selected option
 * Note: This is the select2 version of the updateSelectOptions() function
 *
 * @param {string|Element} selectElement
 * @param {object} optionsJson
 * @param {null|string} defaultValue
 */
function updateSelect2Options(selectElement, optionsJson, defaultValue = null) {
	if (typeof jQuery === 'undefined' || typeof $ === 'undefined') {
		console.error(`jQuery is not available.`);
		return;
	}
	
	/* Get the select box element with selector */
	let selectBox = (isString(selectElement) || isDomElement(selectElement))
		? $(selectElement)
		: selectElement;
	
	/* If the select box does not exist, log an error and exit the function */
	if (!isJQueryObject(selectBox)) {
		if (isString(selectElement)) {
			console.error(`Select box with selector "${selectElement}" not found.`);
		}
		return;
	}
	
	/* Clear the existing options */
	selectBox.empty();
	
	/* Iterate through the JSON object and create option elements */
	for (const [value, text] of Object.entries(optionsJson)) {
		if (value === defaultValue) {
			selectBox.append(`<option value="${value}" selected="selected">${text}</option>`);
		} else {
			selectBox.append(`<option value="${value}">${text}</option>`);
		}
	}
	
	/* Set the default value if provided */
	if (defaultValue !== null) {
		selectBox.val(defaultValue).trigger('change');
	}
}

/**
 * Convert associative JSON object to key:value object (for Select options for example)
 * @param jsonObject
 * @param {string} valueProperty
 * @param {string|null} keyProperty
 * @returns {{}}
 */
function assocObjectToKeyValue(jsonObject, valueProperty, keyProperty = null) {
	const newObject = {};
	
	for (const key in jsonObject) {
		if (jsonObject.hasOwnProperty(key)) {
			const newKey = !isEmpty(keyProperty) ? jsonObject[key][keyProperty] : key;
			newObject[newKey] = jsonObject[key][valueProperty];
		}
	}
	
	return newObject;
}

/*
 * LaraClassifier - Classified Ads Web Application
 * Copyright (c) BeDigit. All Rights Reserved
 *
 * Website: https://laraclassifier.com
 * Author: Mayeul Akpovi (BeDigit - https://bedigit.com)
 *
 * LICENSE
 * -------
 * This software is provided under a license agreement and may only be used or copied
 * in accordance with its terms, including the inclusion of the above copyright notice.
 * As this software is sold exclusively on CodeCanyon,
 * please review the full license details here: https://codecanyon.net/licenses/standard
 */

/**
 * UrlQuery Helper Function
 *
 * @param {string|null} url
 * @param {object} parameters
 * @param {boolean|null} secure
 * @returns {UrlQuery}
 */
function urlQuery(url = null, parameters = {}, secure = null) {
	return new UrlQuery(url, parameters, secure);
}

class UrlQuery {
	/**
	 * @param {string|null} url        - The full (or partial) URL. If null, defaults to current browser URL.
	 * @param {object}      parameters - Additional query parameters to merge in.
	 * @param {boolean|null} secure    - true => force https; false => force http; null => no change.
	 */
	constructor(url = null, parameters = {}, secure = null) {
		// Parameters that should keep '0' or 0 as valid (i.e., not removed as "empty")
		this.numericParameters = ['distance'];
		
		// Store the original URL, so we can check if it was null or empty
		this.originalUrl = url;
		
		// Default to the current browser URL if none provided
		const baseUrl = url ? url : window.location.href;
		
		// Use the browser's URL API
		this.parsedUrl = new URL(baseUrl);
		
		// If secure is explicitly set, force protocol
		if (secure === true) {
			this.parsedUrl.protocol = 'https:';
		} else if (secure === false) {
			this.parsedUrl.protocol = 'http:';
		}
		
		// Convert existing URL search params to an object
		this.parameters = {};
		for (const [key, value] of this.parsedUrl.searchParams.entries()) {
			this._setDeepValue(this.parameters, key, value);
		}
		
		// Merge additional parameters
		for (const [key, value] of Object.entries(parameters)) {
			this._setDeepValue(this.parameters, key, value);
		}
		
		// Remove empty parameters
		this.removeEmptyParameters();
	}
	
	/* ---------------------------------------------------------------------------
	 *                              PARAMETER METHODS
	 * -------------------------------------------------------------------------*/
	
	/**
	 * Add or update multiple parameters and remove empty values.
	 * @param {object} parameters
	 * @returns {this}
	 */
	setParameters(parameters = {}) {
		for (const [key, value] of Object.entries(parameters)) {
			this._setDeepValue(this.parameters, key, value);
		}
		this.removeEmptyParameters();
		return this;
	}
	
	/**
	 * Remove a single parameter by key (supports dot-notation).
	 * @param {string} parameterKey
	 * @returns {this}
	 */
	removeParameter(parameterKey) {
		return this.removeParameters([parameterKey]);
	}
	
	/**
	 * Remove specific parameters by key (supports dot notation).
	 * @param {string[]} parameterKeys
	 * @returns {this}
	 */
	removeParameters(parameterKeys = []) {
		for (const key of parameterKeys) {
			this._deleteDeepValue(this.parameters, key);
		}
		return this;
	}
	
	/**
	 * Remove all query parameters.
	 * @returns {this}
	 */
	removeAllParameters() {
		this.parameters = {};
		return this;
	}
	
	/**
	 * Removes empty parameters (recursively).
	 * @private
	 */
	removeEmptyParameters() {
		this.parameters = this._removeEmptyRecursive(this.parameters);
	}
	
	/* ---------------------------------------------------------------------------
	 *                           PARAMETER CHECKS/GETTERS
	 * -------------------------------------------------------------------------*/
	
	/**
	 * Check if a single parameter exists (dot notation supported).
	 * @param {string} parameterKey
	 * @returns {boolean}
	 */
	hasParameter(parameterKey) {
		return this._getDeepValue(this.parameters, parameterKey) !== undefined;
	}
	
	/**
	 * Check if ALL listed parameters exist (dot notation).
	 * @param {string[]} parameterKeys
	 * @returns {boolean}
	 */
	hasParameters(parameterKeys = []) {
		for (const key of parameterKeys) {
			if (!this.hasParameter(key)) {
				return false;
			}
		}
		return true;
	}
	
	/**
	 * Throw an error if the parameter is missing; otherwise return its value.
	 * @param {string} parameterKey
	 * @returns {*}
	 * @throws {Error}
	 */
	requireParameter(parameterKey) {
		const val = this.getParameter(parameterKey);
		if (val === null) {
			throw new Error(`Parameter "${parameterKey}" is required but missing.`);
		}
		return val;
	}
	
	/**
	 * Get a single parameter's value or null if not found (dot notation).
	 * @param {string} parameterKey
	 * @returns {*|null}
	 */
	getParameter(parameterKey) {
		const val = this._getDeepValue(this.parameters, parameterKey);
		return val !== undefined ? val : null;
	}
	
	/**
	 * Get only the specified parameters (dot notation), ignoring missing ones.
	 * @param {string[]} parameterKeys
	 * @returns {object}
	 */
	getParameters(parameterKeys = []) {
		const result = {};
		for (const key of parameterKeys) {
			const val = this._getDeepValue(this.parameters, key);
			if (val !== undefined) {
				this._setDeepValue(result, key, val);
			}
		}
		return result;
	}
	
	/**
	 * Return a copy of current parameters, excluding specified keys (dot notation).
	 * @param {string[]} parameterKeys
	 * @returns {object}
	 */
	getParametersExcluding(parameterKeys = []) {
		const filtered = this._deepClone(this.parameters);
		for (const key of parameterKeys) {
			this._deleteDeepValue(filtered, key);
		}
		return filtered;
	}
	
	/**
	 * Get all current parameters as an object.
	 * @returns {object}
	 */
	getAllParameters() {
		return this.parameters;
	}
	
	/* ---------------------------------------------------------------------------
	 *                         URL BUILDING AND MANIPULATION
	 * -------------------------------------------------------------------------*/
	
	/**
	 * Build and return the absolute URL with current query parameters.
	 * @returns {string}
	 */
	buildUrl() {
		let newUrl = `${this.parsedUrl.protocol}//${this.parsedUrl.hostname}`;
		
		if (this.parsedUrl.port) {
			newUrl += `:${this.parsedUrl.port}`;
		}
		newUrl += this.parsedUrl.pathname;
		
		const query = new URLSearchParams();
		this._objectToSearchParams(this.parameters, query);
		
		const queryString = query.toString();
		if (queryString) {
			newUrl += `?${queryString}`;
		}
		
		if (this.parsedUrl.hash) {
			newUrl += this.parsedUrl.hash;
		}
		
		return newUrl;
	}
	
	/**
	 * Return the absolute URL as a string. Optionally return null if the original URL was null or an empty string.
	 * @param {boolean} allowNullIfEmptyUrl - If true and the original URL was null/empty, return null.
	 * @returns {string|null}
	 */
	toString(allowNullIfEmptyUrl = false) {
		if (allowNullIfEmptyUrl && (this.originalUrl === null || this.originalUrl === '')) {
			return null;
		}
		return this.buildUrl();
	}
	
	/**
	 * Build and return a relative URL (pathname + ?query + #fragment).
	 * @returns {string}
	 */
	buildRelativeUrl() {
		const path = this.parsedUrl.pathname;
		const query = new URLSearchParams();
		this._objectToSearchParams(this.parameters, query);
		
		let relativeUrl = path;
		const queryString = query.toString();
		if (queryString) {
			relativeUrl += `?${queryString}`;
		}
		if (this.parsedUrl.hash) {
			relativeUrl += this.parsedUrl.hash;
		}
		return relativeUrl;
	}
	
	/**
	 * Get the URL path (pathname).
	 * @returns {string}
	 */
	getPath() {
		return this.parsedUrl.pathname;
	}
	
	/**
	 * Set the URL path (pathname).
	 * @param {string} newPath
	 * @returns {this}
	 */
	setPath(newPath) {
		this.parsedUrl.pathname = newPath;
		return this;
	}
	
	/**
	 * Get the URL host (hostname).
	 * @returns {string}
	 */
	getHost() {
		return this.parsedUrl.hostname;
	}
	
	/**
	 * Set the URL host (hostname).
	 * @param {string} newHost
	 * @returns {this}
	 */
	setHost(newHost) {
		this.parsedUrl.hostname = newHost;
		return this;
	}
	
	/**
	 * Set the URL hash/fragment (excluding the '#').
	 * @param {string} fragment
	 * @returns {this}
	 */
	setFragment(fragment = '') {
		this.parsedUrl.hash = fragment ? `#${fragment}` : '';
		return this;
	}
	
	/**
	 * Remove the URL hash/fragment entirely.
	 * @returns {this}
	 */
	removeFragment() {
		this.parsedUrl.hash = '';
		return this;
	}
	
	/**
	 * Clone this UrlQuery instance by re-parsing its absolute URL.
	 * @returns {UrlQuery}
	 */
	clone() {
		return new UrlQuery(this.buildUrl());
	}
	
	/* ---------------------------------------------------------------------------
	 *                              PRIVATE HELPERS
	 * -------------------------------------------------------------------------*/
	
	/**
	 * Recursively remove empty values (e.g., '', null, undefined) from an object/array.
	 * Numeric parameters can keep "0" or 0.
	 * @private
	 */
	_removeEmptyRecursive(data) {
		if (Array.isArray(data)) {
			return data
			.map((item) => {
				if (item && typeof item === 'object') {
					return this._removeEmptyRecursive(item);
				}
				return item;
			})
			.filter((item) => item !== '' && item !== null && item !== undefined);
		} else if (data && typeof data === 'object') {
			const result = {};
			for (const [key, val] of Object.entries(data)) {
				let cleanedValue = val;
				if (val && typeof val === 'object') {
					cleanedValue = this._removeEmptyRecursive(val);
				}
				if (this.numericParameters.includes(key)) {
					if (cleanedValue !== '' && cleanedValue !== null && cleanedValue !== undefined) {
						result[key] = cleanedValue;
					} else if (cleanedValue === 0 || cleanedValue === '0') {
						result[key] = cleanedValue;
					}
				} else {
					if (
						cleanedValue !== ''
						&& cleanedValue !== null
						&& cleanedValue !== undefined
						&& !(Array.isArray(cleanedValue) && cleanedValue.length === 0)
					) {
						result[key] = cleanedValue;
					}
				}
			}
			return result;
		}
		return data;
	}
	
	/**
	 * Convert a nested object into URLSearchParams (like Laravel's Arr::query).
	 * @private
	 */
	_objectToSearchParams(obj, searchParams, parentKey = '') {
		if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
			for (const [key, val] of Object.entries(obj)) {
				const newKey = parentKey ? `${parentKey}[${key}]` : key;
				this._objectToSearchParams(val, searchParams, newKey);
			}
		} else if (Array.isArray(obj)) {
			obj.forEach((val, index) => {
				const newKey = `${parentKey}[${index}]`;
				this._objectToSearchParams(val, searchParams, newKey);
			});
		} else {
			searchParams.append(parentKey, obj);
		}
	}
	
	/**
	 * Dot-notation get. E.g. "user.name" => obj.user.name
	 * @private
	 */
	_getDeepValue(obj, keyPath) {
		const keys = keyPath.split('.');
		let current = obj;
		for (const k of keys) {
			if (current === undefined || current === null || typeof current !== 'object') {
				return undefined;
			}
			current = current[k];
		}
		return current;
	}
	
	/**
	 * Dot-notation set. E.g. ("user.name", "Alice") => obj.user.name = "Alice"
	 * @private
	 */
	_setDeepValue(obj, keyPath, value) {
		const keys = keyPath.split('.');
		let current = obj;
		while (keys.length > 1) {
			const k = keys.shift();
			if (current[k] === undefined || current[k] === null || typeof current[k] !== 'object') {
				current[k] = {};
			}
			current = current[k];
		}
		current[keys[0]] = value;
	}
	
	/**
	 * Dot-notation delete. E.g. "user.name" => delete obj.user.name
	 * @private
	 */
	_deleteDeepValue(obj, keyPath) {
		const keys = keyPath.split('.');
		let current = obj;
		while (keys.length > 1) {
			const k = keys.shift();
			if (current[k] === undefined || current[k] === null || typeof current[k] !== 'object') {
				return;
			}
			current = current[k];
		}
		delete current[keys[0]];
	}
	
	/**
	 * Simple deep clone via JSON (not suitable for functions, Dates, etc.).
	 * @private
	 */
	_deepClone(value) {
		return JSON.parse(JSON.stringify(value));
	}
}

/*
 ========================================================================================
 Usage Examples
 ----------------------------------------------------------------------------------------
 Example 1: Basic Usage
 ----------------------------------------------------------------------------------------
 // Current page URL: https://example.com?distance=0&foo=bar
 const urlQ = new UrlQuery();
 
 // Check if a parameter exists
 console.log(urlQ.hasParameter('foo'));         // true
 console.log(urlQ.getParameter('foo')); // "bar"
 
 // Remove a parameter
 urlQ.removeParameters(['foo']);
 console.log(urlQ.buildUrl());
 // => "https://example.com?distance=0" (assuming hash/fragment was empty)
 
 ----------------------------------------------------------------------------------------
 Example 2: Dot Notation
 ----------------------------------------------------------------------------------------
 // Suppose the current URL is: https://example.com?user[name]=Alice&user[role]=admin
 const urlQ = new UrlQuery();
 
 // Dot notation used for read/update
 console.log(urlQ.getParameter('user.name')); // "Alice"
 urlQ.setParameters({ 'user.name': 'Bob' });
 console.log(urlQ.getParameter('user.name')); // "Bob"
 
 ----------------------------------------------------------------------------------------
 Example 3: Forcing HTTPS, Relative URL, and Cloning
 ----------------------------------------------------------------------------------------
 // Start with an http URL
 const secureUrl = new UrlQuery('http://example.org?foo=bar', {}, true);
 console.log(secureUrl.toString());
 // => "https://example.org?foo=bar"
 
 // Using toString with allowEmpty
 const emptyUrl = new UrlQuery(null);
 console.log(emptyUrl.toString(true)); // => null
 console.log(emptyUrl.toString());     // => current browser URL
 
 // Build a relative URL (pathname + ?query + #fragment)
 secureUrl.setPath('/products');
 secureUrl.setFragment('details');
 console.log(secureUrl.buildRelativeUrl());
 // => "/products?foo=bar#details"
 
 // Clone and modify the clone
 const cloneUrl = secureUrl.clone();
 cloneUrl.removeParameters(['foo']);
 
 or
 
 // Remove a single parameter by name
 urlQuery.removeParameter('foo');
 
 console.log(cloneUrl.buildUrl());
 // => "https://example.org/products#details"
 // (original "secureUrl" still has ?foo=bar)
 
 // If you remove an unused or nonexistent parameter, it simply does nothing
 urlQuery.removeParameter('unknownParam');
 
 ----------------------------------------------------------------------------------------
 Example 4: requireParameter
 ----------------------------------------------------------------------------------------
 // If the query is missing "token", throw an error:
 try {
 const token = urlQ.requireParameter('token');
 console.log('Token is:', token);
 } catch (err) {
 console.error(err.message);
 // => "Parameter "token" is required but missing."
 }
 ========================================================================================
 */

/*! jQuery v3.3.1 | (c) JS Foundation and other contributors | jquery.org/license */
!function(e,t){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=e.document?t(e,!0):function(e){if(!e.document)throw new Error("jQuery requires a window with a document");return t(e)}:t(e)}("undefined"!=typeof window?window:this,function(e,t){"use strict";var n=[],r=e.document,i=Object.getPrototypeOf,o=n.slice,a=n.concat,s=n.push,u=n.indexOf,l={},c=l.toString,f=l.hasOwnProperty,p=f.toString,d=p.call(Object),h={},g=function e(t){return"function"==typeof t&&"number"!=typeof t.nodeType},y=function e(t){return null!=t&&t===t.window},v={type:!0,src:!0,noModule:!0};function m(e,t,n){var i,o=(t=t||r).createElement("script");if(o.text=e,n)for(i in v)n[i]&&(o[i]=n[i]);t.head.appendChild(o).parentNode.removeChild(o)}function x(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?l[c.call(e)]||"object":typeof e}var b="3.3.1",w=function(e,t){return new w.fn.init(e,t)},T=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;w.fn=w.prototype={jquery:"3.3.1",constructor:w,length:0,toArray:function(){return o.call(this)},get:function(e){return null==e?o.call(this):e<0?this[e+this.length]:this[e]},pushStack:function(e){var t=w.merge(this.constructor(),e);return t.prevObject=this,t},each:function(e){return w.each(this,e)},map:function(e){return this.pushStack(w.map(this,function(t,n){return e.call(t,n,t)}))},slice:function(){return this.pushStack(o.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(e<0?t:0);return this.pushStack(n>=0&&n<t?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:s,sort:n.sort,splice:n.splice},w.extend=w.fn.extend=function(){var e,t,n,r,i,o,a=arguments[0]||{},s=1,u=arguments.length,l=!1;for("boolean"==typeof a&&(l=a,a=arguments[s]||{},s++),"object"==typeof a||g(a)||(a={}),s===u&&(a=this,s--);s<u;s++)if(null!=(e=arguments[s]))for(t in e)n=a[t],a!==(r=e[t])&&(l&&r&&(w.isPlainObject(r)||(i=Array.isArray(r)))?(i?(i=!1,o=n&&Array.isArray(n)?n:[]):o=n&&w.isPlainObject(n)?n:{},a[t]=w.extend(l,o,r)):void 0!==r&&(a[t]=r));return a},w.extend({expando:"jQuery"+("3.3.1"+Math.random()).replace(/\D/g,""),isReady:!0,error:function(e){throw new Error(e)},noop:function(){},isPlainObject:function(e){var t,n;return!(!e||"[object Object]"!==c.call(e))&&(!(t=i(e))||"function"==typeof(n=f.call(t,"constructor")&&t.constructor)&&p.call(n)===d)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},globalEval:function(e){m(e)},each:function(e,t){var n,r=0;if(C(e)){for(n=e.length;r<n;r++)if(!1===t.call(e[r],r,e[r]))break}else for(r in e)if(!1===t.call(e[r],r,e[r]))break;return e},trim:function(e){return null==e?"":(e+"").replace(T,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(C(Object(e))?w.merge(n,"string"==typeof e?[e]:e):s.call(n,e)),n},inArray:function(e,t,n){return null==t?-1:u.call(t,e,n)},merge:function(e,t){for(var n=+t.length,r=0,i=e.length;r<n;r++)e[i++]=t[r];return e.length=i,e},grep:function(e,t,n){for(var r,i=[],o=0,a=e.length,s=!n;o<a;o++)(r=!t(e[o],o))!==s&&i.push(e[o]);return i},map:function(e,t,n){var r,i,o=0,s=[];if(C(e))for(r=e.length;o<r;o++)null!=(i=t(e[o],o,n))&&s.push(i);else for(o in e)null!=(i=t(e[o],o,n))&&s.push(i);return a.apply([],s)},guid:1,support:h}),"function"==typeof Symbol&&(w.fn[Symbol.iterator]=n[Symbol.iterator]),w.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(e,t){l["[object "+t+"]"]=t.toLowerCase()});function C(e){var t=!!e&&"length"in e&&e.length,n=x(e);return!g(e)&&!y(e)&&("array"===n||0===t||"number"==typeof t&&t>0&&t-1 in e)}var E=function(e){var t,n,r,i,o,a,s,u,l,c,f,p,d,h,g,y,v,m,x,b="sizzle"+1*new Date,w=e.document,T=0,C=0,E=ae(),k=ae(),S=ae(),D=function(e,t){return e===t&&(f=!0),0},N={}.hasOwnProperty,A=[],j=A.pop,q=A.push,L=A.push,H=A.slice,O=function(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1},P="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",M="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",I="\\["+M+"*("+R+")(?:"+M+"*([*^$|!~]?=)"+M+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+R+"))|)"+M+"*\\]",W=":("+R+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+I+")*)|.*)\\)|)",$=new RegExp(M+"+","g"),B=new RegExp("^"+M+"+|((?:^|[^\\\\])(?:\\\\.)*)"+M+"+$","g"),F=new RegExp("^"+M+"*,"+M+"*"),_=new RegExp("^"+M+"*([>+~]|"+M+")"+M+"*"),z=new RegExp("="+M+"*([^\\]'\"]*?)"+M+"*\\]","g"),X=new RegExp(W),U=new RegExp("^"+R+"$"),V={ID:new RegExp("^#("+R+")"),CLASS:new RegExp("^\\.("+R+")"),TAG:new RegExp("^("+R+"|[*])"),ATTR:new RegExp("^"+I),PSEUDO:new RegExp("^"+W),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+M+"*(even|odd|(([+-]|)(\\d*)n|)"+M+"*(?:([+-]|)"+M+"*(\\d+)|))"+M+"*\\)|)","i"),bool:new RegExp("^(?:"+P+")$","i"),needsContext:new RegExp("^"+M+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+M+"*((?:-\\d)?\\d*)"+M+"*\\)|)(?=[^-]|$)","i")},G=/^(?:input|select|textarea|button)$/i,Y=/^h\d$/i,Q=/^[^{]+\{\s*\[native \w/,J=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,K=/[+~]/,Z=new RegExp("\\\\([\\da-f]{1,6}"+M+"?|("+M+")|.)","ig"),ee=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:r<0?String.fromCharCode(r+65536):String.fromCharCode(r>>10|55296,1023&r|56320)},te=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,ne=function(e,t){return t?"\0"===e?"\ufffd":e.slice(0,-1)+"\\"+e.charCodeAt(e.length-1).toString(16)+" ":"\\"+e},re=function(){p()},ie=me(function(e){return!0===e.disabled&&("form"in e||"label"in e)},{dir:"parentNode",next:"legend"});try{L.apply(A=H.call(w.childNodes),w.childNodes),A[w.childNodes.length].nodeType}catch(e){L={apply:A.length?function(e,t){q.apply(e,H.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function oe(e,t,r,i){var o,s,l,c,f,h,v,m=t&&t.ownerDocument,T=t?t.nodeType:9;if(r=r||[],"string"!=typeof e||!e||1!==T&&9!==T&&11!==T)return r;if(!i&&((t?t.ownerDocument||t:w)!==d&&p(t),t=t||d,g)){if(11!==T&&(f=J.exec(e)))if(o=f[1]){if(9===T){if(!(l=t.getElementById(o)))return r;if(l.id===o)return r.push(l),r}else if(m&&(l=m.getElementById(o))&&x(t,l)&&l.id===o)return r.push(l),r}else{if(f[2])return L.apply(r,t.getElementsByTagName(e)),r;if((o=f[3])&&n.getElementsByClassName&&t.getElementsByClassName)return L.apply(r,t.getElementsByClassName(o)),r}if(n.qsa&&!S[e+" "]&&(!y||!y.test(e))){if(1!==T)m=t,v=e;else if("object"!==t.nodeName.toLowerCase()){(c=t.getAttribute("id"))?c=c.replace(te,ne):t.setAttribute("id",c=b),s=(h=a(e)).length;while(s--)h[s]="#"+c+" "+ve(h[s]);v=h.join(","),m=K.test(e)&&ge(t.parentNode)||t}if(v)try{return L.apply(r,m.querySelectorAll(v)),r}catch(e){}finally{c===b&&t.removeAttribute("id")}}}return u(e.replace(B,"$1"),t,r,i)}function ae(){var e=[];function t(n,i){return e.push(n+" ")>r.cacheLength&&delete t[e.shift()],t[n+" "]=i}return t}function se(e){return e[b]=!0,e}function ue(e){var t=d.createElement("fieldset");try{return!!e(t)}catch(e){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function le(e,t){var n=e.split("|"),i=n.length;while(i--)r.attrHandle[n[i]]=t}function ce(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&e.sourceIndex-t.sourceIndex;if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function fe(e){return function(t){return"input"===t.nodeName.toLowerCase()&&t.type===e}}function pe(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function de(e){return function(t){return"form"in t?t.parentNode&&!1===t.disabled?"label"in t?"label"in t.parentNode?t.parentNode.disabled===e:t.disabled===e:t.isDisabled===e||t.isDisabled!==!e&&ie(t)===e:t.disabled===e:"label"in t&&t.disabled===e}}function he(e){return se(function(t){return t=+t,se(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}function ge(e){return e&&"undefined"!=typeof e.getElementsByTagName&&e}n=oe.support={},o=oe.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return!!t&&"HTML"!==t.nodeName},p=oe.setDocument=function(e){var t,i,a=e?e.ownerDocument||e:w;return a!==d&&9===a.nodeType&&a.documentElement?(d=a,h=d.documentElement,g=!o(d),w!==d&&(i=d.defaultView)&&i.top!==i&&(i.addEventListener?i.addEventListener("unload",re,!1):i.attachEvent&&i.attachEvent("onunload",re)),n.attributes=ue(function(e){return e.className="i",!e.getAttribute("className")}),n.getElementsByTagName=ue(function(e){return e.appendChild(d.createComment("")),!e.getElementsByTagName("*").length}),n.getElementsByClassName=Q.test(d.getElementsByClassName),n.getById=ue(function(e){return h.appendChild(e).id=b,!d.getElementsByName||!d.getElementsByName(b).length}),n.getById?(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){return e.getAttribute("id")===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n=t.getElementById(e);return n?[n]:[]}}):(r.filter.ID=function(e){var t=e.replace(Z,ee);return function(e){var n="undefined"!=typeof e.getAttributeNode&&e.getAttributeNode("id");return n&&n.value===t}},r.find.ID=function(e,t){if("undefined"!=typeof t.getElementById&&g){var n,r,i,o=t.getElementById(e);if(o){if((n=o.getAttributeNode("id"))&&n.value===e)return[o];i=t.getElementsByName(e),r=0;while(o=i[r++])if((n=o.getAttributeNode("id"))&&n.value===e)return[o]}return[]}}),r.find.TAG=n.getElementsByTagName?function(e,t){return"undefined"!=typeof t.getElementsByTagName?t.getElementsByTagName(e):n.qsa?t.querySelectorAll(e):void 0}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},r.find.CLASS=n.getElementsByClassName&&function(e,t){if("undefined"!=typeof t.getElementsByClassName&&g)return t.getElementsByClassName(e)},v=[],y=[],(n.qsa=Q.test(d.querySelectorAll))&&(ue(function(e){h.appendChild(e).innerHTML="<a id='"+b+"'></a><select id='"+b+"-\r\\' msallowcapture=''><option selected=''></option></select>",e.querySelectorAll("[msallowcapture^='']").length&&y.push("[*^$]="+M+"*(?:''|\"\")"),e.querySelectorAll("[selected]").length||y.push("\\["+M+"*(?:value|"+P+")"),e.querySelectorAll("[id~="+b+"-]").length||y.push("~="),e.querySelectorAll(":checked").length||y.push(":checked"),e.querySelectorAll("a#"+b+"+*").length||y.push(".#.+[+~]")}),ue(function(e){e.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var t=d.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("name","D"),e.querySelectorAll("[name=d]").length&&y.push("name"+M+"*[*^$|!~]?="),2!==e.querySelectorAll(":enabled").length&&y.push(":enabled",":disabled"),h.appendChild(e).disabled=!0,2!==e.querySelectorAll(":disabled").length&&y.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),y.push(",.*:")})),(n.matchesSelector=Q.test(m=h.matches||h.webkitMatchesSelector||h.mozMatchesSelector||h.oMatchesSelector||h.msMatchesSelector))&&ue(function(e){n.disconnectedMatch=m.call(e,"*"),m.call(e,"[s!='']:x"),v.push("!=",W)}),y=y.length&&new RegExp(y.join("|")),v=v.length&&new RegExp(v.join("|")),t=Q.test(h.compareDocumentPosition),x=t||Q.test(h.contains)?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},D=t?function(e,t){if(e===t)return f=!0,0;var r=!e.compareDocumentPosition-!t.compareDocumentPosition;return r||(1&(r=(e.ownerDocument||e)===(t.ownerDocument||t)?e.compareDocumentPosition(t):1)||!n.sortDetached&&t.compareDocumentPosition(e)===r?e===d||e.ownerDocument===w&&x(w,e)?-1:t===d||t.ownerDocument===w&&x(w,t)?1:c?O(c,e)-O(c,t):0:4&r?-1:1)}:function(e,t){if(e===t)return f=!0,0;var n,r=0,i=e.parentNode,o=t.parentNode,a=[e],s=[t];if(!i||!o)return e===d?-1:t===d?1:i?-1:o?1:c?O(c,e)-O(c,t):0;if(i===o)return ce(e,t);n=e;while(n=n.parentNode)a.unshift(n);n=t;while(n=n.parentNode)s.unshift(n);while(a[r]===s[r])r++;return r?ce(a[r],s[r]):a[r]===w?-1:s[r]===w?1:0},d):d},oe.matches=function(e,t){return oe(e,null,null,t)},oe.matchesSelector=function(e,t){if((e.ownerDocument||e)!==d&&p(e),t=t.replace(z,"='$1']"),n.matchesSelector&&g&&!S[t+" "]&&(!v||!v.test(t))&&(!y||!y.test(t)))try{var r=m.call(e,t);if(r||n.disconnectedMatch||e.document&&11!==e.document.nodeType)return r}catch(e){}return oe(t,d,null,[e]).length>0},oe.contains=function(e,t){return(e.ownerDocument||e)!==d&&p(e),x(e,t)},oe.attr=function(e,t){(e.ownerDocument||e)!==d&&p(e);var i=r.attrHandle[t.toLowerCase()],o=i&&N.call(r.attrHandle,t.toLowerCase())?i(e,t,!g):void 0;return void 0!==o?o:n.attributes||!g?e.getAttribute(t):(o=e.getAttributeNode(t))&&o.specified?o.value:null},oe.escape=function(e){return(e+"").replace(te,ne)},oe.error=function(e){throw new Error("Syntax error, unrecognized expression: "+e)},oe.uniqueSort=function(e){var t,r=[],i=0,o=0;if(f=!n.detectDuplicates,c=!n.sortStable&&e.slice(0),e.sort(D),f){while(t=e[o++])t===e[o]&&(i=r.push(o));while(i--)e.splice(r[i],1)}return c=null,e},i=oe.getText=function(e){var t,n="",r=0,o=e.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=i(e)}else if(3===o||4===o)return e.nodeValue}else while(t=e[r++])n+=i(t);return n},(r=oe.selectors={cacheLength:50,createPseudo:se,match:V,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(Z,ee),e[3]=(e[3]||e[4]||e[5]||"").replace(Z,ee),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||oe.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&oe.error(e[0]),e},PSEUDO:function(e){var t,n=!e[6]&&e[2];return V.CHILD.test(e[0])?null:(e[3]?e[2]=e[4]||e[5]||"":n&&X.test(n)&&(t=a(n,!0))&&(t=n.indexOf(")",n.length-t)-n.length)&&(e[0]=e[0].slice(0,t),e[2]=n.slice(0,t)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(Z,ee).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=E[e+" "];return t||(t=new RegExp("(^|"+M+")"+e+"("+M+"|$)"))&&E(e,function(e){return t.test("string"==typeof e.className&&e.className||"undefined"!=typeof e.getAttribute&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=oe.attr(r,e);return null==i?"!="===t:!t||(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i.replace($," ")+" ").indexOf(n)>-1:"|="===t&&(i===n||i.slice(0,n.length+1)===n+"-"))}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,u){var l,c,f,p,d,h,g=o!==a?"nextSibling":"previousSibling",y=t.parentNode,v=s&&t.nodeName.toLowerCase(),m=!u&&!s,x=!1;if(y){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===v:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?y.firstChild:y.lastChild],a&&m){x=(d=(l=(c=(f=(p=y)[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1])&&l[2],p=d&&y.childNodes[d];while(p=++d&&p&&p[g]||(x=d=0)||h.pop())if(1===p.nodeType&&++x&&p===t){c[e]=[T,d,x];break}}else if(m&&(x=d=(l=(c=(f=(p=t)[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]||[])[0]===T&&l[1]),!1===x)while(p=++d&&p&&p[g]||(x=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===v:1===p.nodeType)&&++x&&(m&&((c=(f=p[b]||(p[b]={}))[p.uniqueID]||(f[p.uniqueID]={}))[e]=[T,x]),p===t))break;return(x-=i)===r||x%r==0&&x/r>=0}}},PSEUDO:function(e,t){var n,i=r.pseudos[e]||r.setFilters[e.toLowerCase()]||oe.error("unsupported pseudo: "+e);return i[b]?i(t):i.length>1?(n=[e,e,"",t],r.setFilters.hasOwnProperty(e.toLowerCase())?se(function(e,n){var r,o=i(e,t),a=o.length;while(a--)e[r=O(e,o[a])]=!(n[r]=o[a])}):function(e){return i(e,0,n)}):i}},pseudos:{not:se(function(e){var t=[],n=[],r=s(e.replace(B,"$1"));return r[b]?se(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),t[0]=null,!n.pop()}}),has:se(function(e){return function(t){return oe(e,t).length>0}}),contains:se(function(e){return e=e.replace(Z,ee),function(t){return(t.textContent||t.innerText||i(t)).indexOf(e)>-1}}),lang:se(function(e){return U.test(e||"")||oe.error("unsupported lang: "+e),e=e.replace(Z,ee).toLowerCase(),function(t){var n;do{if(n=g?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return(n=n.toLowerCase())===e||0===n.indexOf(e+"-")}while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===h},focus:function(e){return e===d.activeElement&&(!d.hasFocus||d.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:de(!1),disabled:de(!0),checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,!0===e.selected},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeType<6)return!1;return!0},parent:function(e){return!r.pseudos.empty(e)},header:function(e){return Y.test(e.nodeName)},input:function(e){return G.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||"text"===t.toLowerCase())},first:he(function(){return[0]}),last:he(function(e,t){return[t-1]}),eq:he(function(e,t,n){return[n<0?n+t:n]}),even:he(function(e,t){for(var n=0;n<t;n+=2)e.push(n);return e}),odd:he(function(e,t){for(var n=1;n<t;n+=2)e.push(n);return e}),lt:he(function(e,t,n){for(var r=n<0?n+t:n;--r>=0;)e.push(r);return e}),gt:he(function(e,t,n){for(var r=n<0?n+t:n;++r<t;)e.push(r);return e})}}).pseudos.nth=r.pseudos.eq;for(t in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})r.pseudos[t]=fe(t);for(t in{submit:!0,reset:!0})r.pseudos[t]=pe(t);function ye(){}ye.prototype=r.filters=r.pseudos,r.setFilters=new ye,a=oe.tokenize=function(e,t){var n,i,o,a,s,u,l,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,u=[],l=r.preFilter;while(s){n&&!(i=F.exec(s))||(i&&(s=s.slice(i[0].length)||s),u.push(o=[])),n=!1,(i=_.exec(s))&&(n=i.shift(),o.push({value:n,type:i[0].replace(B," ")}),s=s.slice(n.length));for(a in r.filter)!(i=V[a].exec(s))||l[a]&&!(i=l[a](i))||(n=i.shift(),o.push({value:n,type:a,matches:i}),s=s.slice(n.length));if(!n)break}return t?s.length:s?oe.error(e):k(e,u).slice(0)};function ve(e){for(var t=0,n=e.length,r="";t<n;t++)r+=e[t].value;return r}function me(e,t,n){var r=t.dir,i=t.next,o=i||r,a=n&&"parentNode"===o,s=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||a)return e(t,n,i);return!1}:function(t,n,u){var l,c,f,p=[T,s];if(u){while(t=t[r])if((1===t.nodeType||a)&&e(t,n,u))return!0}else while(t=t[r])if(1===t.nodeType||a)if(f=t[b]||(t[b]={}),c=f[t.uniqueID]||(f[t.uniqueID]={}),i&&i===t.nodeName.toLowerCase())t=t[r]||t;else{if((l=c[o])&&l[0]===T&&l[1]===s)return p[2]=l[2];if(c[o]=p,p[2]=e(t,n,u))return!0}return!1}}function xe(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function be(e,t,n){for(var r=0,i=t.length;r<i;r++)oe(e,t[r],n);return n}function we(e,t,n,r,i){for(var o,a=[],s=0,u=e.length,l=null!=t;s<u;s++)(o=e[s])&&(n&&!n(o,r,i)||(a.push(o),l&&t.push(s)));return a}function Te(e,t,n,r,i,o){return r&&!r[b]&&(r=Te(r)),i&&!i[b]&&(i=Te(i,o)),se(function(o,a,s,u){var l,c,f,p=[],d=[],h=a.length,g=o||be(t||"*",s.nodeType?[s]:s,[]),y=!e||!o&&t?g:we(g,p,e,s,u),v=n?i||(o?e:h||r)?[]:a:y;if(n&&n(y,v,s,u),r){l=we(v,d),r(l,[],s,u),c=l.length;while(c--)(f=l[c])&&(v[d[c]]=!(y[d[c]]=f))}if(o){if(i||e){if(i){l=[],c=v.length;while(c--)(f=v[c])&&l.push(y[c]=f);i(null,v=[],l,u)}c=v.length;while(c--)(f=v[c])&&(l=i?O(o,f):p[c])>-1&&(o[l]=!(a[l]=f))}}else v=we(v===a?v.splice(h,v.length):v),i?i(null,a,v,u):L.apply(a,v)})}function Ce(e){for(var t,n,i,o=e.length,a=r.relative[e[0].type],s=a||r.relative[" "],u=a?1:0,c=me(function(e){return e===t},s,!0),f=me(function(e){return O(t,e)>-1},s,!0),p=[function(e,n,r){var i=!a&&(r||n!==l)||((t=n).nodeType?c(e,n,r):f(e,n,r));return t=null,i}];u<o;u++)if(n=r.relative[e[u].type])p=[me(xe(p),n)];else{if((n=r.filter[e[u].type].apply(null,e[u].matches))[b]){for(i=++u;i<o;i++)if(r.relative[e[i].type])break;return Te(u>1&&xe(p),u>1&&ve(e.slice(0,u-1).concat({value:" "===e[u-2].type?"*":""})).replace(B,"$1"),n,u<i&&Ce(e.slice(u,i)),i<o&&Ce(e=e.slice(i)),i<o&&ve(e))}p.push(n)}return xe(p)}function Ee(e,t){var n=t.length>0,i=e.length>0,o=function(o,a,s,u,c){var f,h,y,v=0,m="0",x=o&&[],b=[],w=l,C=o||i&&r.find.TAG("*",c),E=T+=null==w?1:Math.random()||.1,k=C.length;for(c&&(l=a===d||a||c);m!==k&&null!=(f=C[m]);m++){if(i&&f){h=0,a||f.ownerDocument===d||(p(f),s=!g);while(y=e[h++])if(y(f,a||d,s)){u.push(f);break}c&&(T=E)}n&&((f=!y&&f)&&v--,o&&x.push(f))}if(v+=m,n&&m!==v){h=0;while(y=t[h++])y(x,b,a,s);if(o){if(v>0)while(m--)x[m]||b[m]||(b[m]=j.call(u));b=we(b)}L.apply(u,b),c&&!o&&b.length>0&&v+t.length>1&&oe.uniqueSort(u)}return c&&(T=E,l=w),x};return n?se(o):o}return s=oe.compile=function(e,t){var n,r=[],i=[],o=S[e+" "];if(!o){t||(t=a(e)),n=t.length;while(n--)(o=Ce(t[n]))[b]?r.push(o):i.push(o);(o=S(e,Ee(i,r))).selector=e}return o},u=oe.select=function(e,t,n,i){var o,u,l,c,f,p="function"==typeof e&&e,d=!i&&a(e=p.selector||e);if(n=n||[],1===d.length){if((u=d[0]=d[0].slice(0)).length>2&&"ID"===(l=u[0]).type&&9===t.nodeType&&g&&r.relative[u[1].type]){if(!(t=(r.find.ID(l.matches[0].replace(Z,ee),t)||[])[0]))return n;p&&(t=t.parentNode),e=e.slice(u.shift().value.length)}o=V.needsContext.test(e)?0:u.length;while(o--){if(l=u[o],r.relative[c=l.type])break;if((f=r.find[c])&&(i=f(l.matches[0].replace(Z,ee),K.test(u[0].type)&&ge(t.parentNode)||t))){if(u.splice(o,1),!(e=i.length&&ve(u)))return L.apply(n,i),n;break}}}return(p||s(e,d))(i,t,!g,n,!t||K.test(e)&&ge(t.parentNode)||t),n},n.sortStable=b.split("").sort(D).join("")===b,n.detectDuplicates=!!f,p(),n.sortDetached=ue(function(e){return 1&e.compareDocumentPosition(d.createElement("fieldset"))}),ue(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||le("type|href|height|width",function(e,t,n){if(!n)return e.getAttribute(t,"type"===t.toLowerCase()?1:2)}),n.attributes&&ue(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||le("value",function(e,t,n){if(!n&&"input"===e.nodeName.toLowerCase())return e.defaultValue}),ue(function(e){return null==e.getAttribute("disabled")})||le(P,function(e,t,n){var r;if(!n)return!0===e[t]?t.toLowerCase():(r=e.getAttributeNode(t))&&r.specified?r.value:null}),oe}(e);w.find=E,w.expr=E.selectors,w.expr[":"]=w.expr.pseudos,w.uniqueSort=w.unique=E.uniqueSort,w.text=E.getText,w.isXMLDoc=E.isXML,w.contains=E.contains,w.escapeSelector=E.escape;var k=function(e,t,n){var r=[],i=void 0!==n;while((e=e[t])&&9!==e.nodeType)if(1===e.nodeType){if(i&&w(e).is(n))break;r.push(e)}return r},S=function(e,t){for(var n=[];e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n},D=w.expr.match.needsContext;function N(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()}var A=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;function j(e,t,n){return g(t)?w.grep(e,function(e,r){return!!t.call(e,r,e)!==n}):t.nodeType?w.grep(e,function(e){return e===t!==n}):"string"!=typeof t?w.grep(e,function(e){return u.call(t,e)>-1!==n}):w.filter(t,e,n)}w.filter=function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?w.find.matchesSelector(r,e)?[r]:[]:w.find.matches(e,w.grep(t,function(e){return 1===e.nodeType}))},w.fn.extend({find:function(e){var t,n,r=this.length,i=this;if("string"!=typeof e)return this.pushStack(w(e).filter(function(){for(t=0;t<r;t++)if(w.contains(i[t],this))return!0}));for(n=this.pushStack([]),t=0;t<r;t++)w.find(e,i[t],n);return r>1?w.uniqueSort(n):n},filter:function(e){return this.pushStack(j(this,e||[],!1))},not:function(e){return this.pushStack(j(this,e||[],!0))},is:function(e){return!!j(this,"string"==typeof e&&D.test(e)?w(e):e||[],!1).length}});var q,L=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(w.fn.init=function(e,t,n){var i,o;if(!e)return this;if(n=n||q,"string"==typeof e){if(!(i="<"===e[0]&&">"===e[e.length-1]&&e.length>=3?[null,e,null]:L.exec(e))||!i[1]&&t)return!t||t.jquery?(t||n).find(e):this.constructor(t).find(e);if(i[1]){if(t=t instanceof w?t[0]:t,w.merge(this,w.parseHTML(i[1],t&&t.nodeType?t.ownerDocument||t:r,!0)),A.test(i[1])&&w.isPlainObject(t))for(i in t)g(this[i])?this[i](t[i]):this.attr(i,t[i]);return this}return(o=r.getElementById(i[2]))&&(this[0]=o,this.length=1),this}return e.nodeType?(this[0]=e,this.length=1,this):g(e)?void 0!==n.ready?n.ready(e):e(w):w.makeArray(e,this)}).prototype=w.fn,q=w(r);var H=/^(?:parents|prev(?:Until|All))/,O={children:!0,contents:!0,next:!0,prev:!0};w.fn.extend({has:function(e){var t=w(e,this),n=t.length;return this.filter(function(){for(var e=0;e<n;e++)if(w.contains(this,t[e]))return!0})},closest:function(e,t){var n,r=0,i=this.length,o=[],a="string"!=typeof e&&w(e);if(!D.test(e))for(;r<i;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(n.nodeType<11&&(a?a.index(n)>-1:1===n.nodeType&&w.find.matchesSelector(n,e))){o.push(n);break}return this.pushStack(o.length>1?w.uniqueSort(o):o)},index:function(e){return e?"string"==typeof e?u.call(w(e),this[0]):u.call(this,e.jquery?e[0]:e):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){return this.pushStack(w.uniqueSort(w.merge(this.get(),w(e,t))))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function P(e,t){while((e=e[t])&&1!==e.nodeType);return e}w.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return k(e,"parentNode")},parentsUntil:function(e,t,n){return k(e,"parentNode",n)},next:function(e){return P(e,"nextSibling")},prev:function(e){return P(e,"previousSibling")},nextAll:function(e){return k(e,"nextSibling")},prevAll:function(e){return k(e,"previousSibling")},nextUntil:function(e,t,n){return k(e,"nextSibling",n)},prevUntil:function(e,t,n){return k(e,"previousSibling",n)},siblings:function(e){return S((e.parentNode||{}).firstChild,e)},children:function(e){return S(e.firstChild)},contents:function(e){return N(e,"iframe")?e.contentDocument:(N(e,"template")&&(e=e.content||e),w.merge([],e.childNodes))}},function(e,t){w.fn[e]=function(n,r){var i=w.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=w.filter(r,i)),this.length>1&&(O[e]||w.uniqueSort(i),H.test(e)&&i.reverse()),this.pushStack(i)}});var M=/[^\x20\t\r\n\f]+/g;function R(e){var t={};return w.each(e.match(M)||[],function(e,n){t[n]=!0}),t}w.Callbacks=function(e){e="string"==typeof e?R(e):w.extend({},e);var t,n,r,i,o=[],a=[],s=-1,u=function(){for(i=i||e.once,r=t=!0;a.length;s=-1){n=a.shift();while(++s<o.length)!1===o[s].apply(n[0],n[1])&&e.stopOnFalse&&(s=o.length,n=!1)}e.memory||(n=!1),t=!1,i&&(o=n?[]:"")},l={add:function(){return o&&(n&&!t&&(s=o.length-1,a.push(n)),function t(n){w.each(n,function(n,r){g(r)?e.unique&&l.has(r)||o.push(r):r&&r.length&&"string"!==x(r)&&t(r)})}(arguments),n&&!t&&u()),this},remove:function(){return w.each(arguments,function(e,t){var n;while((n=w.inArray(t,o,n))>-1)o.splice(n,1),n<=s&&s--}),this},has:function(e){return e?w.inArray(e,o)>-1:o.length>0},empty:function(){return o&&(o=[]),this},disable:function(){return i=a=[],o=n="",this},disabled:function(){return!o},lock:function(){return i=a=[],n||t||(o=n=""),this},locked:function(){return!!i},fireWith:function(e,n){return i||(n=[e,(n=n||[]).slice?n.slice():n],a.push(n),t||u()),this},fire:function(){return l.fireWith(this,arguments),this},fired:function(){return!!r}};return l};function I(e){return e}function W(e){throw e}function $(e,t,n,r){var i;try{e&&g(i=e.promise)?i.call(e).done(t).fail(n):e&&g(i=e.then)?i.call(e,t,n):t.apply(void 0,[e].slice(r))}catch(e){n.apply(void 0,[e])}}w.extend({Deferred:function(t){var n=[["notify","progress",w.Callbacks("memory"),w.Callbacks("memory"),2],["resolve","done",w.Callbacks("once memory"),w.Callbacks("once memory"),0,"resolved"],["reject","fail",w.Callbacks("once memory"),w.Callbacks("once memory"),1,"rejected"]],r="pending",i={state:function(){return r},always:function(){return o.done(arguments).fail(arguments),this},"catch":function(e){return i.then(null,e)},pipe:function(){var e=arguments;return w.Deferred(function(t){w.each(n,function(n,r){var i=g(e[r[4]])&&e[r[4]];o[r[1]](function(){var e=i&&i.apply(this,arguments);e&&g(e.promise)?e.promise().progress(t.notify).done(t.resolve).fail(t.reject):t[r[0]+"With"](this,i?[e]:arguments)})}),e=null}).promise()},then:function(t,r,i){var o=0;function a(t,n,r,i){return function(){var s=this,u=arguments,l=function(){var e,l;if(!(t<o)){if((e=r.apply(s,u))===n.promise())throw new TypeError("Thenable self-resolution");l=e&&("object"==typeof e||"function"==typeof e)&&e.then,g(l)?i?l.call(e,a(o,n,I,i),a(o,n,W,i)):(o++,l.call(e,a(o,n,I,i),a(o,n,W,i),a(o,n,I,n.notifyWith))):(r!==I&&(s=void 0,u=[e]),(i||n.resolveWith)(s,u))}},c=i?l:function(){try{l()}catch(e){w.Deferred.exceptionHook&&w.Deferred.exceptionHook(e,c.stackTrace),t+1>=o&&(r!==W&&(s=void 0,u=[e]),n.rejectWith(s,u))}};t?c():(w.Deferred.getStackHook&&(c.stackTrace=w.Deferred.getStackHook()),e.setTimeout(c))}}return w.Deferred(function(e){n[0][3].add(a(0,e,g(i)?i:I,e.notifyWith)),n[1][3].add(a(0,e,g(t)?t:I)),n[2][3].add(a(0,e,g(r)?r:W))}).promise()},promise:function(e){return null!=e?w.extend(e,i):i}},o={};return w.each(n,function(e,t){var a=t[2],s=t[5];i[t[1]]=a.add,s&&a.add(function(){r=s},n[3-e][2].disable,n[3-e][3].disable,n[0][2].lock,n[0][3].lock),a.add(t[3].fire),o[t[0]]=function(){return o[t[0]+"With"](this===o?void 0:this,arguments),this},o[t[0]+"With"]=a.fireWith}),i.promise(o),t&&t.call(o,o),o},when:function(e){var t=arguments.length,n=t,r=Array(n),i=o.call(arguments),a=w.Deferred(),s=function(e){return function(n){r[e]=this,i[e]=arguments.length>1?o.call(arguments):n,--t||a.resolveWith(r,i)}};if(t<=1&&($(e,a.done(s(n)).resolve,a.reject,!t),"pending"===a.state()||g(i[n]&&i[n].then)))return a.then();while(n--)$(i[n],s(n),a.reject);return a.promise()}});var B=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;w.Deferred.exceptionHook=function(t,n){e.console&&e.console.warn&&t&&B.test(t.name)&&e.console.warn("jQuery.Deferred exception: "+t.message,t.stack,n)},w.readyException=function(t){e.setTimeout(function(){throw t})};var F=w.Deferred();w.fn.ready=function(e){return F.then(e)["catch"](function(e){w.readyException(e)}),this},w.extend({isReady:!1,readyWait:1,ready:function(e){(!0===e?--w.readyWait:w.isReady)||(w.isReady=!0,!0!==e&&--w.readyWait>0||F.resolveWith(r,[w]))}}),w.ready.then=F.then;function _(){r.removeEventListener("DOMContentLoaded",_),e.removeEventListener("load",_),w.ready()}"complete"===r.readyState||"loading"!==r.readyState&&!r.documentElement.doScroll?e.setTimeout(w.ready):(r.addEventListener("DOMContentLoaded",_),e.addEventListener("load",_));var z=function(e,t,n,r,i,o,a){var s=0,u=e.length,l=null==n;if("object"===x(n)){i=!0;for(s in n)z(e,t,s,n[s],!0,o,a)}else if(void 0!==r&&(i=!0,g(r)||(a=!0),l&&(a?(t.call(e,r),t=null):(l=t,t=function(e,t,n){return l.call(w(e),n)})),t))for(;s<u;s++)t(e[s],n,a?r:r.call(e[s],s,t(e[s],n)));return i?e:l?t.call(e):u?t(e[0],n):o},X=/^-ms-/,U=/-([a-z])/g;function V(e,t){return t.toUpperCase()}function G(e){return e.replace(X,"ms-").replace(U,V)}var Y=function(e){return 1===e.nodeType||9===e.nodeType||!+e.nodeType};function Q(){this.expando=w.expando+Q.uid++}Q.uid=1,Q.prototype={cache:function(e){var t=e[this.expando];return t||(t={},Y(e)&&(e.nodeType?e[this.expando]=t:Object.defineProperty(e,this.expando,{value:t,configurable:!0}))),t},set:function(e,t,n){var r,i=this.cache(e);if("string"==typeof t)i[G(t)]=n;else for(r in t)i[G(r)]=t[r];return i},get:function(e,t){return void 0===t?this.cache(e):e[this.expando]&&e[this.expando][G(t)]},access:function(e,t,n){return void 0===t||t&&"string"==typeof t&&void 0===n?this.get(e,t):(this.set(e,t,n),void 0!==n?n:t)},remove:function(e,t){var n,r=e[this.expando];if(void 0!==r){if(void 0!==t){n=(t=Array.isArray(t)?t.map(G):(t=G(t))in r?[t]:t.match(M)||[]).length;while(n--)delete r[t[n]]}(void 0===t||w.isEmptyObject(r))&&(e.nodeType?e[this.expando]=void 0:delete e[this.expando])}},hasData:function(e){var t=e[this.expando];return void 0!==t&&!w.isEmptyObject(t)}};var J=new Q,K=new Q,Z=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,ee=/[A-Z]/g;function te(e){return"true"===e||"false"!==e&&("null"===e?null:e===+e+""?+e:Z.test(e)?JSON.parse(e):e)}function ne(e,t,n){var r;if(void 0===n&&1===e.nodeType)if(r="data-"+t.replace(ee,"-$&").toLowerCase(),"string"==typeof(n=e.getAttribute(r))){try{n=te(n)}catch(e){}K.set(e,t,n)}else n=void 0;return n}w.extend({hasData:function(e){return K.hasData(e)||J.hasData(e)},data:function(e,t,n){return K.access(e,t,n)},removeData:function(e,t){K.remove(e,t)},_data:function(e,t,n){return J.access(e,t,n)},_removeData:function(e,t){J.remove(e,t)}}),w.fn.extend({data:function(e,t){var n,r,i,o=this[0],a=o&&o.attributes;if(void 0===e){if(this.length&&(i=K.get(o),1===o.nodeType&&!J.get(o,"hasDataAttrs"))){n=a.length;while(n--)a[n]&&0===(r=a[n].name).indexOf("data-")&&(r=G(r.slice(5)),ne(o,r,i[r]));J.set(o,"hasDataAttrs",!0)}return i}return"object"==typeof e?this.each(function(){K.set(this,e)}):z(this,function(t){var n;if(o&&void 0===t){if(void 0!==(n=K.get(o,e)))return n;if(void 0!==(n=ne(o,e)))return n}else this.each(function(){K.set(this,e,t)})},null,t,arguments.length>1,null,!0)},removeData:function(e){return this.each(function(){K.remove(this,e)})}}),w.extend({queue:function(e,t,n){var r;if(e)return t=(t||"fx")+"queue",r=J.get(e,t),n&&(!r||Array.isArray(n)?r=J.access(e,t,w.makeArray(n)):r.push(n)),r||[]},dequeue:function(e,t){t=t||"fx";var n=w.queue(e,t),r=n.length,i=n.shift(),o=w._queueHooks(e,t),a=function(){w.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return J.get(e,n)||J.access(e,n,{empty:w.Callbacks("once memory").add(function(){J.remove(e,[t+"queue",n])})})}}),w.fn.extend({queue:function(e,t){var n=2;return"string"!=typeof e&&(t=e,e="fx",n--),arguments.length<n?w.queue(this[0],e):void 0===t?this:this.each(function(){var n=w.queue(this,e,t);w._queueHooks(this,e),"fx"===e&&"inprogress"!==n[0]&&w.dequeue(this,e)})},dequeue:function(e){return this.each(function(){w.dequeue(this,e)})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,t){var n,r=1,i=w.Deferred(),o=this,a=this.length,s=function(){--r||i.resolveWith(o,[o])};"string"!=typeof e&&(t=e,e=void 0),e=e||"fx";while(a--)(n=J.get(o[a],e+"queueHooks"))&&n.empty&&(r++,n.empty.add(s));return s(),i.promise(t)}});var re=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,ie=new RegExp("^(?:([+-])=|)("+re+")([a-z%]*)$","i"),oe=["Top","Right","Bottom","Left"],ae=function(e,t){return"none"===(e=t||e).style.display||""===e.style.display&&w.contains(e.ownerDocument,e)&&"none"===w.css(e,"display")},se=function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i};function ue(e,t,n,r){var i,o,a=20,s=r?function(){return r.cur()}:function(){return w.css(e,t,"")},u=s(),l=n&&n[3]||(w.cssNumber[t]?"":"px"),c=(w.cssNumber[t]||"px"!==l&&+u)&&ie.exec(w.css(e,t));if(c&&c[3]!==l){u/=2,l=l||c[3],c=+u||1;while(a--)w.style(e,t,c+l),(1-o)*(1-(o=s()/u||.5))<=0&&(a=0),c/=o;c*=2,w.style(e,t,c+l),n=n||[]}return n&&(c=+c||+u||0,i=n[1]?c+(n[1]+1)*n[2]:+n[2],r&&(r.unit=l,r.start=c,r.end=i)),i}var le={};function ce(e){var t,n=e.ownerDocument,r=e.nodeName,i=le[r];return i||(t=n.body.appendChild(n.createElement(r)),i=w.css(t,"display"),t.parentNode.removeChild(t),"none"===i&&(i="block"),le[r]=i,i)}function fe(e,t){for(var n,r,i=[],o=0,a=e.length;o<a;o++)(r=e[o]).style&&(n=r.style.display,t?("none"===n&&(i[o]=J.get(r,"display")||null,i[o]||(r.style.display="")),""===r.style.display&&ae(r)&&(i[o]=ce(r))):"none"!==n&&(i[o]="none",J.set(r,"display",n)));for(o=0;o<a;o++)null!=i[o]&&(e[o].style.display=i[o]);return e}w.fn.extend({show:function(){return fe(this,!0)},hide:function(){return fe(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){ae(this)?w(this).show():w(this).hide()})}});var pe=/^(?:checkbox|radio)$/i,de=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,he=/^$|^module$|\/(?:java|ecma)script/i,ge={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};ge.optgroup=ge.option,ge.tbody=ge.tfoot=ge.colgroup=ge.caption=ge.thead,ge.th=ge.td;function ye(e,t){var n;return n="undefined"!=typeof e.getElementsByTagName?e.getElementsByTagName(t||"*"):"undefined"!=typeof e.querySelectorAll?e.querySelectorAll(t||"*"):[],void 0===t||t&&N(e,t)?w.merge([e],n):n}function ve(e,t){for(var n=0,r=e.length;n<r;n++)J.set(e[n],"globalEval",!t||J.get(t[n],"globalEval"))}var me=/<|&#?\w+;/;function xe(e,t,n,r,i){for(var o,a,s,u,l,c,f=t.createDocumentFragment(),p=[],d=0,h=e.length;d<h;d++)if((o=e[d])||0===o)if("object"===x(o))w.merge(p,o.nodeType?[o]:o);else if(me.test(o)){a=a||f.appendChild(t.createElement("div")),s=(de.exec(o)||["",""])[1].toLowerCase(),u=ge[s]||ge._default,a.innerHTML=u[1]+w.htmlPrefilter(o)+u[2],c=u[0];while(c--)a=a.lastChild;w.merge(p,a.childNodes),(a=f.firstChild).textContent=""}else p.push(t.createTextNode(o));f.textContent="",d=0;while(o=p[d++])if(r&&w.inArray(o,r)>-1)i&&i.push(o);else if(l=w.contains(o.ownerDocument,o),a=ye(f.appendChild(o),"script"),l&&ve(a),n){c=0;while(o=a[c++])he.test(o.type||"")&&n.push(o)}return f}!function(){var e=r.createDocumentFragment().appendChild(r.createElement("div")),t=r.createElement("input");t.setAttribute("type","radio"),t.setAttribute("checked","checked"),t.setAttribute("name","t"),e.appendChild(t),h.checkClone=e.cloneNode(!0).cloneNode(!0).lastChild.checked,e.innerHTML="<textarea>x</textarea>",h.noCloneChecked=!!e.cloneNode(!0).lastChild.defaultValue}();var be=r.documentElement,we=/^key/,Te=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,Ce=/^([^.]*)(?:\.(.+)|)/;function Ee(){return!0}function ke(){return!1}function Se(){try{return r.activeElement}catch(e){}}function De(e,t,n,r,i,o){var a,s;if("object"==typeof t){"string"!=typeof n&&(r=r||n,n=void 0);for(s in t)De(e,s,n,r,t[s],o);return e}if(null==r&&null==i?(i=n,r=n=void 0):null==i&&("string"==typeof n?(i=r,r=void 0):(i=r,r=n,n=void 0)),!1===i)i=ke;else if(!i)return e;return 1===o&&(a=i,(i=function(e){return w().off(e),a.apply(this,arguments)}).guid=a.guid||(a.guid=w.guid++)),e.each(function(){w.event.add(this,t,i,r,n)})}w.event={global:{},add:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=J.get(e);if(y){n.handler&&(n=(o=n).handler,i=o.selector),i&&w.find.matchesSelector(be,i),n.guid||(n.guid=w.guid++),(u=y.events)||(u=y.events={}),(a=y.handle)||(a=y.handle=function(t){return"undefined"!=typeof w&&w.event.triggered!==t.type?w.event.dispatch.apply(e,arguments):void 0}),l=(t=(t||"").match(M)||[""]).length;while(l--)d=g=(s=Ce.exec(t[l])||[])[1],h=(s[2]||"").split(".").sort(),d&&(f=w.event.special[d]||{},d=(i?f.delegateType:f.bindType)||d,f=w.event.special[d]||{},c=w.extend({type:d,origType:g,data:r,handler:n,guid:n.guid,selector:i,needsContext:i&&w.expr.match.needsContext.test(i),namespace:h.join(".")},o),(p=u[d])||((p=u[d]=[]).delegateCount=0,f.setup&&!1!==f.setup.call(e,r,h,a)||e.addEventListener&&e.addEventListener(d,a)),f.add&&(f.add.call(e,c),c.handler.guid||(c.handler.guid=n.guid)),i?p.splice(p.delegateCount++,0,c):p.push(c),w.event.global[d]=!0)}},remove:function(e,t,n,r,i){var o,a,s,u,l,c,f,p,d,h,g,y=J.hasData(e)&&J.get(e);if(y&&(u=y.events)){l=(t=(t||"").match(M)||[""]).length;while(l--)if(s=Ce.exec(t[l])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){f=w.event.special[d]||{},p=u[d=(r?f.delegateType:f.bindType)||d]||[],s=s[2]&&new RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),a=o=p.length;while(o--)c=p[o],!i&&g!==c.origType||n&&n.guid!==c.guid||s&&!s.test(c.namespace)||r&&r!==c.selector&&("**"!==r||!c.selector)||(p.splice(o,1),c.selector&&p.delegateCount--,f.remove&&f.remove.call(e,c));a&&!p.length&&(f.teardown&&!1!==f.teardown.call(e,h,y.handle)||w.removeEvent(e,d,y.handle),delete u[d])}else for(d in u)w.event.remove(e,d+t[l],n,r,!0);w.isEmptyObject(u)&&J.remove(e,"handle events")}},dispatch:function(e){var t=w.event.fix(e),n,r,i,o,a,s,u=new Array(arguments.length),l=(J.get(this,"events")||{})[t.type]||[],c=w.event.special[t.type]||{};for(u[0]=t,n=1;n<arguments.length;n++)u[n]=arguments[n];if(t.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,t)){s=w.event.handlers.call(this,t,l),n=0;while((o=s[n++])&&!t.isPropagationStopped()){t.currentTarget=o.elem,r=0;while((a=o.handlers[r++])&&!t.isImmediatePropagationStopped())t.rnamespace&&!t.rnamespace.test(a.namespace)||(t.handleObj=a,t.data=a.data,void 0!==(i=((w.event.special[a.origType]||{}).handle||a.handler).apply(o.elem,u))&&!1===(t.result=i)&&(t.preventDefault(),t.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,t),t.result}},handlers:function(e,t){var n,r,i,o,a,s=[],u=t.delegateCount,l=e.target;if(u&&l.nodeType&&!("click"===e.type&&e.button>=1))for(;l!==this;l=l.parentNode||this)if(1===l.nodeType&&("click"!==e.type||!0!==l.disabled)){for(o=[],a={},n=0;n<u;n++)void 0===a[i=(r=t[n]).selector+" "]&&(a[i]=r.needsContext?w(i,this).index(l)>-1:w.find(i,this,null,[l]).length),a[i]&&o.push(r);o.length&&s.push({elem:l,handlers:o})}return l=this,u<t.length&&s.push({elem:l,handlers:t.slice(u)}),s},addProp:function(e,t){Object.defineProperty(w.Event.prototype,e,{enumerable:!0,configurable:!0,get:g(t)?function(){if(this.originalEvent)return t(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[e]},set:function(t){Object.defineProperty(this,e,{enumerable:!0,configurable:!0,writable:!0,value:t})}})},fix:function(e){return e[w.expando]?e:new w.Event(e)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==Se()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===Se()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&N(this,"input"))return this.click(),!1},_default:function(e){return N(e.target,"a")}},beforeunload:{postDispatch:function(e){void 0!==e.result&&e.originalEvent&&(e.originalEvent.returnValue=e.result)}}}},w.removeEvent=function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n)},w.Event=function(e,t){if(!(this instanceof w.Event))return new w.Event(e,t);e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||void 0===e.defaultPrevented&&!1===e.returnValue?Ee:ke,this.target=e.target&&3===e.target.nodeType?e.target.parentNode:e.target,this.currentTarget=e.currentTarget,this.relatedTarget=e.relatedTarget):this.type=e,t&&w.extend(this,t),this.timeStamp=e&&e.timeStamp||Date.now(),this[w.expando]=!0},w.Event.prototype={constructor:w.Event,isDefaultPrevented:ke,isPropagationStopped:ke,isImmediatePropagationStopped:ke,isSimulated:!1,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=Ee,e&&!this.isSimulated&&e.preventDefault()},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=Ee,e&&!this.isSimulated&&e.stopPropagation()},stopImmediatePropagation:function(){var e=this.originalEvent;this.isImmediatePropagationStopped=Ee,e&&!this.isSimulated&&e.stopImmediatePropagation(),this.stopPropagation()}},w.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,"char":!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(e){var t=e.button;return null==e.which&&we.test(e.type)?null!=e.charCode?e.charCode:e.keyCode:!e.which&&void 0!==t&&Te.test(e.type)?1&t?1:2&t?3:4&t?2:0:e.which}},w.event.addProp),w.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(e,t){w.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return i&&(i===r||w.contains(r,i))||(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),w.fn.extend({on:function(e,t,n,r){return De(this,e,t,n,r)},one:function(e,t,n,r){return De(this,e,t,n,r,1)},off:function(e,t,n){var r,i;if(e&&e.preventDefault&&e.handleObj)return r=e.handleObj,w(e.delegateTarget).off(r.namespace?r.origType+"."+r.namespace:r.origType,r.selector,r.handler),this;if("object"==typeof e){for(i in e)this.off(i,t,e[i]);return this}return!1!==t&&"function"!=typeof t||(n=t,t=void 0),!1===n&&(n=ke),this.each(function(){w.event.remove(this,e,n,t)})}});var Ne=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,Ae=/<script|<style|<link/i,je=/checked\s*(?:[^=]|=\s*.checked.)/i,qe=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;function Le(e,t){return N(e,"table")&&N(11!==t.nodeType?t:t.firstChild,"tr")?w(e).children("tbody")[0]||e:e}function He(e){return e.type=(null!==e.getAttribute("type"))+"/"+e.type,e}function Oe(e){return"true/"===(e.type||"").slice(0,5)?e.type=e.type.slice(5):e.removeAttribute("type"),e}function Pe(e,t){var n,r,i,o,a,s,u,l;if(1===t.nodeType){if(J.hasData(e)&&(o=J.access(e),a=J.set(t,o),l=o.events)){delete a.handle,a.events={};for(i in l)for(n=0,r=l[i].length;n<r;n++)w.event.add(t,i,l[i][n])}K.hasData(e)&&(s=K.access(e),u=w.extend({},s),K.set(t,u))}}function Me(e,t){var n=t.nodeName.toLowerCase();"input"===n&&pe.test(e.type)?t.checked=e.checked:"input"!==n&&"textarea"!==n||(t.defaultValue=e.defaultValue)}function Re(e,t,n,r){t=a.apply([],t);var i,o,s,u,l,c,f=0,p=e.length,d=p-1,y=t[0],v=g(y);if(v||p>1&&"string"==typeof y&&!h.checkClone&&je.test(y))return e.each(function(i){var o=e.eq(i);v&&(t[0]=y.call(this,i,o.html())),Re(o,t,n,r)});if(p&&(i=xe(t,e[0].ownerDocument,!1,e,r),o=i.firstChild,1===i.childNodes.length&&(i=o),o||r)){for(u=(s=w.map(ye(i,"script"),He)).length;f<p;f++)l=i,f!==d&&(l=w.clone(l,!0,!0),u&&w.merge(s,ye(l,"script"))),n.call(e[f],l,f);if(u)for(c=s[s.length-1].ownerDocument,w.map(s,Oe),f=0;f<u;f++)l=s[f],he.test(l.type||"")&&!J.access(l,"globalEval")&&w.contains(c,l)&&(l.src&&"module"!==(l.type||"").toLowerCase()?w._evalUrl&&w._evalUrl(l.src):m(l.textContent.replace(qe,""),c,l))}return e}function Ie(e,t,n){for(var r,i=t?w.filter(t,e):e,o=0;null!=(r=i[o]);o++)n||1!==r.nodeType||w.cleanData(ye(r)),r.parentNode&&(n&&w.contains(r.ownerDocument,r)&&ve(ye(r,"script")),r.parentNode.removeChild(r));return e}w.extend({htmlPrefilter:function(e){return e.replace(Ne,"<$1></$2>")},clone:function(e,t,n){var r,i,o,a,s=e.cloneNode(!0),u=w.contains(e.ownerDocument,e);if(!(h.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||w.isXMLDoc(e)))for(a=ye(s),r=0,i=(o=ye(e)).length;r<i;r++)Me(o[r],a[r]);if(t)if(n)for(o=o||ye(e),a=a||ye(s),r=0,i=o.length;r<i;r++)Pe(o[r],a[r]);else Pe(e,s);return(a=ye(s,"script")).length>0&&ve(a,!u&&ye(e,"script")),s},cleanData:function(e){for(var t,n,r,i=w.event.special,o=0;void 0!==(n=e[o]);o++)if(Y(n)){if(t=n[J.expando]){if(t.events)for(r in t.events)i[r]?w.event.remove(n,r):w.removeEvent(n,r,t.handle);n[J.expando]=void 0}n[K.expando]&&(n[K.expando]=void 0)}}}),w.fn.extend({detach:function(e){return Ie(this,e,!0)},remove:function(e){return Ie(this,e)},text:function(e){return z(this,function(e){return void 0===e?w.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=e)})},null,e,arguments.length)},append:function(){return Re(this,arguments,function(e){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||Le(this,e).appendChild(e)})},prepend:function(){return Re(this,arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Le(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return Re(this,arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},empty:function(){for(var e,t=0;null!=(e=this[t]);t++)1===e.nodeType&&(w.cleanData(ye(e,!1)),e.textContent="");return this},clone:function(e,t){return e=null!=e&&e,t=null==t?e:t,this.map(function(){return w.clone(this,e,t)})},html:function(e){return z(this,function(e){var t=this[0]||{},n=0,r=this.length;if(void 0===e&&1===t.nodeType)return t.innerHTML;if("string"==typeof e&&!Ae.test(e)&&!ge[(de.exec(e)||["",""])[1].toLowerCase()]){e=w.htmlPrefilter(e);try{for(;n<r;n++)1===(t=this[n]||{}).nodeType&&(w.cleanData(ye(t,!1)),t.innerHTML=e);t=0}catch(e){}}t&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=[];return Re(this,arguments,function(t){var n=this.parentNode;w.inArray(this,e)<0&&(w.cleanData(ye(this)),n&&n.replaceChild(t,this))},e)}}),w.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){w.fn[e]=function(e){for(var n,r=[],i=w(e),o=i.length-1,a=0;a<=o;a++)n=a===o?this:this.clone(!0),w(i[a])[t](n),s.apply(r,n.get());return this.pushStack(r)}});var We=new RegExp("^("+re+")(?!px)[a-z%]+$","i"),$e=function(t){var n=t.ownerDocument.defaultView;return n&&n.opener||(n=e),n.getComputedStyle(t)},Be=new RegExp(oe.join("|"),"i");!function(){function t(){if(c){l.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",c.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",be.appendChild(l).appendChild(c);var t=e.getComputedStyle(c);i="1%"!==t.top,u=12===n(t.marginLeft),c.style.right="60%",s=36===n(t.right),o=36===n(t.width),c.style.position="absolute",a=36===c.offsetWidth||"absolute",be.removeChild(l),c=null}}function n(e){return Math.round(parseFloat(e))}var i,o,a,s,u,l=r.createElement("div"),c=r.createElement("div");c.style&&(c.style.backgroundClip="content-box",c.cloneNode(!0).style.backgroundClip="",h.clearCloneStyle="content-box"===c.style.backgroundClip,w.extend(h,{boxSizingReliable:function(){return t(),o},pixelBoxStyles:function(){return t(),s},pixelPosition:function(){return t(),i},reliableMarginLeft:function(){return t(),u},scrollboxSize:function(){return t(),a}}))}();function Fe(e,t,n){var r,i,o,a,s=e.style;return(n=n||$e(e))&&(""!==(a=n.getPropertyValue(t)||n[t])||w.contains(e.ownerDocument,e)||(a=w.style(e,t)),!h.pixelBoxStyles()&&We.test(a)&&Be.test(t)&&(r=s.width,i=s.minWidth,o=s.maxWidth,s.minWidth=s.maxWidth=s.width=a,a=n.width,s.width=r,s.minWidth=i,s.maxWidth=o)),void 0!==a?a+"":a}function _e(e,t){return{get:function(){if(!e())return(this.get=t).apply(this,arguments);delete this.get}}}var ze=/^(none|table(?!-c[ea]).+)/,Xe=/^--/,Ue={position:"absolute",visibility:"hidden",display:"block"},Ve={letterSpacing:"0",fontWeight:"400"},Ge=["Webkit","Moz","ms"],Ye=r.createElement("div").style;function Qe(e){if(e in Ye)return e;var t=e[0].toUpperCase()+e.slice(1),n=Ge.length;while(n--)if((e=Ge[n]+t)in Ye)return e}function Je(e){var t=w.cssProps[e];return t||(t=w.cssProps[e]=Qe(e)||e),t}function Ke(e,t,n){var r=ie.exec(t);return r?Math.max(0,r[2]-(n||0))+(r[3]||"px"):t}function Ze(e,t,n,r,i,o){var a="width"===t?1:0,s=0,u=0;if(n===(r?"border":"content"))return 0;for(;a<4;a+=2)"margin"===n&&(u+=w.css(e,n+oe[a],!0,i)),r?("content"===n&&(u-=w.css(e,"padding"+oe[a],!0,i)),"margin"!==n&&(u-=w.css(e,"border"+oe[a]+"Width",!0,i))):(u+=w.css(e,"padding"+oe[a],!0,i),"padding"!==n?u+=w.css(e,"border"+oe[a]+"Width",!0,i):s+=w.css(e,"border"+oe[a]+"Width",!0,i));return!r&&o>=0&&(u+=Math.max(0,Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-o-u-s-.5))),u}function et(e,t,n){var r=$e(e),i=Fe(e,t,r),o="border-box"===w.css(e,"boxSizing",!1,r),a=o;if(We.test(i)){if(!n)return i;i="auto"}return a=a&&(h.boxSizingReliable()||i===e.style[t]),("auto"===i||!parseFloat(i)&&"inline"===w.css(e,"display",!1,r))&&(i=e["offset"+t[0].toUpperCase()+t.slice(1)],a=!0),(i=parseFloat(i)||0)+Ze(e,t,n||(o?"border":"content"),a,r,i)+"px"}w.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Fe(e,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(e,t,n,r){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var i,o,a,s=G(t),u=Xe.test(t),l=e.style;if(u||(t=Je(s)),a=w.cssHooks[t]||w.cssHooks[s],void 0===n)return a&&"get"in a&&void 0!==(i=a.get(e,!1,r))?i:l[t];"string"==(o=typeof n)&&(i=ie.exec(n))&&i[1]&&(n=ue(e,t,i),o="number"),null!=n&&n===n&&("number"===o&&(n+=i&&i[3]||(w.cssNumber[s]?"":"px")),h.clearCloneStyle||""!==n||0!==t.indexOf("background")||(l[t]="inherit"),a&&"set"in a&&void 0===(n=a.set(e,n,r))||(u?l.setProperty(t,n):l[t]=n))}},css:function(e,t,n,r){var i,o,a,s=G(t);return Xe.test(t)||(t=Je(s)),(a=w.cssHooks[t]||w.cssHooks[s])&&"get"in a&&(i=a.get(e,!0,n)),void 0===i&&(i=Fe(e,t,r)),"normal"===i&&t in Ve&&(i=Ve[t]),""===n||n?(o=parseFloat(i),!0===n||isFinite(o)?o||0:i):i}}),w.each(["height","width"],function(e,t){w.cssHooks[t]={get:function(e,n,r){if(n)return!ze.test(w.css(e,"display"))||e.getClientRects().length&&e.getBoundingClientRect().width?et(e,t,r):se(e,Ue,function(){return et(e,t,r)})},set:function(e,n,r){var i,o=$e(e),a="border-box"===w.css(e,"boxSizing",!1,o),s=r&&Ze(e,t,r,a,o);return a&&h.scrollboxSize()===o.position&&(s-=Math.ceil(e["offset"+t[0].toUpperCase()+t.slice(1)]-parseFloat(o[t])-Ze(e,t,"border",!1,o)-.5)),s&&(i=ie.exec(n))&&"px"!==(i[3]||"px")&&(e.style[t]=n,n=w.css(e,t)),Ke(e,n,s)}}}),w.cssHooks.marginLeft=_e(h.reliableMarginLeft,function(e,t){if(t)return(parseFloat(Fe(e,"marginLeft"))||e.getBoundingClientRect().left-se(e,{marginLeft:0},function(){return e.getBoundingClientRect().left}))+"px"}),w.each({margin:"",padding:"",border:"Width"},function(e,t){w.cssHooks[e+t]={expand:function(n){for(var r=0,i={},o="string"==typeof n?n.split(" "):[n];r<4;r++)i[e+oe[r]+t]=o[r]||o[r-2]||o[0];return i}},"margin"!==e&&(w.cssHooks[e+t].set=Ke)}),w.fn.extend({css:function(e,t){return z(this,function(e,t,n){var r,i,o={},a=0;if(Array.isArray(t)){for(r=$e(e),i=t.length;a<i;a++)o[t[a]]=w.css(e,t[a],!1,r);return o}return void 0!==n?w.style(e,t,n):w.css(e,t)},e,t,arguments.length>1)}});function tt(e,t,n,r,i){return new tt.prototype.init(e,t,n,r,i)}w.Tween=tt,tt.prototype={constructor:tt,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||w.easing._default,this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(w.cssNumber[n]?"":"px")},cur:function(){var e=tt.propHooks[this.prop];return e&&e.get?e.get(this):tt.propHooks._default.get(this)},run:function(e){var t,n=tt.propHooks[this.prop];return this.options.duration?this.pos=t=w.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):this.pos=t=e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):tt.propHooks._default.set(this),this}},tt.prototype.init.prototype=tt.prototype,tt.propHooks={_default:{get:function(e){var t;return 1!==e.elem.nodeType||null!=e.elem[e.prop]&&null==e.elem.style[e.prop]?e.elem[e.prop]:(t=w.css(e.elem,e.prop,""))&&"auto"!==t?t:0},set:function(e){w.fx.step[e.prop]?w.fx.step[e.prop](e):1!==e.elem.nodeType||null==e.elem.style[w.cssProps[e.prop]]&&!w.cssHooks[e.prop]?e.elem[e.prop]=e.now:w.style(e.elem,e.prop,e.now+e.unit)}}},tt.propHooks.scrollTop=tt.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},w.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2},_default:"swing"},w.fx=tt.prototype.init,w.fx.step={};var nt,rt,it=/^(?:toggle|show|hide)$/,ot=/queueHooks$/;function at(){rt&&(!1===r.hidden&&e.requestAnimationFrame?e.requestAnimationFrame(at):e.setTimeout(at,w.fx.interval),w.fx.tick())}function st(){return e.setTimeout(function(){nt=void 0}),nt=Date.now()}function ut(e,t){var n,r=0,i={height:e};for(t=t?1:0;r<4;r+=2-t)i["margin"+(n=oe[r])]=i["padding"+n]=e;return t&&(i.opacity=i.width=e),i}function lt(e,t,n){for(var r,i=(pt.tweeners[t]||[]).concat(pt.tweeners["*"]),o=0,a=i.length;o<a;o++)if(r=i[o].call(n,t,e))return r}function ct(e,t,n){var r,i,o,a,s,u,l,c,f="width"in t||"height"in t,p=this,d={},h=e.style,g=e.nodeType&&ae(e),y=J.get(e,"fxshow");n.queue||(null==(a=w._queueHooks(e,"fx")).unqueued&&(a.unqueued=0,s=a.empty.fire,a.empty.fire=function(){a.unqueued||s()}),a.unqueued++,p.always(function(){p.always(function(){a.unqueued--,w.queue(e,"fx").length||a.empty.fire()})}));for(r in t)if(i=t[r],it.test(i)){if(delete t[r],o=o||"toggle"===i,i===(g?"hide":"show")){if("show"!==i||!y||void 0===y[r])continue;g=!0}d[r]=y&&y[r]||w.style(e,r)}if((u=!w.isEmptyObject(t))||!w.isEmptyObject(d)){f&&1===e.nodeType&&(n.overflow=[h.overflow,h.overflowX,h.overflowY],null==(l=y&&y.display)&&(l=J.get(e,"display")),"none"===(c=w.css(e,"display"))&&(l?c=l:(fe([e],!0),l=e.style.display||l,c=w.css(e,"display"),fe([e]))),("inline"===c||"inline-block"===c&&null!=l)&&"none"===w.css(e,"float")&&(u||(p.done(function(){h.display=l}),null==l&&(c=h.display,l="none"===c?"":c)),h.display="inline-block")),n.overflow&&(h.overflow="hidden",p.always(function(){h.overflow=n.overflow[0],h.overflowX=n.overflow[1],h.overflowY=n.overflow[2]})),u=!1;for(r in d)u||(y?"hidden"in y&&(g=y.hidden):y=J.access(e,"fxshow",{display:l}),o&&(y.hidden=!g),g&&fe([e],!0),p.done(function(){g||fe([e]),J.remove(e,"fxshow");for(r in d)w.style(e,r,d[r])})),u=lt(g?y[r]:0,r,p),r in y||(y[r]=u.start,g&&(u.end=u.start,u.start=0))}}function ft(e,t){var n,r,i,o,a;for(n in e)if(r=G(n),i=t[r],o=e[n],Array.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),(a=w.cssHooks[r])&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}function pt(e,t,n){var r,i,o=0,a=pt.prefilters.length,s=w.Deferred().always(function(){delete u.elem}),u=function(){if(i)return!1;for(var t=nt||st(),n=Math.max(0,l.startTime+l.duration-t),r=1-(n/l.duration||0),o=0,a=l.tweens.length;o<a;o++)l.tweens[o].run(r);return s.notifyWith(e,[l,r,n]),r<1&&a?n:(a||s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l]),!1)},l=s.promise({elem:e,props:w.extend({},t),opts:w.extend(!0,{specialEasing:{},easing:w.easing._default},n),originalProperties:t,originalOptions:n,startTime:nt||st(),duration:n.duration,tweens:[],createTween:function(t,n){var r=w.Tween(e,l.opts,t,n,l.opts.specialEasing[t]||l.opts.easing);return l.tweens.push(r),r},stop:function(t){var n=0,r=t?l.tweens.length:0;if(i)return this;for(i=!0;n<r;n++)l.tweens[n].run(1);return t?(s.notifyWith(e,[l,1,0]),s.resolveWith(e,[l,t])):s.rejectWith(e,[l,t]),this}}),c=l.props;for(ft(c,l.opts.specialEasing);o<a;o++)if(r=pt.prefilters[o].call(l,e,c,l.opts))return g(r.stop)&&(w._queueHooks(l.elem,l.opts.queue).stop=r.stop.bind(r)),r;return w.map(c,lt,l),g(l.opts.start)&&l.opts.start.call(e,l),l.progress(l.opts.progress).done(l.opts.done,l.opts.complete).fail(l.opts.fail).always(l.opts.always),w.fx.timer(w.extend(u,{elem:e,anim:l,queue:l.opts.queue})),l}w.Animation=w.extend(pt,{tweeners:{"*":[function(e,t){var n=this.createTween(e,t);return ue(n.elem,e,ie.exec(t),n),n}]},tweener:function(e,t){g(e)?(t=e,e=["*"]):e=e.match(M);for(var n,r=0,i=e.length;r<i;r++)n=e[r],pt.tweeners[n]=pt.tweeners[n]||[],pt.tweeners[n].unshift(t)},prefilters:[ct],prefilter:function(e,t){t?pt.prefilters.unshift(e):pt.prefilters.push(e)}}),w.speed=function(e,t,n){var r=e&&"object"==typeof e?w.extend({},e):{complete:n||!n&&t||g(e)&&e,duration:e,easing:n&&t||t&&!g(t)&&t};return w.fx.off?r.duration=0:"number"!=typeof r.duration&&(r.duration in w.fx.speeds?r.duration=w.fx.speeds[r.duration]:r.duration=w.fx.speeds._default),null!=r.queue&&!0!==r.queue||(r.queue="fx"),r.old=r.complete,r.complete=function(){g(r.old)&&r.old.call(this),r.queue&&w.dequeue(this,r.queue)},r},w.fn.extend({fadeTo:function(e,t,n,r){return this.filter(ae).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=w.isEmptyObject(e),o=w.speed(t,n,r),a=function(){var t=pt(this,w.extend({},e),o);(i||J.get(this,"finish"))&&t.stop(!0)};return a.finish=a,i||!1===o.queue?this.each(a):this.queue(o.queue,a)},stop:function(e,t,n){var r=function(e){var t=e.stop;delete e.stop,t(n)};return"string"!=typeof e&&(n=t,t=e,e=void 0),t&&!1!==e&&this.queue(e||"fx",[]),this.each(function(){var t=!0,i=null!=e&&e+"queueHooks",o=w.timers,a=J.get(this);if(i)a[i]&&a[i].stop&&r(a[i]);else for(i in a)a[i]&&a[i].stop&&ot.test(i)&&r(a[i]);for(i=o.length;i--;)o[i].elem!==this||null!=e&&o[i].queue!==e||(o[i].anim.stop(n),t=!1,o.splice(i,1));!t&&n||w.dequeue(this,e)})},finish:function(e){return!1!==e&&(e=e||"fx"),this.each(function(){var t,n=J.get(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=w.timers,a=r?r.length:0;for(n.finish=!0,w.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;t<a;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}}),w.each(["toggle","show","hide"],function(e,t){var n=w.fn[t];w.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ut(t,!0),e,r,i)}}),w.each({slideDown:ut("show"),slideUp:ut("hide"),slideToggle:ut("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){w.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),w.timers=[],w.fx.tick=function(){var e,t=0,n=w.timers;for(nt=Date.now();t<n.length;t++)(e=n[t])()||n[t]!==e||n.splice(t--,1);n.length||w.fx.stop(),nt=void 0},w.fx.timer=function(e){w.timers.push(e),w.fx.start()},w.fx.interval=13,w.fx.start=function(){rt||(rt=!0,at())},w.fx.stop=function(){rt=null},w.fx.speeds={slow:600,fast:200,_default:400},w.fn.delay=function(t,n){return t=w.fx?w.fx.speeds[t]||t:t,n=n||"fx",this.queue(n,function(n,r){var i=e.setTimeout(n,t);r.stop=function(){e.clearTimeout(i)}})},function(){var e=r.createElement("input"),t=r.createElement("select").appendChild(r.createElement("option"));e.type="checkbox",h.checkOn=""!==e.value,h.optSelected=t.selected,(e=r.createElement("input")).value="t",e.type="radio",h.radioValue="t"===e.value}();var dt,ht=w.expr.attrHandle;w.fn.extend({attr:function(e,t){return z(this,w.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){w.removeAttr(this,e)})}}),w.extend({attr:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return"undefined"==typeof e.getAttribute?w.prop(e,t,n):(1===o&&w.isXMLDoc(e)||(i=w.attrHooks[t.toLowerCase()]||(w.expr.match.bool.test(t)?dt:void 0)),void 0!==n?null===n?void w.removeAttr(e,t):i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:(e.setAttribute(t,n+""),n):i&&"get"in i&&null!==(r=i.get(e,t))?r:null==(r=w.find.attr(e,t))?void 0:r)},attrHooks:{type:{set:function(e,t){if(!h.radioValue&&"radio"===t&&N(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},removeAttr:function(e,t){var n,r=0,i=t&&t.match(M);if(i&&1===e.nodeType)while(n=i[r++])e.removeAttribute(n)}}),dt={set:function(e,t,n){return!1===t?w.removeAttr(e,n):e.setAttribute(n,n),n}},w.each(w.expr.match.bool.source.match(/\w+/g),function(e,t){var n=ht[t]||w.find.attr;ht[t]=function(e,t,r){var i,o,a=t.toLowerCase();return r||(o=ht[a],ht[a]=i,i=null!=n(e,t,r)?a:null,ht[a]=o),i}});var gt=/^(?:input|select|textarea|button)$/i,yt=/^(?:a|area)$/i;w.fn.extend({prop:function(e,t){return z(this,w.prop,e,t,arguments.length>1)},removeProp:function(e){return this.each(function(){delete this[w.propFix[e]||e]})}}),w.extend({prop:function(e,t,n){var r,i,o=e.nodeType;if(3!==o&&8!==o&&2!==o)return 1===o&&w.isXMLDoc(e)||(t=w.propFix[t]||t,i=w.propHooks[t]),void 0!==n?i&&"set"in i&&void 0!==(r=i.set(e,n,t))?r:e[t]=n:i&&"get"in i&&null!==(r=i.get(e,t))?r:e[t]},propHooks:{tabIndex:{get:function(e){var t=w.find.attr(e,"tabindex");return t?parseInt(t,10):gt.test(e.nodeName)||yt.test(e.nodeName)&&e.href?0:-1}}},propFix:{"for":"htmlFor","class":"className"}}),h.optSelected||(w.propHooks.selected={get:function(e){var t=e.parentNode;return t&&t.parentNode&&t.parentNode.selectedIndex,null},set:function(e){var t=e.parentNode;t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex)}}),w.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){w.propFix[this.toLowerCase()]=this});function vt(e){return(e.match(M)||[]).join(" ")}function mt(e){return e.getAttribute&&e.getAttribute("class")||""}function xt(e){return Array.isArray(e)?e:"string"==typeof e?e.match(M)||[]:[]}w.fn.extend({addClass:function(e){var t,n,r,i,o,a,s,u=0;if(g(e))return this.each(function(t){w(this).addClass(e.call(this,t,mt(this)))});if((t=xt(e)).length)while(n=this[u++])if(i=mt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=t[a++])r.indexOf(" "+o+" ")<0&&(r+=o+" ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},removeClass:function(e){var t,n,r,i,o,a,s,u=0;if(g(e))return this.each(function(t){w(this).removeClass(e.call(this,t,mt(this)))});if(!arguments.length)return this.attr("class","");if((t=xt(e)).length)while(n=this[u++])if(i=mt(n),r=1===n.nodeType&&" "+vt(i)+" "){a=0;while(o=t[a++])while(r.indexOf(" "+o+" ")>-1)r=r.replace(" "+o+" "," ");i!==(s=vt(r))&&n.setAttribute("class",s)}return this},toggleClass:function(e,t){var n=typeof e,r="string"===n||Array.isArray(e);return"boolean"==typeof t&&r?t?this.addClass(e):this.removeClass(e):g(e)?this.each(function(n){w(this).toggleClass(e.call(this,n,mt(this),t),t)}):this.each(function(){var t,i,o,a;if(r){i=0,o=w(this),a=xt(e);while(t=a[i++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else void 0!==e&&"boolean"!==n||((t=mt(this))&&J.set(this,"__className__",t),this.setAttribute&&this.setAttribute("class",t||!1===e?"":J.get(this,"__className__")||""))})},hasClass:function(e){var t,n,r=0;t=" "+e+" ";while(n=this[r++])if(1===n.nodeType&&(" "+vt(mt(n))+" ").indexOf(t)>-1)return!0;return!1}});var bt=/\r/g;w.fn.extend({val:function(e){var t,n,r,i=this[0];{if(arguments.length)return r=g(e),this.each(function(n){var i;1===this.nodeType&&(null==(i=r?e.call(this,n,w(this).val()):e)?i="":"number"==typeof i?i+="":Array.isArray(i)&&(i=w.map(i,function(e){return null==e?"":e+""})),(t=w.valHooks[this.type]||w.valHooks[this.nodeName.toLowerCase()])&&"set"in t&&void 0!==t.set(this,i,"value")||(this.value=i))});if(i)return(t=w.valHooks[i.type]||w.valHooks[i.nodeName.toLowerCase()])&&"get"in t&&void 0!==(n=t.get(i,"value"))?n:"string"==typeof(n=i.value)?n.replace(bt,""):null==n?"":n}}}),w.extend({valHooks:{option:{get:function(e){var t=w.find.attr(e,"value");return null!=t?t:vt(w.text(e))}},select:{get:function(e){var t,n,r,i=e.options,o=e.selectedIndex,a="select-one"===e.type,s=a?null:[],u=a?o+1:i.length;for(r=o<0?u:a?o:0;r<u;r++)if(((n=i[r]).selected||r===o)&&!n.disabled&&(!n.parentNode.disabled||!N(n.parentNode,"optgroup"))){if(t=w(n).val(),a)return t;s.push(t)}return s},set:function(e,t){var n,r,i=e.options,o=w.makeArray(t),a=i.length;while(a--)((r=i[a]).selected=w.inArray(w.valHooks.option.get(r),o)>-1)&&(n=!0);return n||(e.selectedIndex=-1),o}}}}),w.each(["radio","checkbox"],function(){w.valHooks[this]={set:function(e,t){if(Array.isArray(t))return e.checked=w.inArray(w(e).val(),t)>-1}},h.checkOn||(w.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})}),h.focusin="onfocusin"in e;var wt=/^(?:focusinfocus|focusoutblur)$/,Tt=function(e){e.stopPropagation()};w.extend(w.event,{trigger:function(t,n,i,o){var a,s,u,l,c,p,d,h,v=[i||r],m=f.call(t,"type")?t.type:t,x=f.call(t,"namespace")?t.namespace.split("."):[];if(s=h=u=i=i||r,3!==i.nodeType&&8!==i.nodeType&&!wt.test(m+w.event.triggered)&&(m.indexOf(".")>-1&&(m=(x=m.split(".")).shift(),x.sort()),c=m.indexOf(":")<0&&"on"+m,t=t[w.expando]?t:new w.Event(m,"object"==typeof t&&t),t.isTrigger=o?2:3,t.namespace=x.join("."),t.rnamespace=t.namespace?new RegExp("(^|\\.)"+x.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,t.result=void 0,t.target||(t.target=i),n=null==n?[t]:w.makeArray(n,[t]),d=w.event.special[m]||{},o||!d.trigger||!1!==d.trigger.apply(i,n))){if(!o&&!d.noBubble&&!y(i)){for(l=d.delegateType||m,wt.test(l+m)||(s=s.parentNode);s;s=s.parentNode)v.push(s),u=s;u===(i.ownerDocument||r)&&v.push(u.defaultView||u.parentWindow||e)}a=0;while((s=v[a++])&&!t.isPropagationStopped())h=s,t.type=a>1?l:d.bindType||m,(p=(J.get(s,"events")||{})[t.type]&&J.get(s,"handle"))&&p.apply(s,n),(p=c&&s[c])&&p.apply&&Y(s)&&(t.result=p.apply(s,n),!1===t.result&&t.preventDefault());return t.type=m,o||t.isDefaultPrevented()||d._default&&!1!==d._default.apply(v.pop(),n)||!Y(i)||c&&g(i[m])&&!y(i)&&((u=i[c])&&(i[c]=null),w.event.triggered=m,t.isPropagationStopped()&&h.addEventListener(m,Tt),i[m](),t.isPropagationStopped()&&h.removeEventListener(m,Tt),w.event.triggered=void 0,u&&(i[c]=u)),t.result}},simulate:function(e,t,n){var r=w.extend(new w.Event,n,{type:e,isSimulated:!0});w.event.trigger(r,null,t)}}),w.fn.extend({trigger:function(e,t){return this.each(function(){w.event.trigger(e,t,this)})},triggerHandler:function(e,t){var n=this[0];if(n)return w.event.trigger(e,t,n,!0)}}),h.focusin||w.each({focus:"focusin",blur:"focusout"},function(e,t){var n=function(e){w.event.simulate(t,e.target,w.event.fix(e))};w.event.special[t]={setup:function(){var r=this.ownerDocument||this,i=J.access(r,t);i||r.addEventListener(e,n,!0),J.access(r,t,(i||0)+1)},teardown:function(){var r=this.ownerDocument||this,i=J.access(r,t)-1;i?J.access(r,t,i):(r.removeEventListener(e,n,!0),J.remove(r,t))}}});var Ct=e.location,Et=Date.now(),kt=/\?/;w.parseXML=function(t){var n;if(!t||"string"!=typeof t)return null;try{n=(new e.DOMParser).parseFromString(t,"text/xml")}catch(e){n=void 0}return n&&!n.getElementsByTagName("parsererror").length||w.error("Invalid XML: "+t),n};var St=/\[\]$/,Dt=/\r?\n/g,Nt=/^(?:submit|button|image|reset|file)$/i,At=/^(?:input|select|textarea|keygen)/i;function jt(e,t,n,r){var i;if(Array.isArray(t))w.each(t,function(t,i){n||St.test(e)?r(e,i):jt(e+"["+("object"==typeof i&&null!=i?t:"")+"]",i,n,r)});else if(n||"object"!==x(t))r(e,t);else for(i in t)jt(e+"["+i+"]",t[i],n,r)}w.param=function(e,t){var n,r=[],i=function(e,t){var n=g(t)?t():t;r[r.length]=encodeURIComponent(e)+"="+encodeURIComponent(null==n?"":n)};if(Array.isArray(e)||e.jquery&&!w.isPlainObject(e))w.each(e,function(){i(this.name,this.value)});else for(n in e)jt(n,e[n],t,i);return r.join("&")},w.fn.extend({serialize:function(){return w.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=w.prop(this,"elements");return e?w.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!w(this).is(":disabled")&&At.test(this.nodeName)&&!Nt.test(e)&&(this.checked||!pe.test(e))}).map(function(e,t){var n=w(this).val();return null==n?null:Array.isArray(n)?w.map(n,function(e){return{name:t.name,value:e.replace(Dt,"\r\n")}}):{name:t.name,value:n.replace(Dt,"\r\n")}}).get()}});var qt=/%20/g,Lt=/#.*$/,Ht=/([?&])_=[^&]*/,Ot=/^(.*?):[ \t]*([^\r\n]*)$/gm,Pt=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Mt=/^(?:GET|HEAD)$/,Rt=/^\/\//,It={},Wt={},$t="*/".concat("*"),Bt=r.createElement("a");Bt.href=Ct.href;function Ft(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(M)||[];if(g(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function _t(e,t,n,r){var i={},o=e===Wt;function a(s){var u;return i[s]=!0,w.each(e[s]||[],function(e,s){var l=s(t,n,r);return"string"!=typeof l||o||i[l]?o?!(u=l):void 0:(t.dataTypes.unshift(l),a(l),!1)}),u}return a(t.dataTypes[0])||!i["*"]&&a("*")}function zt(e,t){var n,r,i=w.ajaxSettings.flatOptions||{};for(n in t)void 0!==t[n]&&((i[n]?e:r||(r={}))[n]=t[n]);return r&&w.extend(!0,e,r),e}function Xt(e,t,n){var r,i,o,a,s=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),void 0===r&&(r=e.mimeType||t.getResponseHeader("Content-Type"));if(r)for(i in s)if(s[i]&&s[i].test(r)){u.unshift(i);break}if(u[0]in n)o=u[0];else{for(i in n){if(!u[0]||e.converters[i+" "+u[0]]){o=i;break}a||(a=i)}o=o||a}if(o)return o!==u[0]&&u.unshift(o),n[o]}function Ut(e,t,n,r){var i,o,a,s,u,l={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)l[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!u&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),u=o,o=c.shift())if("*"===o)o=u;else if("*"!==u&&u!==o){if(!(a=l[u+" "+o]||l["* "+o]))for(i in l)if((s=i.split(" "))[1]===o&&(a=l[u+" "+s[0]]||l["* "+s[0]])){!0===a?a=l[i]:!0!==l[i]&&(o=s[0],c.unshift(s[1]));break}if(!0!==a)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(e){return{state:"parsererror",error:a?e:"No conversion from "+u+" to "+o}}}return{state:"success",data:t}}w.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ct.href,type:"GET",isLocal:Pt.test(Ct.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":$t,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":w.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?zt(zt(e,w.ajaxSettings),t):zt(w.ajaxSettings,e)},ajaxPrefilter:Ft(It),ajaxTransport:Ft(Wt),ajax:function(t,n){"object"==typeof t&&(n=t,t=void 0),n=n||{};var i,o,a,s,u,l,c,f,p,d,h=w.ajaxSetup({},n),g=h.context||h,y=h.context&&(g.nodeType||g.jquery)?w(g):w.event,v=w.Deferred(),m=w.Callbacks("once memory"),x=h.statusCode||{},b={},T={},C="canceled",E={readyState:0,getResponseHeader:function(e){var t;if(c){if(!s){s={};while(t=Ot.exec(a))s[t[1].toLowerCase()]=t[2]}t=s[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return c?a:null},setRequestHeader:function(e,t){return null==c&&(e=T[e.toLowerCase()]=T[e.toLowerCase()]||e,b[e]=t),this},overrideMimeType:function(e){return null==c&&(h.mimeType=e),this},statusCode:function(e){var t;if(e)if(c)E.always(e[E.status]);else for(t in e)x[t]=[x[t],e[t]];return this},abort:function(e){var t=e||C;return i&&i.abort(t),k(0,t),this}};if(v.promise(E),h.url=((t||h.url||Ct.href)+"").replace(Rt,Ct.protocol+"//"),h.type=n.method||n.type||h.method||h.type,h.dataTypes=(h.dataType||"*").toLowerCase().match(M)||[""],null==h.crossDomain){l=r.createElement("a");try{l.href=h.url,l.href=l.href,h.crossDomain=Bt.protocol+"//"+Bt.host!=l.protocol+"//"+l.host}catch(e){h.crossDomain=!0}}if(h.data&&h.processData&&"string"!=typeof h.data&&(h.data=w.param(h.data,h.traditional)),_t(It,h,n,E),c)return E;(f=w.event&&h.global)&&0==w.active++&&w.event.trigger("ajaxStart"),h.type=h.type.toUpperCase(),h.hasContent=!Mt.test(h.type),o=h.url.replace(Lt,""),h.hasContent?h.data&&h.processData&&0===(h.contentType||"").indexOf("application/x-www-form-urlencoded")&&(h.data=h.data.replace(qt,"+")):(d=h.url.slice(o.length),h.data&&(h.processData||"string"==typeof h.data)&&(o+=(kt.test(o)?"&":"?")+h.data,delete h.data),!1===h.cache&&(o=o.replace(Ht,"$1"),d=(kt.test(o)?"&":"?")+"_="+Et+++d),h.url=o+d),h.ifModified&&(w.lastModified[o]&&E.setRequestHeader("If-Modified-Since",w.lastModified[o]),w.etag[o]&&E.setRequestHeader("If-None-Match",w.etag[o])),(h.data&&h.hasContent&&!1!==h.contentType||n.contentType)&&E.setRequestHeader("Content-Type",h.contentType),E.setRequestHeader("Accept",h.dataTypes[0]&&h.accepts[h.dataTypes[0]]?h.accepts[h.dataTypes[0]]+("*"!==h.dataTypes[0]?", "+$t+"; q=0.01":""):h.accepts["*"]);for(p in h.headers)E.setRequestHeader(p,h.headers[p]);if(h.beforeSend&&(!1===h.beforeSend.call(g,E,h)||c))return E.abort();if(C="abort",m.add(h.complete),E.done(h.success),E.fail(h.error),i=_t(Wt,h,n,E)){if(E.readyState=1,f&&y.trigger("ajaxSend",[E,h]),c)return E;h.async&&h.timeout>0&&(u=e.setTimeout(function(){E.abort("timeout")},h.timeout));try{c=!1,i.send(b,k)}catch(e){if(c)throw e;k(-1,e)}}else k(-1,"No Transport");function k(t,n,r,s){var l,p,d,b,T,C=n;c||(c=!0,u&&e.clearTimeout(u),i=void 0,a=s||"",E.readyState=t>0?4:0,l=t>=200&&t<300||304===t,r&&(b=Xt(h,E,r)),b=Ut(h,b,E,l),l?(h.ifModified&&((T=E.getResponseHeader("Last-Modified"))&&(w.lastModified[o]=T),(T=E.getResponseHeader("etag"))&&(w.etag[o]=T)),204===t||"HEAD"===h.type?C="nocontent":304===t?C="notmodified":(C=b.state,p=b.data,l=!(d=b.error))):(d=C,!t&&C||(C="error",t<0&&(t=0))),E.status=t,E.statusText=(n||C)+"",l?v.resolveWith(g,[p,C,E]):v.rejectWith(g,[E,C,d]),E.statusCode(x),x=void 0,f&&y.trigger(l?"ajaxSuccess":"ajaxError",[E,h,l?p:d]),m.fireWith(g,[E,C]),f&&(y.trigger("ajaxComplete",[E,h]),--w.active||w.event.trigger("ajaxStop")))}return E},getJSON:function(e,t,n){return w.get(e,t,n,"json")},getScript:function(e,t){return w.get(e,void 0,t,"script")}}),w.each(["get","post"],function(e,t){w[t]=function(e,n,r,i){return g(n)&&(i=i||r,r=n,n=void 0),w.ajax(w.extend({url:e,type:t,dataType:i,data:n,success:r},w.isPlainObject(e)&&e))}}),w._evalUrl=function(e){return w.ajax({url:e,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,"throws":!0})},w.fn.extend({wrapAll:function(e){var t;return this[0]&&(g(e)&&(e=e.call(this[0])),t=w(e,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstElementChild)e=e.firstElementChild;return e}).append(this)),this},wrapInner:function(e){return g(e)?this.each(function(t){w(this).wrapInner(e.call(this,t))}):this.each(function(){var t=w(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=g(e);return this.each(function(n){w(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(e){return this.parent(e).not("body").each(function(){w(this).replaceWith(this.childNodes)}),this}}),w.expr.pseudos.hidden=function(e){return!w.expr.pseudos.visible(e)},w.expr.pseudos.visible=function(e){return!!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)},w.ajaxSettings.xhr=function(){try{return new e.XMLHttpRequest}catch(e){}};var Vt={0:200,1223:204},Gt=w.ajaxSettings.xhr();h.cors=!!Gt&&"withCredentials"in Gt,h.ajax=Gt=!!Gt,w.ajaxTransport(function(t){var n,r;if(h.cors||Gt&&!t.crossDomain)return{send:function(i,o){var a,s=t.xhr();if(s.open(t.type,t.url,t.async,t.username,t.password),t.xhrFields)for(a in t.xhrFields)s[a]=t.xhrFields[a];t.mimeType&&s.overrideMimeType&&s.overrideMimeType(t.mimeType),t.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");for(a in i)s.setRequestHeader(a,i[a]);n=function(e){return function(){n&&(n=r=s.onload=s.onerror=s.onabort=s.ontimeout=s.onreadystatechange=null,"abort"===e?s.abort():"error"===e?"number"!=typeof s.status?o(0,"error"):o(s.status,s.statusText):o(Vt[s.status]||s.status,s.statusText,"text"!==(s.responseType||"text")||"string"!=typeof s.responseText?{binary:s.response}:{text:s.responseText},s.getAllResponseHeaders()))}},s.onload=n(),r=s.onerror=s.ontimeout=n("error"),void 0!==s.onabort?s.onabort=r:s.onreadystatechange=function(){4===s.readyState&&e.setTimeout(function(){n&&r()})},n=n("abort");try{s.send(t.hasContent&&t.data||null)}catch(e){if(n)throw e}},abort:function(){n&&n()}}}),w.ajaxPrefilter(function(e){e.crossDomain&&(e.contents.script=!1)}),w.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(e){return w.globalEval(e),e}}}),w.ajaxPrefilter("script",function(e){void 0===e.cache&&(e.cache=!1),e.crossDomain&&(e.type="GET")}),w.ajaxTransport("script",function(e){if(e.crossDomain){var t,n;return{send:function(i,o){t=w("<script>").prop({charset:e.scriptCharset,src:e.url}).on("load error",n=function(e){t.remove(),n=null,e&&o("error"===e.type?404:200,e.type)}),r.head.appendChild(t[0])},abort:function(){n&&n()}}}});var Yt=[],Qt=/(=)\?(?=&|$)|\?\?/;w.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Yt.pop()||w.expando+"_"+Et++;return this[e]=!0,e}}),w.ajaxPrefilter("json jsonp",function(t,n,r){var i,o,a,s=!1!==t.jsonp&&(Qt.test(t.url)?"url":"string"==typeof t.data&&0===(t.contentType||"").indexOf("application/x-www-form-urlencoded")&&Qt.test(t.data)&&"data");if(s||"jsonp"===t.dataTypes[0])return i=t.jsonpCallback=g(t.jsonpCallback)?t.jsonpCallback():t.jsonpCallback,s?t[s]=t[s].replace(Qt,"$1"+i):!1!==t.jsonp&&(t.url+=(kt.test(t.url)?"&":"?")+t.jsonp+"="+i),t.converters["script json"]=function(){return a||w.error(i+" was not called"),a[0]},t.dataTypes[0]="json",o=e[i],e[i]=function(){a=arguments},r.always(function(){void 0===o?w(e).removeProp(i):e[i]=o,t[i]&&(t.jsonpCallback=n.jsonpCallback,Yt.push(i)),a&&g(o)&&o(a[0]),a=o=void 0}),"script"}),h.createHTMLDocument=function(){var e=r.implementation.createHTMLDocument("").body;return e.innerHTML="<form></form><form></form>",2===e.childNodes.length}(),w.parseHTML=function(e,t,n){if("string"!=typeof e)return[];"boolean"==typeof t&&(n=t,t=!1);var i,o,a;return t||(h.createHTMLDocument?((i=(t=r.implementation.createHTMLDocument("")).createElement("base")).href=r.location.href,t.head.appendChild(i)):t=r),o=A.exec(e),a=!n&&[],o?[t.createElement(o[1])]:(o=xe([e],t,a),a&&a.length&&w(a).remove(),w.merge([],o.childNodes))},w.fn.load=function(e,t,n){var r,i,o,a=this,s=e.indexOf(" ");return s>-1&&(r=vt(e.slice(s)),e=e.slice(0,s)),g(t)?(n=t,t=void 0):t&&"object"==typeof t&&(i="POST"),a.length>0&&w.ajax({url:e,type:i||"GET",dataType:"html",data:t}).done(function(e){o=arguments,a.html(r?w("<div>").append(w.parseHTML(e)).find(r):e)}).always(n&&function(e,t){a.each(function(){n.apply(this,o||[e.responseText,t,e])})}),this},w.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){w.fn[t]=function(e){return this.on(t,e)}}),w.expr.pseudos.animated=function(e){return w.grep(w.timers,function(t){return e===t.elem}).length},w.offset={setOffset:function(e,t,n){var r,i,o,a,s,u,l,c=w.css(e,"position"),f=w(e),p={};"static"===c&&(e.style.position="relative"),s=f.offset(),o=w.css(e,"top"),u=w.css(e,"left"),(l=("absolute"===c||"fixed"===c)&&(o+u).indexOf("auto")>-1)?(a=(r=f.position()).top,i=r.left):(a=parseFloat(o)||0,i=parseFloat(u)||0),g(t)&&(t=t.call(e,n,w.extend({},s))),null!=t.top&&(p.top=t.top-s.top+a),null!=t.left&&(p.left=t.left-s.left+i),"using"in t?t.using.call(e,p):f.css(p)}},w.fn.extend({offset:function(e){if(arguments.length)return void 0===e?this:this.each(function(t){w.offset.setOffset(this,e,t)});var t,n,r=this[0];if(r)return r.getClientRects().length?(t=r.getBoundingClientRect(),n=r.ownerDocument.defaultView,{top:t.top+n.pageYOffset,left:t.left+n.pageXOffset}):{top:0,left:0}},position:function(){if(this[0]){var e,t,n,r=this[0],i={top:0,left:0};if("fixed"===w.css(r,"position"))t=r.getBoundingClientRect();else{t=this.offset(),n=r.ownerDocument,e=r.offsetParent||n.documentElement;while(e&&(e===n.body||e===n.documentElement)&&"static"===w.css(e,"position"))e=e.parentNode;e&&e!==r&&1===e.nodeType&&((i=w(e).offset()).top+=w.css(e,"borderTopWidth",!0),i.left+=w.css(e,"borderLeftWidth",!0))}return{top:t.top-i.top-w.css(r,"marginTop",!0),left:t.left-i.left-w.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent;while(e&&"static"===w.css(e,"position"))e=e.offsetParent;return e||be})}}),w.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,t){var n="pageYOffset"===t;w.fn[e]=function(r){return z(this,function(e,r,i){var o;if(y(e)?o=e:9===e.nodeType&&(o=e.defaultView),void 0===i)return o?o[t]:e[r];o?o.scrollTo(n?o.pageXOffset:i,n?i:o.pageYOffset):e[r]=i},e,r,arguments.length)}}),w.each(["top","left"],function(e,t){w.cssHooks[t]=_e(h.pixelPosition,function(e,n){if(n)return n=Fe(e,t),We.test(n)?w(e).position()[t]+"px":n})}),w.each({Height:"height",Width:"width"},function(e,t){w.each({padding:"inner"+e,content:t,"":"outer"+e},function(n,r){w.fn[r]=function(i,o){var a=arguments.length&&(n||"boolean"!=typeof i),s=n||(!0===i||!0===o?"margin":"border");return z(this,function(t,n,i){var o;return y(t)?0===r.indexOf("outer")?t["inner"+e]:t.document.documentElement["client"+e]:9===t.nodeType?(o=t.documentElement,Math.max(t.body["scroll"+e],o["scroll"+e],t.body["offset"+e],o["offset"+e],o["client"+e])):void 0===i?w.css(t,n,s):w.style(t,n,i,s)},t,a?i:void 0,a)}})}),w.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(e,t){w.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),w.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)}}),w.fn.extend({bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}}),w.proxy=function(e,t){var n,r,i;if("string"==typeof t&&(n=e[t],t=e,e=n),g(e))return r=o.call(arguments,2),i=function(){return e.apply(t||this,r.concat(o.call(arguments)))},i.guid=e.guid=e.guid||w.guid++,i},w.holdReady=function(e){e?w.readyWait++:w.ready(!0)},w.isArray=Array.isArray,w.parseJSON=JSON.parse,w.nodeName=N,w.isFunction=g,w.isWindow=y,w.camelCase=G,w.type=x,w.now=Date.now,w.isNumeric=function(e){var t=w.type(e);return("number"===t||"string"===t)&&!isNaN(e-parseFloat(e))},"function"==typeof define&&define.amd&&define("jquery",[],function(){return w});var Jt=e.jQuery,Kt=e.$;return w.noConflict=function(t){return e.$===w&&(e.$=Kt),t&&e.jQuery===w&&(e.jQuery=Jt),w},t||(e.jQuery=e.$=w),w});

/*!
  * Bootstrap v5.3.7 (https://getbootstrap.com/)
  * Copyright 2011-2025 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self).bootstrap=e()}(this,(function(){"use strict";const t=new Map,e={set(e,i,n){t.has(e)||t.set(e,new Map);const s=t.get(e);s.has(i)||0===s.size?s.set(i,n):console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(s.keys())[0]}.`)},get:(e,i)=>t.has(e)&&t.get(e).get(i)||null,remove(e,i){if(!t.has(e))return;const n=t.get(e);n.delete(i),0===n.size&&t.delete(e)}},i="transitionend",n=t=>(t&&window.CSS&&window.CSS.escape&&(t=t.replace(/#([^\s"#']+)/g,((t,e)=>`#${CSS.escape(e)}`))),t),s=t=>{t.dispatchEvent(new Event(i))},o=t=>!(!t||"object"!=typeof t)&&(void 0!==t.jquery&&(t=t[0]),void 0!==t.nodeType),r=t=>o(t)?t.jquery?t[0]:t:"string"==typeof t&&t.length>0?document.querySelector(n(t)):null,a=t=>{if(!o(t)||0===t.getClientRects().length)return!1;const e="visible"===getComputedStyle(t).getPropertyValue("visibility"),i=t.closest("details:not([open])");if(!i)return e;if(i!==t){const e=t.closest("summary");if(e&&e.parentNode!==i)return!1;if(null===e)return!1}return e},l=t=>!t||t.nodeType!==Node.ELEMENT_NODE||!!t.classList.contains("disabled")||(void 0!==t.disabled?t.disabled:t.hasAttribute("disabled")&&"false"!==t.getAttribute("disabled")),c=t=>{if(!document.documentElement.attachShadow)return null;if("function"==typeof t.getRootNode){const e=t.getRootNode();return e instanceof ShadowRoot?e:null}return t instanceof ShadowRoot?t:t.parentNode?c(t.parentNode):null},h=()=>{},d=t=>{t.offsetHeight},u=()=>window.jQuery&&!document.body.hasAttribute("data-bs-no-jquery")?window.jQuery:null,f=[],p=()=>"rtl"===document.documentElement.dir,m=t=>{var e;e=()=>{const e=u();if(e){const i=t.NAME,n=e.fn[i];e.fn[i]=t.jQueryInterface,e.fn[i].Constructor=t,e.fn[i].noConflict=()=>(e.fn[i]=n,t.jQueryInterface)}},"loading"===document.readyState?(f.length||document.addEventListener("DOMContentLoaded",(()=>{for(const t of f)t()})),f.push(e)):e()},g=(t,e=[],i=t)=>"function"==typeof t?t.call(...e):i,_=(t,e,n=!0)=>{if(!n)return void g(t);const o=(t=>{if(!t)return 0;let{transitionDuration:e,transitionDelay:i}=window.getComputedStyle(t);const n=Number.parseFloat(e),s=Number.parseFloat(i);return n||s?(e=e.split(",")[0],i=i.split(",")[0],1e3*(Number.parseFloat(e)+Number.parseFloat(i))):0})(e)+5;let r=!1;const a=({target:n})=>{n===e&&(r=!0,e.removeEventListener(i,a),g(t))};e.addEventListener(i,a),setTimeout((()=>{r||s(e)}),o)},b=(t,e,i,n)=>{const s=t.length;let o=t.indexOf(e);return-1===o?!i&&n?t[s-1]:t[0]:(o+=i?1:-1,n&&(o=(o+s)%s),t[Math.max(0,Math.min(o,s-1))])},v=/[^.]*(?=\..*)\.|.*/,y=/\..*/,w=/::\d+$/,A={};let E=1;const T={mouseenter:"mouseover",mouseleave:"mouseout"},C=new Set(["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"]);function O(t,e){return e&&`${e}::${E++}`||t.uidEvent||E++}function x(t){const e=O(t);return t.uidEvent=e,A[e]=A[e]||{},A[e]}function k(t,e,i=null){return Object.values(t).find((t=>t.callable===e&&t.delegationSelector===i))}function L(t,e,i){const n="string"==typeof e,s=n?i:e||i;let o=I(t);return C.has(o)||(o=t),[n,s,o]}function S(t,e,i,n,s){if("string"!=typeof e||!t)return;let[o,r,a]=L(e,i,n);if(e in T){const t=t=>function(e){if(!e.relatedTarget||e.relatedTarget!==e.delegateTarget&&!e.delegateTarget.contains(e.relatedTarget))return t.call(this,e)};r=t(r)}const l=x(t),c=l[a]||(l[a]={}),h=k(c,r,o?i:null);if(h)return void(h.oneOff=h.oneOff&&s);const d=O(r,e.replace(v,"")),u=o?function(t,e,i){return function n(s){const o=t.querySelectorAll(e);for(let{target:r}=s;r&&r!==this;r=r.parentNode)for(const a of o)if(a===r)return P(s,{delegateTarget:r}),n.oneOff&&N.off(t,s.type,e,i),i.apply(r,[s])}}(t,i,r):function(t,e){return function i(n){return P(n,{delegateTarget:t}),i.oneOff&&N.off(t,n.type,e),e.apply(t,[n])}}(t,r);u.delegationSelector=o?i:null,u.callable=r,u.oneOff=s,u.uidEvent=d,c[d]=u,t.addEventListener(a,u,o)}function D(t,e,i,n,s){const o=k(e[i],n,s);o&&(t.removeEventListener(i,o,Boolean(s)),delete e[i][o.uidEvent])}function $(t,e,i,n){const s=e[i]||{};for(const[o,r]of Object.entries(s))o.includes(n)&&D(t,e,i,r.callable,r.delegationSelector)}function I(t){return t=t.replace(y,""),T[t]||t}const N={on(t,e,i,n){S(t,e,i,n,!1)},one(t,e,i,n){S(t,e,i,n,!0)},off(t,e,i,n){if("string"!=typeof e||!t)return;const[s,o,r]=L(e,i,n),a=r!==e,l=x(t),c=l[r]||{},h=e.startsWith(".");if(void 0===o){if(h)for(const i of Object.keys(l))$(t,l,i,e.slice(1));for(const[i,n]of Object.entries(c)){const s=i.replace(w,"");a&&!e.includes(s)||D(t,l,r,n.callable,n.delegationSelector)}}else{if(!Object.keys(c).length)return;D(t,l,r,o,s?i:null)}},trigger(t,e,i){if("string"!=typeof e||!t)return null;const n=u();let s=null,o=!0,r=!0,a=!1;e!==I(e)&&n&&(s=n.Event(e,i),n(t).trigger(s),o=!s.isPropagationStopped(),r=!s.isImmediatePropagationStopped(),a=s.isDefaultPrevented());const l=P(new Event(e,{bubbles:o,cancelable:!0}),i);return a&&l.preventDefault(),r&&t.dispatchEvent(l),l.defaultPrevented&&s&&s.preventDefault(),l}};function P(t,e={}){for(const[i,n]of Object.entries(e))try{t[i]=n}catch(e){Object.defineProperty(t,i,{configurable:!0,get:()=>n})}return t}function j(t){if("true"===t)return!0;if("false"===t)return!1;if(t===Number(t).toString())return Number(t);if(""===t||"null"===t)return null;if("string"!=typeof t)return t;try{return JSON.parse(decodeURIComponent(t))}catch(e){return t}}function M(t){return t.replace(/[A-Z]/g,(t=>`-${t.toLowerCase()}`))}const F={setDataAttribute(t,e,i){t.setAttribute(`data-bs-${M(e)}`,i)},removeDataAttribute(t,e){t.removeAttribute(`data-bs-${M(e)}`)},getDataAttributes(t){if(!t)return{};const e={},i=Object.keys(t.dataset).filter((t=>t.startsWith("bs")&&!t.startsWith("bsConfig")));for(const n of i){let i=n.replace(/^bs/,"");i=i.charAt(0).toLowerCase()+i.slice(1),e[i]=j(t.dataset[n])}return e},getDataAttribute:(t,e)=>j(t.getAttribute(`data-bs-${M(e)}`))};class H{static get Default(){return{}}static get DefaultType(){return{}}static get NAME(){throw new Error('You have to implement the static method "NAME", for each component!')}_getConfig(t){return t=this._mergeConfigObj(t),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}_configAfterMerge(t){return t}_mergeConfigObj(t,e){const i=o(e)?F.getDataAttribute(e,"config"):{};return{...this.constructor.Default,..."object"==typeof i?i:{},...o(e)?F.getDataAttributes(e):{},..."object"==typeof t?t:{}}}_typeCheckConfig(t,e=this.constructor.DefaultType){for(const[n,s]of Object.entries(e)){const e=t[n],r=o(e)?"element":null==(i=e)?`${i}`:Object.prototype.toString.call(i).match(/\s([a-z]+)/i)[1].toLowerCase();if(!new RegExp(s).test(r))throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${n}" provided type "${r}" but expected type "${s}".`)}var i}}class W extends H{constructor(t,i){super(),(t=r(t))&&(this._element=t,this._config=this._getConfig(i),e.set(this._element,this.constructor.DATA_KEY,this))}dispose(){e.remove(this._element,this.constructor.DATA_KEY),N.off(this._element,this.constructor.EVENT_KEY);for(const t of Object.getOwnPropertyNames(this))this[t]=null}_queueCallback(t,e,i=!0){_(t,e,i)}_getConfig(t){return t=this._mergeConfigObj(t,this._element),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}static getInstance(t){return e.get(r(t),this.DATA_KEY)}static getOrCreateInstance(t,e={}){return this.getInstance(t)||new this(t,"object"==typeof e?e:null)}static get VERSION(){return"5.3.7"}static get DATA_KEY(){return`bs.${this.NAME}`}static get EVENT_KEY(){return`.${this.DATA_KEY}`}static eventName(t){return`${t}${this.EVENT_KEY}`}}const B=t=>{let e=t.getAttribute("data-bs-target");if(!e||"#"===e){let i=t.getAttribute("href");if(!i||!i.includes("#")&&!i.startsWith("."))return null;i.includes("#")&&!i.startsWith("#")&&(i=`#${i.split("#")[1]}`),e=i&&"#"!==i?i.trim():null}return e?e.split(",").map((t=>n(t))).join(","):null},z={find:(t,e=document.documentElement)=>[].concat(...Element.prototype.querySelectorAll.call(e,t)),findOne:(t,e=document.documentElement)=>Element.prototype.querySelector.call(e,t),children:(t,e)=>[].concat(...t.children).filter((t=>t.matches(e))),parents(t,e){const i=[];let n=t.parentNode.closest(e);for(;n;)i.push(n),n=n.parentNode.closest(e);return i},prev(t,e){let i=t.previousElementSibling;for(;i;){if(i.matches(e))return[i];i=i.previousElementSibling}return[]},next(t,e){let i=t.nextElementSibling;for(;i;){if(i.matches(e))return[i];i=i.nextElementSibling}return[]},focusableChildren(t){const e=["a","button","input","textarea","select","details","[tabindex]",'[contenteditable="true"]'].map((t=>`${t}:not([tabindex^="-"])`)).join(",");return this.find(e,t).filter((t=>!l(t)&&a(t)))},getSelectorFromElement(t){const e=B(t);return e&&z.findOne(e)?e:null},getElementFromSelector(t){const e=B(t);return e?z.findOne(e):null},getMultipleElementsFromSelector(t){const e=B(t);return e?z.find(e):[]}},R=(t,e="hide")=>{const i=`click.dismiss${t.EVENT_KEY}`,n=t.NAME;N.on(document,i,`[data-bs-dismiss="${n}"]`,(function(i){if(["A","AREA"].includes(this.tagName)&&i.preventDefault(),l(this))return;const s=z.getElementFromSelector(this)||this.closest(`.${n}`);t.getOrCreateInstance(s)[e]()}))},q=".bs.alert",V=`close${q}`,K=`closed${q}`;class Q extends W{static get NAME(){return"alert"}close(){if(N.trigger(this._element,V).defaultPrevented)return;this._element.classList.remove("show");const t=this._element.classList.contains("fade");this._queueCallback((()=>this._destroyElement()),this._element,t)}_destroyElement(){this._element.remove(),N.trigger(this._element,K),this.dispose()}static jQueryInterface(t){return this.each((function(){const e=Q.getOrCreateInstance(this);if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t](this)}}))}}R(Q,"close"),m(Q);const X='[data-bs-toggle="button"]';class Y extends W{static get NAME(){return"button"}toggle(){this._element.setAttribute("aria-pressed",this._element.classList.toggle("active"))}static jQueryInterface(t){return this.each((function(){const e=Y.getOrCreateInstance(this);"toggle"===t&&e[t]()}))}}N.on(document,"click.bs.button.data-api",X,(t=>{t.preventDefault();const e=t.target.closest(X);Y.getOrCreateInstance(e).toggle()})),m(Y);const U=".bs.swipe",G=`touchstart${U}`,J=`touchmove${U}`,Z=`touchend${U}`,tt=`pointerdown${U}`,et=`pointerup${U}`,it={endCallback:null,leftCallback:null,rightCallback:null},nt={endCallback:"(function|null)",leftCallback:"(function|null)",rightCallback:"(function|null)"};class st extends H{constructor(t,e){super(),this._element=t,t&&st.isSupported()&&(this._config=this._getConfig(e),this._deltaX=0,this._supportPointerEvents=Boolean(window.PointerEvent),this._initEvents())}static get Default(){return it}static get DefaultType(){return nt}static get NAME(){return"swipe"}dispose(){N.off(this._element,U)}_start(t){this._supportPointerEvents?this._eventIsPointerPenTouch(t)&&(this._deltaX=t.clientX):this._deltaX=t.touches[0].clientX}_end(t){this._eventIsPointerPenTouch(t)&&(this._deltaX=t.clientX-this._deltaX),this._handleSwipe(),g(this._config.endCallback)}_move(t){this._deltaX=t.touches&&t.touches.length>1?0:t.touches[0].clientX-this._deltaX}_handleSwipe(){const t=Math.abs(this._deltaX);if(t<=40)return;const e=t/this._deltaX;this._deltaX=0,e&&g(e>0?this._config.rightCallback:this._config.leftCallback)}_initEvents(){this._supportPointerEvents?(N.on(this._element,tt,(t=>this._start(t))),N.on(this._element,et,(t=>this._end(t))),this._element.classList.add("pointer-event")):(N.on(this._element,G,(t=>this._start(t))),N.on(this._element,J,(t=>this._move(t))),N.on(this._element,Z,(t=>this._end(t))))}_eventIsPointerPenTouch(t){return this._supportPointerEvents&&("pen"===t.pointerType||"touch"===t.pointerType)}static isSupported(){return"ontouchstart"in document.documentElement||navigator.maxTouchPoints>0}}const ot=".bs.carousel",rt=".data-api",at="ArrowLeft",lt="ArrowRight",ct="next",ht="prev",dt="left",ut="right",ft=`slide${ot}`,pt=`slid${ot}`,mt=`keydown${ot}`,gt=`mouseenter${ot}`,_t=`mouseleave${ot}`,bt=`dragstart${ot}`,vt=`load${ot}${rt}`,yt=`click${ot}${rt}`,wt="carousel",At="active",Et=".active",Tt=".carousel-item",Ct=Et+Tt,Ot={[at]:ut,[lt]:dt},xt={interval:5e3,keyboard:!0,pause:"hover",ride:!1,touch:!0,wrap:!0},kt={interval:"(number|boolean)",keyboard:"boolean",pause:"(string|boolean)",ride:"(boolean|string)",touch:"boolean",wrap:"boolean"};class Lt extends W{constructor(t,e){super(t,e),this._interval=null,this._activeElement=null,this._isSliding=!1,this.touchTimeout=null,this._swipeHelper=null,this._indicatorsElement=z.findOne(".carousel-indicators",this._element),this._addEventListeners(),this._config.ride===wt&&this.cycle()}static get Default(){return xt}static get DefaultType(){return kt}static get NAME(){return"carousel"}next(){this._slide(ct)}nextWhenVisible(){!document.hidden&&a(this._element)&&this.next()}prev(){this._slide(ht)}pause(){this._isSliding&&s(this._element),this._clearInterval()}cycle(){this._clearInterval(),this._updateInterval(),this._interval=setInterval((()=>this.nextWhenVisible()),this._config.interval)}_maybeEnableCycle(){this._config.ride&&(this._isSliding?N.one(this._element,pt,(()=>this.cycle())):this.cycle())}to(t){const e=this._getItems();if(t>e.length-1||t<0)return;if(this._isSliding)return void N.one(this._element,pt,(()=>this.to(t)));const i=this._getItemIndex(this._getActive());if(i===t)return;const n=t>i?ct:ht;this._slide(n,e[t])}dispose(){this._swipeHelper&&this._swipeHelper.dispose(),super.dispose()}_configAfterMerge(t){return t.defaultInterval=t.interval,t}_addEventListeners(){this._config.keyboard&&N.on(this._element,mt,(t=>this._keydown(t))),"hover"===this._config.pause&&(N.on(this._element,gt,(()=>this.pause())),N.on(this._element,_t,(()=>this._maybeEnableCycle()))),this._config.touch&&st.isSupported()&&this._addTouchEventListeners()}_addTouchEventListeners(){for(const t of z.find(".carousel-item img",this._element))N.on(t,bt,(t=>t.preventDefault()));const t={leftCallback:()=>this._slide(this._directionToOrder(dt)),rightCallback:()=>this._slide(this._directionToOrder(ut)),endCallback:()=>{"hover"===this._config.pause&&(this.pause(),this.touchTimeout&&clearTimeout(this.touchTimeout),this.touchTimeout=setTimeout((()=>this._maybeEnableCycle()),500+this._config.interval))}};this._swipeHelper=new st(this._element,t)}_keydown(t){if(/input|textarea/i.test(t.target.tagName))return;const e=Ot[t.key];e&&(t.preventDefault(),this._slide(this._directionToOrder(e)))}_getItemIndex(t){return this._getItems().indexOf(t)}_setActiveIndicatorElement(t){if(!this._indicatorsElement)return;const e=z.findOne(Et,this._indicatorsElement);e.classList.remove(At),e.removeAttribute("aria-current");const i=z.findOne(`[data-bs-slide-to="${t}"]`,this._indicatorsElement);i&&(i.classList.add(At),i.setAttribute("aria-current","true"))}_updateInterval(){const t=this._activeElement||this._getActive();if(!t)return;const e=Number.parseInt(t.getAttribute("data-bs-interval"),10);this._config.interval=e||this._config.defaultInterval}_slide(t,e=null){if(this._isSliding)return;const i=this._getActive(),n=t===ct,s=e||b(this._getItems(),i,n,this._config.wrap);if(s===i)return;const o=this._getItemIndex(s),r=e=>N.trigger(this._element,e,{relatedTarget:s,direction:this._orderToDirection(t),from:this._getItemIndex(i),to:o});if(r(ft).defaultPrevented)return;if(!i||!s)return;const a=Boolean(this._interval);this.pause(),this._isSliding=!0,this._setActiveIndicatorElement(o),this._activeElement=s;const l=n?"carousel-item-start":"carousel-item-end",c=n?"carousel-item-next":"carousel-item-prev";s.classList.add(c),d(s),i.classList.add(l),s.classList.add(l),this._queueCallback((()=>{s.classList.remove(l,c),s.classList.add(At),i.classList.remove(At,c,l),this._isSliding=!1,r(pt)}),i,this._isAnimated()),a&&this.cycle()}_isAnimated(){return this._element.classList.contains("slide")}_getActive(){return z.findOne(Ct,this._element)}_getItems(){return z.find(Tt,this._element)}_clearInterval(){this._interval&&(clearInterval(this._interval),this._interval=null)}_directionToOrder(t){return p()?t===dt?ht:ct:t===dt?ct:ht}_orderToDirection(t){return p()?t===ht?dt:ut:t===ht?ut:dt}static jQueryInterface(t){return this.each((function(){const e=Lt.getOrCreateInstance(this,t);if("number"!=typeof t){if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t]()}}else e.to(t)}))}}N.on(document,yt,"[data-bs-slide], [data-bs-slide-to]",(function(t){const e=z.getElementFromSelector(this);if(!e||!e.classList.contains(wt))return;t.preventDefault();const i=Lt.getOrCreateInstance(e),n=this.getAttribute("data-bs-slide-to");return n?(i.to(n),void i._maybeEnableCycle()):"next"===F.getDataAttribute(this,"slide")?(i.next(),void i._maybeEnableCycle()):(i.prev(),void i._maybeEnableCycle())})),N.on(window,vt,(()=>{const t=z.find('[data-bs-ride="carousel"]');for(const e of t)Lt.getOrCreateInstance(e)})),m(Lt);const St=".bs.collapse",Dt=`show${St}`,$t=`shown${St}`,It=`hide${St}`,Nt=`hidden${St}`,Pt=`click${St}.data-api`,jt="show",Mt="collapse",Ft="collapsing",Ht=`:scope .${Mt} .${Mt}`,Wt='[data-bs-toggle="collapse"]',Bt={parent:null,toggle:!0},zt={parent:"(null|element)",toggle:"boolean"};class Rt extends W{constructor(t,e){super(t,e),this._isTransitioning=!1,this._triggerArray=[];const i=z.find(Wt);for(const t of i){const e=z.getSelectorFromElement(t),i=z.find(e).filter((t=>t===this._element));null!==e&&i.length&&this._triggerArray.push(t)}this._initializeChildren(),this._config.parent||this._addAriaAndCollapsedClass(this._triggerArray,this._isShown()),this._config.toggle&&this.toggle()}static get Default(){return Bt}static get DefaultType(){return zt}static get NAME(){return"collapse"}toggle(){this._isShown()?this.hide():this.show()}show(){if(this._isTransitioning||this._isShown())return;let t=[];if(this._config.parent&&(t=this._getFirstLevelChildren(".collapse.show, .collapse.collapsing").filter((t=>t!==this._element)).map((t=>Rt.getOrCreateInstance(t,{toggle:!1})))),t.length&&t[0]._isTransitioning)return;if(N.trigger(this._element,Dt).defaultPrevented)return;for(const e of t)e.hide();const e=this._getDimension();this._element.classList.remove(Mt),this._element.classList.add(Ft),this._element.style[e]=0,this._addAriaAndCollapsedClass(this._triggerArray,!0),this._isTransitioning=!0;const i=`scroll${e[0].toUpperCase()+e.slice(1)}`;this._queueCallback((()=>{this._isTransitioning=!1,this._element.classList.remove(Ft),this._element.classList.add(Mt,jt),this._element.style[e]="",N.trigger(this._element,$t)}),this._element,!0),this._element.style[e]=`${this._element[i]}px`}hide(){if(this._isTransitioning||!this._isShown())return;if(N.trigger(this._element,It).defaultPrevented)return;const t=this._getDimension();this._element.style[t]=`${this._element.getBoundingClientRect()[t]}px`,d(this._element),this._element.classList.add(Ft),this._element.classList.remove(Mt,jt);for(const t of this._triggerArray){const e=z.getElementFromSelector(t);e&&!this._isShown(e)&&this._addAriaAndCollapsedClass([t],!1)}this._isTransitioning=!0,this._element.style[t]="",this._queueCallback((()=>{this._isTransitioning=!1,this._element.classList.remove(Ft),this._element.classList.add(Mt),N.trigger(this._element,Nt)}),this._element,!0)}_isShown(t=this._element){return t.classList.contains(jt)}_configAfterMerge(t){return t.toggle=Boolean(t.toggle),t.parent=r(t.parent),t}_getDimension(){return this._element.classList.contains("collapse-horizontal")?"width":"height"}_initializeChildren(){if(!this._config.parent)return;const t=this._getFirstLevelChildren(Wt);for(const e of t){const t=z.getElementFromSelector(e);t&&this._addAriaAndCollapsedClass([e],this._isShown(t))}}_getFirstLevelChildren(t){const e=z.find(Ht,this._config.parent);return z.find(t,this._config.parent).filter((t=>!e.includes(t)))}_addAriaAndCollapsedClass(t,e){if(t.length)for(const i of t)i.classList.toggle("collapsed",!e),i.setAttribute("aria-expanded",e)}static jQueryInterface(t){const e={};return"string"==typeof t&&/show|hide/.test(t)&&(e.toggle=!1),this.each((function(){const i=Rt.getOrCreateInstance(this,e);if("string"==typeof t){if(void 0===i[t])throw new TypeError(`No method named "${t}"`);i[t]()}}))}}N.on(document,Pt,Wt,(function(t){("A"===t.target.tagName||t.delegateTarget&&"A"===t.delegateTarget.tagName)&&t.preventDefault();for(const t of z.getMultipleElementsFromSelector(this))Rt.getOrCreateInstance(t,{toggle:!1}).toggle()})),m(Rt);var qt="top",Vt="bottom",Kt="right",Qt="left",Xt="auto",Yt=[qt,Vt,Kt,Qt],Ut="start",Gt="end",Jt="clippingParents",Zt="viewport",te="popper",ee="reference",ie=Yt.reduce((function(t,e){return t.concat([e+"-"+Ut,e+"-"+Gt])}),[]),ne=[].concat(Yt,[Xt]).reduce((function(t,e){return t.concat([e,e+"-"+Ut,e+"-"+Gt])}),[]),se="beforeRead",oe="read",re="afterRead",ae="beforeMain",le="main",ce="afterMain",he="beforeWrite",de="write",ue="afterWrite",fe=[se,oe,re,ae,le,ce,he,de,ue];function pe(t){return t?(t.nodeName||"").toLowerCase():null}function me(t){if(null==t)return window;if("[object Window]"!==t.toString()){var e=t.ownerDocument;return e&&e.defaultView||window}return t}function ge(t){return t instanceof me(t).Element||t instanceof Element}function _e(t){return t instanceof me(t).HTMLElement||t instanceof HTMLElement}function be(t){return"undefined"!=typeof ShadowRoot&&(t instanceof me(t).ShadowRoot||t instanceof ShadowRoot)}const ve={name:"applyStyles",enabled:!0,phase:"write",fn:function(t){var e=t.state;Object.keys(e.elements).forEach((function(t){var i=e.styles[t]||{},n=e.attributes[t]||{},s=e.elements[t];_e(s)&&pe(s)&&(Object.assign(s.style,i),Object.keys(n).forEach((function(t){var e=n[t];!1===e?s.removeAttribute(t):s.setAttribute(t,!0===e?"":e)})))}))},effect:function(t){var e=t.state,i={popper:{position:e.options.strategy,left:"0",top:"0",margin:"0"},arrow:{position:"absolute"},reference:{}};return Object.assign(e.elements.popper.style,i.popper),e.styles=i,e.elements.arrow&&Object.assign(e.elements.arrow.style,i.arrow),function(){Object.keys(e.elements).forEach((function(t){var n=e.elements[t],s=e.attributes[t]||{},o=Object.keys(e.styles.hasOwnProperty(t)?e.styles[t]:i[t]).reduce((function(t,e){return t[e]="",t}),{});_e(n)&&pe(n)&&(Object.assign(n.style,o),Object.keys(s).forEach((function(t){n.removeAttribute(t)})))}))}},requires:["computeStyles"]};function ye(t){return t.split("-")[0]}var we=Math.max,Ae=Math.min,Ee=Math.round;function Te(){var t=navigator.userAgentData;return null!=t&&t.brands&&Array.isArray(t.brands)?t.brands.map((function(t){return t.brand+"/"+t.version})).join(" "):navigator.userAgent}function Ce(){return!/^((?!chrome|android).)*safari/i.test(Te())}function Oe(t,e,i){void 0===e&&(e=!1),void 0===i&&(i=!1);var n=t.getBoundingClientRect(),s=1,o=1;e&&_e(t)&&(s=t.offsetWidth>0&&Ee(n.width)/t.offsetWidth||1,o=t.offsetHeight>0&&Ee(n.height)/t.offsetHeight||1);var r=(ge(t)?me(t):window).visualViewport,a=!Ce()&&i,l=(n.left+(a&&r?r.offsetLeft:0))/s,c=(n.top+(a&&r?r.offsetTop:0))/o,h=n.width/s,d=n.height/o;return{width:h,height:d,top:c,right:l+h,bottom:c+d,left:l,x:l,y:c}}function xe(t){var e=Oe(t),i=t.offsetWidth,n=t.offsetHeight;return Math.abs(e.width-i)<=1&&(i=e.width),Math.abs(e.height-n)<=1&&(n=e.height),{x:t.offsetLeft,y:t.offsetTop,width:i,height:n}}function ke(t,e){var i=e.getRootNode&&e.getRootNode();if(t.contains(e))return!0;if(i&&be(i)){var n=e;do{if(n&&t.isSameNode(n))return!0;n=n.parentNode||n.host}while(n)}return!1}function Le(t){return me(t).getComputedStyle(t)}function Se(t){return["table","td","th"].indexOf(pe(t))>=0}function De(t){return((ge(t)?t.ownerDocument:t.document)||window.document).documentElement}function $e(t){return"html"===pe(t)?t:t.assignedSlot||t.parentNode||(be(t)?t.host:null)||De(t)}function Ie(t){return _e(t)&&"fixed"!==Le(t).position?t.offsetParent:null}function Ne(t){for(var e=me(t),i=Ie(t);i&&Se(i)&&"static"===Le(i).position;)i=Ie(i);return i&&("html"===pe(i)||"body"===pe(i)&&"static"===Le(i).position)?e:i||function(t){var e=/firefox/i.test(Te());if(/Trident/i.test(Te())&&_e(t)&&"fixed"===Le(t).position)return null;var i=$e(t);for(be(i)&&(i=i.host);_e(i)&&["html","body"].indexOf(pe(i))<0;){var n=Le(i);if("none"!==n.transform||"none"!==n.perspective||"paint"===n.contain||-1!==["transform","perspective"].indexOf(n.willChange)||e&&"filter"===n.willChange||e&&n.filter&&"none"!==n.filter)return i;i=i.parentNode}return null}(t)||e}function Pe(t){return["top","bottom"].indexOf(t)>=0?"x":"y"}function je(t,e,i){return we(t,Ae(e,i))}function Me(t){return Object.assign({},{top:0,right:0,bottom:0,left:0},t)}function Fe(t,e){return e.reduce((function(e,i){return e[i]=t,e}),{})}const He={name:"arrow",enabled:!0,phase:"main",fn:function(t){var e,i=t.state,n=t.name,s=t.options,o=i.elements.arrow,r=i.modifiersData.popperOffsets,a=ye(i.placement),l=Pe(a),c=[Qt,Kt].indexOf(a)>=0?"height":"width";if(o&&r){var h=function(t,e){return Me("number"!=typeof(t="function"==typeof t?t(Object.assign({},e.rects,{placement:e.placement})):t)?t:Fe(t,Yt))}(s.padding,i),d=xe(o),u="y"===l?qt:Qt,f="y"===l?Vt:Kt,p=i.rects.reference[c]+i.rects.reference[l]-r[l]-i.rects.popper[c],m=r[l]-i.rects.reference[l],g=Ne(o),_=g?"y"===l?g.clientHeight||0:g.clientWidth||0:0,b=p/2-m/2,v=h[u],y=_-d[c]-h[f],w=_/2-d[c]/2+b,A=je(v,w,y),E=l;i.modifiersData[n]=((e={})[E]=A,e.centerOffset=A-w,e)}},effect:function(t){var e=t.state,i=t.options.element,n=void 0===i?"[data-popper-arrow]":i;null!=n&&("string"!=typeof n||(n=e.elements.popper.querySelector(n)))&&ke(e.elements.popper,n)&&(e.elements.arrow=n)},requires:["popperOffsets"],requiresIfExists:["preventOverflow"]};function We(t){return t.split("-")[1]}var Be={top:"auto",right:"auto",bottom:"auto",left:"auto"};function ze(t){var e,i=t.popper,n=t.popperRect,s=t.placement,o=t.variation,r=t.offsets,a=t.position,l=t.gpuAcceleration,c=t.adaptive,h=t.roundOffsets,d=t.isFixed,u=r.x,f=void 0===u?0:u,p=r.y,m=void 0===p?0:p,g="function"==typeof h?h({x:f,y:m}):{x:f,y:m};f=g.x,m=g.y;var _=r.hasOwnProperty("x"),b=r.hasOwnProperty("y"),v=Qt,y=qt,w=window;if(c){var A=Ne(i),E="clientHeight",T="clientWidth";A===me(i)&&"static"!==Le(A=De(i)).position&&"absolute"===a&&(E="scrollHeight",T="scrollWidth"),(s===qt||(s===Qt||s===Kt)&&o===Gt)&&(y=Vt,m-=(d&&A===w&&w.visualViewport?w.visualViewport.height:A[E])-n.height,m*=l?1:-1),s!==Qt&&(s!==qt&&s!==Vt||o!==Gt)||(v=Kt,f-=(d&&A===w&&w.visualViewport?w.visualViewport.width:A[T])-n.width,f*=l?1:-1)}var C,O=Object.assign({position:a},c&&Be),x=!0===h?function(t,e){var i=t.x,n=t.y,s=e.devicePixelRatio||1;return{x:Ee(i*s)/s||0,y:Ee(n*s)/s||0}}({x:f,y:m},me(i)):{x:f,y:m};return f=x.x,m=x.y,l?Object.assign({},O,((C={})[y]=b?"0":"",C[v]=_?"0":"",C.transform=(w.devicePixelRatio||1)<=1?"translate("+f+"px, "+m+"px)":"translate3d("+f+"px, "+m+"px, 0)",C)):Object.assign({},O,((e={})[y]=b?m+"px":"",e[v]=_?f+"px":"",e.transform="",e))}const Re={name:"computeStyles",enabled:!0,phase:"beforeWrite",fn:function(t){var e=t.state,i=t.options,n=i.gpuAcceleration,s=void 0===n||n,o=i.adaptive,r=void 0===o||o,a=i.roundOffsets,l=void 0===a||a,c={placement:ye(e.placement),variation:We(e.placement),popper:e.elements.popper,popperRect:e.rects.popper,gpuAcceleration:s,isFixed:"fixed"===e.options.strategy};null!=e.modifiersData.popperOffsets&&(e.styles.popper=Object.assign({},e.styles.popper,ze(Object.assign({},c,{offsets:e.modifiersData.popperOffsets,position:e.options.strategy,adaptive:r,roundOffsets:l})))),null!=e.modifiersData.arrow&&(e.styles.arrow=Object.assign({},e.styles.arrow,ze(Object.assign({},c,{offsets:e.modifiersData.arrow,position:"absolute",adaptive:!1,roundOffsets:l})))),e.attributes.popper=Object.assign({},e.attributes.popper,{"data-popper-placement":e.placement})},data:{}};var qe={passive:!0};const Ve={name:"eventListeners",enabled:!0,phase:"write",fn:function(){},effect:function(t){var e=t.state,i=t.instance,n=t.options,s=n.scroll,o=void 0===s||s,r=n.resize,a=void 0===r||r,l=me(e.elements.popper),c=[].concat(e.scrollParents.reference,e.scrollParents.popper);return o&&c.forEach((function(t){t.addEventListener("scroll",i.update,qe)})),a&&l.addEventListener("resize",i.update,qe),function(){o&&c.forEach((function(t){t.removeEventListener("scroll",i.update,qe)})),a&&l.removeEventListener("resize",i.update,qe)}},data:{}};var Ke={left:"right",right:"left",bottom:"top",top:"bottom"};function Qe(t){return t.replace(/left|right|bottom|top/g,(function(t){return Ke[t]}))}var Xe={start:"end",end:"start"};function Ye(t){return t.replace(/start|end/g,(function(t){return Xe[t]}))}function Ue(t){var e=me(t);return{scrollLeft:e.pageXOffset,scrollTop:e.pageYOffset}}function Ge(t){return Oe(De(t)).left+Ue(t).scrollLeft}function Je(t){var e=Le(t),i=e.overflow,n=e.overflowX,s=e.overflowY;return/auto|scroll|overlay|hidden/.test(i+s+n)}function Ze(t){return["html","body","#document"].indexOf(pe(t))>=0?t.ownerDocument.body:_e(t)&&Je(t)?t:Ze($e(t))}function ti(t,e){var i;void 0===e&&(e=[]);var n=Ze(t),s=n===(null==(i=t.ownerDocument)?void 0:i.body),o=me(n),r=s?[o].concat(o.visualViewport||[],Je(n)?n:[]):n,a=e.concat(r);return s?a:a.concat(ti($e(r)))}function ei(t){return Object.assign({},t,{left:t.x,top:t.y,right:t.x+t.width,bottom:t.y+t.height})}function ii(t,e,i){return e===Zt?ei(function(t,e){var i=me(t),n=De(t),s=i.visualViewport,o=n.clientWidth,r=n.clientHeight,a=0,l=0;if(s){o=s.width,r=s.height;var c=Ce();(c||!c&&"fixed"===e)&&(a=s.offsetLeft,l=s.offsetTop)}return{width:o,height:r,x:a+Ge(t),y:l}}(t,i)):ge(e)?function(t,e){var i=Oe(t,!1,"fixed"===e);return i.top=i.top+t.clientTop,i.left=i.left+t.clientLeft,i.bottom=i.top+t.clientHeight,i.right=i.left+t.clientWidth,i.width=t.clientWidth,i.height=t.clientHeight,i.x=i.left,i.y=i.top,i}(e,i):ei(function(t){var e,i=De(t),n=Ue(t),s=null==(e=t.ownerDocument)?void 0:e.body,o=we(i.scrollWidth,i.clientWidth,s?s.scrollWidth:0,s?s.clientWidth:0),r=we(i.scrollHeight,i.clientHeight,s?s.scrollHeight:0,s?s.clientHeight:0),a=-n.scrollLeft+Ge(t),l=-n.scrollTop;return"rtl"===Le(s||i).direction&&(a+=we(i.clientWidth,s?s.clientWidth:0)-o),{width:o,height:r,x:a,y:l}}(De(t)))}function ni(t){var e,i=t.reference,n=t.element,s=t.placement,o=s?ye(s):null,r=s?We(s):null,a=i.x+i.width/2-n.width/2,l=i.y+i.height/2-n.height/2;switch(o){case qt:e={x:a,y:i.y-n.height};break;case Vt:e={x:a,y:i.y+i.height};break;case Kt:e={x:i.x+i.width,y:l};break;case Qt:e={x:i.x-n.width,y:l};break;default:e={x:i.x,y:i.y}}var c=o?Pe(o):null;if(null!=c){var h="y"===c?"height":"width";switch(r){case Ut:e[c]=e[c]-(i[h]/2-n[h]/2);break;case Gt:e[c]=e[c]+(i[h]/2-n[h]/2)}}return e}function si(t,e){void 0===e&&(e={});var i=e,n=i.placement,s=void 0===n?t.placement:n,o=i.strategy,r=void 0===o?t.strategy:o,a=i.boundary,l=void 0===a?Jt:a,c=i.rootBoundary,h=void 0===c?Zt:c,d=i.elementContext,u=void 0===d?te:d,f=i.altBoundary,p=void 0!==f&&f,m=i.padding,g=void 0===m?0:m,_=Me("number"!=typeof g?g:Fe(g,Yt)),b=u===te?ee:te,v=t.rects.popper,y=t.elements[p?b:u],w=function(t,e,i,n){var s="clippingParents"===e?function(t){var e=ti($e(t)),i=["absolute","fixed"].indexOf(Le(t).position)>=0&&_e(t)?Ne(t):t;return ge(i)?e.filter((function(t){return ge(t)&&ke(t,i)&&"body"!==pe(t)})):[]}(t):[].concat(e),o=[].concat(s,[i]),r=o[0],a=o.reduce((function(e,i){var s=ii(t,i,n);return e.top=we(s.top,e.top),e.right=Ae(s.right,e.right),e.bottom=Ae(s.bottom,e.bottom),e.left=we(s.left,e.left),e}),ii(t,r,n));return a.width=a.right-a.left,a.height=a.bottom-a.top,a.x=a.left,a.y=a.top,a}(ge(y)?y:y.contextElement||De(t.elements.popper),l,h,r),A=Oe(t.elements.reference),E=ni({reference:A,element:v,placement:s}),T=ei(Object.assign({},v,E)),C=u===te?T:A,O={top:w.top-C.top+_.top,bottom:C.bottom-w.bottom+_.bottom,left:w.left-C.left+_.left,right:C.right-w.right+_.right},x=t.modifiersData.offset;if(u===te&&x){var k=x[s];Object.keys(O).forEach((function(t){var e=[Kt,Vt].indexOf(t)>=0?1:-1,i=[qt,Vt].indexOf(t)>=0?"y":"x";O[t]+=k[i]*e}))}return O}function oi(t,e){void 0===e&&(e={});var i=e,n=i.placement,s=i.boundary,o=i.rootBoundary,r=i.padding,a=i.flipVariations,l=i.allowedAutoPlacements,c=void 0===l?ne:l,h=We(n),d=h?a?ie:ie.filter((function(t){return We(t)===h})):Yt,u=d.filter((function(t){return c.indexOf(t)>=0}));0===u.length&&(u=d);var f=u.reduce((function(e,i){return e[i]=si(t,{placement:i,boundary:s,rootBoundary:o,padding:r})[ye(i)],e}),{});return Object.keys(f).sort((function(t,e){return f[t]-f[e]}))}const ri={name:"flip",enabled:!0,phase:"main",fn:function(t){var e=t.state,i=t.options,n=t.name;if(!e.modifiersData[n]._skip){for(var s=i.mainAxis,o=void 0===s||s,r=i.altAxis,a=void 0===r||r,l=i.fallbackPlacements,c=i.padding,h=i.boundary,d=i.rootBoundary,u=i.altBoundary,f=i.flipVariations,p=void 0===f||f,m=i.allowedAutoPlacements,g=e.options.placement,_=ye(g),b=l||(_!==g&&p?function(t){if(ye(t)===Xt)return[];var e=Qe(t);return[Ye(t),e,Ye(e)]}(g):[Qe(g)]),v=[g].concat(b).reduce((function(t,i){return t.concat(ye(i)===Xt?oi(e,{placement:i,boundary:h,rootBoundary:d,padding:c,flipVariations:p,allowedAutoPlacements:m}):i)}),[]),y=e.rects.reference,w=e.rects.popper,A=new Map,E=!0,T=v[0],C=0;C<v.length;C++){var O=v[C],x=ye(O),k=We(O)===Ut,L=[qt,Vt].indexOf(x)>=0,S=L?"width":"height",D=si(e,{placement:O,boundary:h,rootBoundary:d,altBoundary:u,padding:c}),$=L?k?Kt:Qt:k?Vt:qt;y[S]>w[S]&&($=Qe($));var I=Qe($),N=[];if(o&&N.push(D[x]<=0),a&&N.push(D[$]<=0,D[I]<=0),N.every((function(t){return t}))){T=O,E=!1;break}A.set(O,N)}if(E)for(var P=function(t){var e=v.find((function(e){var i=A.get(e);if(i)return i.slice(0,t).every((function(t){return t}))}));if(e)return T=e,"break"},j=p?3:1;j>0&&"break"!==P(j);j--);e.placement!==T&&(e.modifiersData[n]._skip=!0,e.placement=T,e.reset=!0)}},requiresIfExists:["offset"],data:{_skip:!1}};function ai(t,e,i){return void 0===i&&(i={x:0,y:0}),{top:t.top-e.height-i.y,right:t.right-e.width+i.x,bottom:t.bottom-e.height+i.y,left:t.left-e.width-i.x}}function li(t){return[qt,Kt,Vt,Qt].some((function(e){return t[e]>=0}))}const ci={name:"hide",enabled:!0,phase:"main",requiresIfExists:["preventOverflow"],fn:function(t){var e=t.state,i=t.name,n=e.rects.reference,s=e.rects.popper,o=e.modifiersData.preventOverflow,r=si(e,{elementContext:"reference"}),a=si(e,{altBoundary:!0}),l=ai(r,n),c=ai(a,s,o),h=li(l),d=li(c);e.modifiersData[i]={referenceClippingOffsets:l,popperEscapeOffsets:c,isReferenceHidden:h,hasPopperEscaped:d},e.attributes.popper=Object.assign({},e.attributes.popper,{"data-popper-reference-hidden":h,"data-popper-escaped":d})}},hi={name:"offset",enabled:!0,phase:"main",requires:["popperOffsets"],fn:function(t){var e=t.state,i=t.options,n=t.name,s=i.offset,o=void 0===s?[0,0]:s,r=ne.reduce((function(t,i){return t[i]=function(t,e,i){var n=ye(t),s=[Qt,qt].indexOf(n)>=0?-1:1,o="function"==typeof i?i(Object.assign({},e,{placement:t})):i,r=o[0],a=o[1];return r=r||0,a=(a||0)*s,[Qt,Kt].indexOf(n)>=0?{x:a,y:r}:{x:r,y:a}}(i,e.rects,o),t}),{}),a=r[e.placement],l=a.x,c=a.y;null!=e.modifiersData.popperOffsets&&(e.modifiersData.popperOffsets.x+=l,e.modifiersData.popperOffsets.y+=c),e.modifiersData[n]=r}},di={name:"popperOffsets",enabled:!0,phase:"read",fn:function(t){var e=t.state,i=t.name;e.modifiersData[i]=ni({reference:e.rects.reference,element:e.rects.popper,placement:e.placement})},data:{}},ui={name:"preventOverflow",enabled:!0,phase:"main",fn:function(t){var e=t.state,i=t.options,n=t.name,s=i.mainAxis,o=void 0===s||s,r=i.altAxis,a=void 0!==r&&r,l=i.boundary,c=i.rootBoundary,h=i.altBoundary,d=i.padding,u=i.tether,f=void 0===u||u,p=i.tetherOffset,m=void 0===p?0:p,g=si(e,{boundary:l,rootBoundary:c,padding:d,altBoundary:h}),_=ye(e.placement),b=We(e.placement),v=!b,y=Pe(_),w="x"===y?"y":"x",A=e.modifiersData.popperOffsets,E=e.rects.reference,T=e.rects.popper,C="function"==typeof m?m(Object.assign({},e.rects,{placement:e.placement})):m,O="number"==typeof C?{mainAxis:C,altAxis:C}:Object.assign({mainAxis:0,altAxis:0},C),x=e.modifiersData.offset?e.modifiersData.offset[e.placement]:null,k={x:0,y:0};if(A){if(o){var L,S="y"===y?qt:Qt,D="y"===y?Vt:Kt,$="y"===y?"height":"width",I=A[y],N=I+g[S],P=I-g[D],j=f?-T[$]/2:0,M=b===Ut?E[$]:T[$],F=b===Ut?-T[$]:-E[$],H=e.elements.arrow,W=f&&H?xe(H):{width:0,height:0},B=e.modifiersData["arrow#persistent"]?e.modifiersData["arrow#persistent"].padding:{top:0,right:0,bottom:0,left:0},z=B[S],R=B[D],q=je(0,E[$],W[$]),V=v?E[$]/2-j-q-z-O.mainAxis:M-q-z-O.mainAxis,K=v?-E[$]/2+j+q+R+O.mainAxis:F+q+R+O.mainAxis,Q=e.elements.arrow&&Ne(e.elements.arrow),X=Q?"y"===y?Q.clientTop||0:Q.clientLeft||0:0,Y=null!=(L=null==x?void 0:x[y])?L:0,U=I+K-Y,G=je(f?Ae(N,I+V-Y-X):N,I,f?we(P,U):P);A[y]=G,k[y]=G-I}if(a){var J,Z="x"===y?qt:Qt,tt="x"===y?Vt:Kt,et=A[w],it="y"===w?"height":"width",nt=et+g[Z],st=et-g[tt],ot=-1!==[qt,Qt].indexOf(_),rt=null!=(J=null==x?void 0:x[w])?J:0,at=ot?nt:et-E[it]-T[it]-rt+O.altAxis,lt=ot?et+E[it]+T[it]-rt-O.altAxis:st,ct=f&&ot?function(t,e,i){var n=je(t,e,i);return n>i?i:n}(at,et,lt):je(f?at:nt,et,f?lt:st);A[w]=ct,k[w]=ct-et}e.modifiersData[n]=k}},requiresIfExists:["offset"]};function fi(t,e,i){void 0===i&&(i=!1);var n,s,o=_e(e),r=_e(e)&&function(t){var e=t.getBoundingClientRect(),i=Ee(e.width)/t.offsetWidth||1,n=Ee(e.height)/t.offsetHeight||1;return 1!==i||1!==n}(e),a=De(e),l=Oe(t,r,i),c={scrollLeft:0,scrollTop:0},h={x:0,y:0};return(o||!o&&!i)&&(("body"!==pe(e)||Je(a))&&(c=(n=e)!==me(n)&&_e(n)?{scrollLeft:(s=n).scrollLeft,scrollTop:s.scrollTop}:Ue(n)),_e(e)?((h=Oe(e,!0)).x+=e.clientLeft,h.y+=e.clientTop):a&&(h.x=Ge(a))),{x:l.left+c.scrollLeft-h.x,y:l.top+c.scrollTop-h.y,width:l.width,height:l.height}}function pi(t){var e=new Map,i=new Set,n=[];function s(t){i.add(t.name),[].concat(t.requires||[],t.requiresIfExists||[]).forEach((function(t){if(!i.has(t)){var n=e.get(t);n&&s(n)}})),n.push(t)}return t.forEach((function(t){e.set(t.name,t)})),t.forEach((function(t){i.has(t.name)||s(t)})),n}var mi={placement:"bottom",modifiers:[],strategy:"absolute"};function gi(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];return!e.some((function(t){return!(t&&"function"==typeof t.getBoundingClientRect)}))}function _i(t){void 0===t&&(t={});var e=t,i=e.defaultModifiers,n=void 0===i?[]:i,s=e.defaultOptions,o=void 0===s?mi:s;return function(t,e,i){void 0===i&&(i=o);var s,r,a={placement:"bottom",orderedModifiers:[],options:Object.assign({},mi,o),modifiersData:{},elements:{reference:t,popper:e},attributes:{},styles:{}},l=[],c=!1,h={state:a,setOptions:function(i){var s="function"==typeof i?i(a.options):i;d(),a.options=Object.assign({},o,a.options,s),a.scrollParents={reference:ge(t)?ti(t):t.contextElement?ti(t.contextElement):[],popper:ti(e)};var r,c,u=function(t){var e=pi(t);return fe.reduce((function(t,i){return t.concat(e.filter((function(t){return t.phase===i})))}),[])}((r=[].concat(n,a.options.modifiers),c=r.reduce((function(t,e){var i=t[e.name];return t[e.name]=i?Object.assign({},i,e,{options:Object.assign({},i.options,e.options),data:Object.assign({},i.data,e.data)}):e,t}),{}),Object.keys(c).map((function(t){return c[t]}))));return a.orderedModifiers=u.filter((function(t){return t.enabled})),a.orderedModifiers.forEach((function(t){var e=t.name,i=t.options,n=void 0===i?{}:i,s=t.effect;if("function"==typeof s){var o=s({state:a,name:e,instance:h,options:n});l.push(o||function(){})}})),h.update()},forceUpdate:function(){if(!c){var t=a.elements,e=t.reference,i=t.popper;if(gi(e,i)){a.rects={reference:fi(e,Ne(i),"fixed"===a.options.strategy),popper:xe(i)},a.reset=!1,a.placement=a.options.placement,a.orderedModifiers.forEach((function(t){return a.modifiersData[t.name]=Object.assign({},t.data)}));for(var n=0;n<a.orderedModifiers.length;n++)if(!0!==a.reset){var s=a.orderedModifiers[n],o=s.fn,r=s.options,l=void 0===r?{}:r,d=s.name;"function"==typeof o&&(a=o({state:a,options:l,name:d,instance:h})||a)}else a.reset=!1,n=-1}}},update:(s=function(){return new Promise((function(t){h.forceUpdate(),t(a)}))},function(){return r||(r=new Promise((function(t){Promise.resolve().then((function(){r=void 0,t(s())}))}))),r}),destroy:function(){d(),c=!0}};if(!gi(t,e))return h;function d(){l.forEach((function(t){return t()})),l=[]}return h.setOptions(i).then((function(t){!c&&i.onFirstUpdate&&i.onFirstUpdate(t)})),h}}var bi=_i(),vi=_i({defaultModifiers:[Ve,di,Re,ve]}),yi=_i({defaultModifiers:[Ve,di,Re,ve,hi,ri,ui,He,ci]});const wi=Object.freeze(Object.defineProperty({__proto__:null,afterMain:ce,afterRead:re,afterWrite:ue,applyStyles:ve,arrow:He,auto:Xt,basePlacements:Yt,beforeMain:ae,beforeRead:se,beforeWrite:he,bottom:Vt,clippingParents:Jt,computeStyles:Re,createPopper:yi,createPopperBase:bi,createPopperLite:vi,detectOverflow:si,end:Gt,eventListeners:Ve,flip:ri,hide:ci,left:Qt,main:le,modifierPhases:fe,offset:hi,placements:ne,popper:te,popperGenerator:_i,popperOffsets:di,preventOverflow:ui,read:oe,reference:ee,right:Kt,start:Ut,top:qt,variationPlacements:ie,viewport:Zt,write:de},Symbol.toStringTag,{value:"Module"})),Ai="dropdown",Ei=".bs.dropdown",Ti=".data-api",Ci="ArrowUp",Oi="ArrowDown",xi=`hide${Ei}`,ki=`hidden${Ei}`,Li=`show${Ei}`,Si=`shown${Ei}`,Di=`click${Ei}${Ti}`,$i=`keydown${Ei}${Ti}`,Ii=`keyup${Ei}${Ti}`,Ni="show",Pi='[data-bs-toggle="dropdown"]:not(.disabled):not(:disabled)',ji=`${Pi}.${Ni}`,Mi=".dropdown-menu",Fi=p()?"top-end":"top-start",Hi=p()?"top-start":"top-end",Wi=p()?"bottom-end":"bottom-start",Bi=p()?"bottom-start":"bottom-end",zi=p()?"left-start":"right-start",Ri=p()?"right-start":"left-start",qi={autoClose:!0,boundary:"clippingParents",display:"dynamic",offset:[0,2],popperConfig:null,reference:"toggle"},Vi={autoClose:"(boolean|string)",boundary:"(string|element)",display:"string",offset:"(array|string|function)",popperConfig:"(null|object|function)",reference:"(string|element|object)"};class Ki extends W{constructor(t,e){super(t,e),this._popper=null,this._parent=this._element.parentNode,this._menu=z.next(this._element,Mi)[0]||z.prev(this._element,Mi)[0]||z.findOne(Mi,this._parent),this._inNavbar=this._detectNavbar()}static get Default(){return qi}static get DefaultType(){return Vi}static get NAME(){return Ai}toggle(){return this._isShown()?this.hide():this.show()}show(){if(l(this._element)||this._isShown())return;const t={relatedTarget:this._element};if(!N.trigger(this._element,Li,t).defaultPrevented){if(this._createPopper(),"ontouchstart"in document.documentElement&&!this._parent.closest(".navbar-nav"))for(const t of[].concat(...document.body.children))N.on(t,"mouseover",h);this._element.focus(),this._element.setAttribute("aria-expanded",!0),this._menu.classList.add(Ni),this._element.classList.add(Ni),N.trigger(this._element,Si,t)}}hide(){if(l(this._element)||!this._isShown())return;const t={relatedTarget:this._element};this._completeHide(t)}dispose(){this._popper&&this._popper.destroy(),super.dispose()}update(){this._inNavbar=this._detectNavbar(),this._popper&&this._popper.update()}_completeHide(t){if(!N.trigger(this._element,xi,t).defaultPrevented){if("ontouchstart"in document.documentElement)for(const t of[].concat(...document.body.children))N.off(t,"mouseover",h);this._popper&&this._popper.destroy(),this._menu.classList.remove(Ni),this._element.classList.remove(Ni),this._element.setAttribute("aria-expanded","false"),F.removeDataAttribute(this._menu,"popper"),N.trigger(this._element,ki,t),this._element.focus()}}_getConfig(t){if("object"==typeof(t=super._getConfig(t)).reference&&!o(t.reference)&&"function"!=typeof t.reference.getBoundingClientRect)throw new TypeError(`${Ai.toUpperCase()}: Option "reference" provided type "object" without a required "getBoundingClientRect" method.`);return t}_createPopper(){if(void 0===wi)throw new TypeError("Bootstrap's dropdowns require Popper (https://popper.js.org/docs/v2/)");let t=this._element;"parent"===this._config.reference?t=this._parent:o(this._config.reference)?t=r(this._config.reference):"object"==typeof this._config.reference&&(t=this._config.reference);const e=this._getPopperConfig();this._popper=yi(t,this._menu,e)}_isShown(){return this._menu.classList.contains(Ni)}_getPlacement(){const t=this._parent;if(t.classList.contains("dropend"))return zi;if(t.classList.contains("dropstart"))return Ri;if(t.classList.contains("dropup-center"))return"top";if(t.classList.contains("dropdown-center"))return"bottom";const e="end"===getComputedStyle(this._menu).getPropertyValue("--bs-position").trim();return t.classList.contains("dropup")?e?Hi:Fi:e?Bi:Wi}_detectNavbar(){return null!==this._element.closest(".navbar")}_getOffset(){const{offset:t}=this._config;return"string"==typeof t?t.split(",").map((t=>Number.parseInt(t,10))):"function"==typeof t?e=>t(e,this._element):t}_getPopperConfig(){const t={placement:this._getPlacement(),modifiers:[{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"offset",options:{offset:this._getOffset()}}]};return(this._inNavbar||"static"===this._config.display)&&(F.setDataAttribute(this._menu,"popper","static"),t.modifiers=[{name:"applyStyles",enabled:!1}]),{...t,...g(this._config.popperConfig,[void 0,t])}}_selectMenuItem({key:t,target:e}){const i=z.find(".dropdown-menu .dropdown-item:not(.disabled):not(:disabled)",this._menu).filter((t=>a(t)));i.length&&b(i,e,t===Oi,!i.includes(e)).focus()}static jQueryInterface(t){return this.each((function(){const e=Ki.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}}))}static clearMenus(t){if(2===t.button||"keyup"===t.type&&"Tab"!==t.key)return;const e=z.find(ji);for(const i of e){const e=Ki.getInstance(i);if(!e||!1===e._config.autoClose)continue;const n=t.composedPath(),s=n.includes(e._menu);if(n.includes(e._element)||"inside"===e._config.autoClose&&!s||"outside"===e._config.autoClose&&s)continue;if(e._menu.contains(t.target)&&("keyup"===t.type&&"Tab"===t.key||/input|select|option|textarea|form/i.test(t.target.tagName)))continue;const o={relatedTarget:e._element};"click"===t.type&&(o.clickEvent=t),e._completeHide(o)}}static dataApiKeydownHandler(t){const e=/input|textarea/i.test(t.target.tagName),i="Escape"===t.key,n=[Ci,Oi].includes(t.key);if(!n&&!i)return;if(e&&!i)return;t.preventDefault();const s=this.matches(Pi)?this:z.prev(this,Pi)[0]||z.next(this,Pi)[0]||z.findOne(Pi,t.delegateTarget.parentNode),o=Ki.getOrCreateInstance(s);if(n)return t.stopPropagation(),o.show(),void o._selectMenuItem(t);o._isShown()&&(t.stopPropagation(),o.hide(),s.focus())}}N.on(document,$i,Pi,Ki.dataApiKeydownHandler),N.on(document,$i,Mi,Ki.dataApiKeydownHandler),N.on(document,Di,Ki.clearMenus),N.on(document,Ii,Ki.clearMenus),N.on(document,Di,Pi,(function(t){t.preventDefault(),Ki.getOrCreateInstance(this).toggle()})),m(Ki);const Qi="backdrop",Xi="show",Yi=`mousedown.bs.${Qi}`,Ui={className:"modal-backdrop",clickCallback:null,isAnimated:!1,isVisible:!0,rootElement:"body"},Gi={className:"string",clickCallback:"(function|null)",isAnimated:"boolean",isVisible:"boolean",rootElement:"(element|string)"};class Ji extends H{constructor(t){super(),this._config=this._getConfig(t),this._isAppended=!1,this._element=null}static get Default(){return Ui}static get DefaultType(){return Gi}static get NAME(){return Qi}show(t){if(!this._config.isVisible)return void g(t);this._append();const e=this._getElement();this._config.isAnimated&&d(e),e.classList.add(Xi),this._emulateAnimation((()=>{g(t)}))}hide(t){this._config.isVisible?(this._getElement().classList.remove(Xi),this._emulateAnimation((()=>{this.dispose(),g(t)}))):g(t)}dispose(){this._isAppended&&(N.off(this._element,Yi),this._element.remove(),this._isAppended=!1)}_getElement(){if(!this._element){const t=document.createElement("div");t.className=this._config.className,this._config.isAnimated&&t.classList.add("fade"),this._element=t}return this._element}_configAfterMerge(t){return t.rootElement=r(t.rootElement),t}_append(){if(this._isAppended)return;const t=this._getElement();this._config.rootElement.append(t),N.on(t,Yi,(()=>{g(this._config.clickCallback)})),this._isAppended=!0}_emulateAnimation(t){_(t,this._getElement(),this._config.isAnimated)}}const Zi=".bs.focustrap",tn=`focusin${Zi}`,en=`keydown.tab${Zi}`,nn="backward",sn={autofocus:!0,trapElement:null},on={autofocus:"boolean",trapElement:"element"};class rn extends H{constructor(t){super(),this._config=this._getConfig(t),this._isActive=!1,this._lastTabNavDirection=null}static get Default(){return sn}static get DefaultType(){return on}static get NAME(){return"focustrap"}activate(){this._isActive||(this._config.autofocus&&this._config.trapElement.focus(),N.off(document,Zi),N.on(document,tn,(t=>this._handleFocusin(t))),N.on(document,en,(t=>this._handleKeydown(t))),this._isActive=!0)}deactivate(){this._isActive&&(this._isActive=!1,N.off(document,Zi))}_handleFocusin(t){const{trapElement:e}=this._config;if(t.target===document||t.target===e||e.contains(t.target))return;const i=z.focusableChildren(e);0===i.length?e.focus():this._lastTabNavDirection===nn?i[i.length-1].focus():i[0].focus()}_handleKeydown(t){"Tab"===t.key&&(this._lastTabNavDirection=t.shiftKey?nn:"forward")}}const an=".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",ln=".sticky-top",cn="padding-right",hn="margin-right";class dn{constructor(){this._element=document.body}getWidth(){const t=document.documentElement.clientWidth;return Math.abs(window.innerWidth-t)}hide(){const t=this.getWidth();this._disableOverFlow(),this._setElementAttributes(this._element,cn,(e=>e+t)),this._setElementAttributes(an,cn,(e=>e+t)),this._setElementAttributes(ln,hn,(e=>e-t))}reset(){this._resetElementAttributes(this._element,"overflow"),this._resetElementAttributes(this._element,cn),this._resetElementAttributes(an,cn),this._resetElementAttributes(ln,hn)}isOverflowing(){return this.getWidth()>0}_disableOverFlow(){this._saveInitialAttribute(this._element,"overflow"),this._element.style.overflow="hidden"}_setElementAttributes(t,e,i){const n=this.getWidth();this._applyManipulationCallback(t,(t=>{if(t!==this._element&&window.innerWidth>t.clientWidth+n)return;this._saveInitialAttribute(t,e);const s=window.getComputedStyle(t).getPropertyValue(e);t.style.setProperty(e,`${i(Number.parseFloat(s))}px`)}))}_saveInitialAttribute(t,e){const i=t.style.getPropertyValue(e);i&&F.setDataAttribute(t,e,i)}_resetElementAttributes(t,e){this._applyManipulationCallback(t,(t=>{const i=F.getDataAttribute(t,e);null!==i?(F.removeDataAttribute(t,e),t.style.setProperty(e,i)):t.style.removeProperty(e)}))}_applyManipulationCallback(t,e){if(o(t))e(t);else for(const i of z.find(t,this._element))e(i)}}const un=".bs.modal",fn=`hide${un}`,pn=`hidePrevented${un}`,mn=`hidden${un}`,gn=`show${un}`,_n=`shown${un}`,bn=`resize${un}`,vn=`click.dismiss${un}`,yn=`mousedown.dismiss${un}`,wn=`keydown.dismiss${un}`,An=`click${un}.data-api`,En="modal-open",Tn="show",Cn="modal-static",On={backdrop:!0,focus:!0,keyboard:!0},xn={backdrop:"(boolean|string)",focus:"boolean",keyboard:"boolean"};class kn extends W{constructor(t,e){super(t,e),this._dialog=z.findOne(".modal-dialog",this._element),this._backdrop=this._initializeBackDrop(),this._focustrap=this._initializeFocusTrap(),this._isShown=!1,this._isTransitioning=!1,this._scrollBar=new dn,this._addEventListeners()}static get Default(){return On}static get DefaultType(){return xn}static get NAME(){return"modal"}toggle(t){return this._isShown?this.hide():this.show(t)}show(t){this._isShown||this._isTransitioning||N.trigger(this._element,gn,{relatedTarget:t}).defaultPrevented||(this._isShown=!0,this._isTransitioning=!0,this._scrollBar.hide(),document.body.classList.add(En),this._adjustDialog(),this._backdrop.show((()=>this._showElement(t))))}hide(){this._isShown&&!this._isTransitioning&&(N.trigger(this._element,fn).defaultPrevented||(this._isShown=!1,this._isTransitioning=!0,this._focustrap.deactivate(),this._element.classList.remove(Tn),this._queueCallback((()=>this._hideModal()),this._element,this._isAnimated())))}dispose(){N.off(window,un),N.off(this._dialog,un),this._backdrop.dispose(),this._focustrap.deactivate(),super.dispose()}handleUpdate(){this._adjustDialog()}_initializeBackDrop(){return new Ji({isVisible:Boolean(this._config.backdrop),isAnimated:this._isAnimated()})}_initializeFocusTrap(){return new rn({trapElement:this._element})}_showElement(t){document.body.contains(this._element)||document.body.append(this._element),this._element.style.display="block",this._element.removeAttribute("aria-hidden"),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.scrollTop=0;const e=z.findOne(".modal-body",this._dialog);e&&(e.scrollTop=0),d(this._element),this._element.classList.add(Tn),this._queueCallback((()=>{this._config.focus&&this._focustrap.activate(),this._isTransitioning=!1,N.trigger(this._element,_n,{relatedTarget:t})}),this._dialog,this._isAnimated())}_addEventListeners(){N.on(this._element,wn,(t=>{"Escape"===t.key&&(this._config.keyboard?this.hide():this._triggerBackdropTransition())})),N.on(window,bn,(()=>{this._isShown&&!this._isTransitioning&&this._adjustDialog()})),N.on(this._element,yn,(t=>{N.one(this._element,vn,(e=>{this._element===t.target&&this._element===e.target&&("static"!==this._config.backdrop?this._config.backdrop&&this.hide():this._triggerBackdropTransition())}))}))}_hideModal(){this._element.style.display="none",this._element.setAttribute("aria-hidden",!0),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._isTransitioning=!1,this._backdrop.hide((()=>{document.body.classList.remove(En),this._resetAdjustments(),this._scrollBar.reset(),N.trigger(this._element,mn)}))}_isAnimated(){return this._element.classList.contains("fade")}_triggerBackdropTransition(){if(N.trigger(this._element,pn).defaultPrevented)return;const t=this._element.scrollHeight>document.documentElement.clientHeight,e=this._element.style.overflowY;"hidden"===e||this._element.classList.contains(Cn)||(t||(this._element.style.overflowY="hidden"),this._element.classList.add(Cn),this._queueCallback((()=>{this._element.classList.remove(Cn),this._queueCallback((()=>{this._element.style.overflowY=e}),this._dialog)}),this._dialog),this._element.focus())}_adjustDialog(){const t=this._element.scrollHeight>document.documentElement.clientHeight,e=this._scrollBar.getWidth(),i=e>0;if(i&&!t){const t=p()?"paddingLeft":"paddingRight";this._element.style[t]=`${e}px`}if(!i&&t){const t=p()?"paddingRight":"paddingLeft";this._element.style[t]=`${e}px`}}_resetAdjustments(){this._element.style.paddingLeft="",this._element.style.paddingRight=""}static jQueryInterface(t,e){return this.each((function(){const i=kn.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===i[t])throw new TypeError(`No method named "${t}"`);i[t](e)}}))}}N.on(document,An,'[data-bs-toggle="modal"]',(function(t){const e=z.getElementFromSelector(this);["A","AREA"].includes(this.tagName)&&t.preventDefault(),N.one(e,gn,(t=>{t.defaultPrevented||N.one(e,mn,(()=>{a(this)&&this.focus()}))}));const i=z.findOne(".modal.show");i&&kn.getInstance(i).hide(),kn.getOrCreateInstance(e).toggle(this)})),R(kn),m(kn);const Ln=".bs.offcanvas",Sn=".data-api",Dn=`load${Ln}${Sn}`,$n="show",In="showing",Nn="hiding",Pn=".offcanvas.show",jn=`show${Ln}`,Mn=`shown${Ln}`,Fn=`hide${Ln}`,Hn=`hidePrevented${Ln}`,Wn=`hidden${Ln}`,Bn=`resize${Ln}`,zn=`click${Ln}${Sn}`,Rn=`keydown.dismiss${Ln}`,qn={backdrop:!0,keyboard:!0,scroll:!1},Vn={backdrop:"(boolean|string)",keyboard:"boolean",scroll:"boolean"};class Kn extends W{constructor(t,e){super(t,e),this._isShown=!1,this._backdrop=this._initializeBackDrop(),this._focustrap=this._initializeFocusTrap(),this._addEventListeners()}static get Default(){return qn}static get DefaultType(){return Vn}static get NAME(){return"offcanvas"}toggle(t){return this._isShown?this.hide():this.show(t)}show(t){this._isShown||N.trigger(this._element,jn,{relatedTarget:t}).defaultPrevented||(this._isShown=!0,this._backdrop.show(),this._config.scroll||(new dn).hide(),this._element.setAttribute("aria-modal",!0),this._element.setAttribute("role","dialog"),this._element.classList.add(In),this._queueCallback((()=>{this._config.scroll&&!this._config.backdrop||this._focustrap.activate(),this._element.classList.add($n),this._element.classList.remove(In),N.trigger(this._element,Mn,{relatedTarget:t})}),this._element,!0))}hide(){this._isShown&&(N.trigger(this._element,Fn).defaultPrevented||(this._focustrap.deactivate(),this._element.blur(),this._isShown=!1,this._element.classList.add(Nn),this._backdrop.hide(),this._queueCallback((()=>{this._element.classList.remove($n,Nn),this._element.removeAttribute("aria-modal"),this._element.removeAttribute("role"),this._config.scroll||(new dn).reset(),N.trigger(this._element,Wn)}),this._element,!0)))}dispose(){this._backdrop.dispose(),this._focustrap.deactivate(),super.dispose()}_initializeBackDrop(){const t=Boolean(this._config.backdrop);return new Ji({className:"offcanvas-backdrop",isVisible:t,isAnimated:!0,rootElement:this._element.parentNode,clickCallback:t?()=>{"static"!==this._config.backdrop?this.hide():N.trigger(this._element,Hn)}:null})}_initializeFocusTrap(){return new rn({trapElement:this._element})}_addEventListeners(){N.on(this._element,Rn,(t=>{"Escape"===t.key&&(this._config.keyboard?this.hide():N.trigger(this._element,Hn))}))}static jQueryInterface(t){return this.each((function(){const e=Kn.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t](this)}}))}}N.on(document,zn,'[data-bs-toggle="offcanvas"]',(function(t){const e=z.getElementFromSelector(this);if(["A","AREA"].includes(this.tagName)&&t.preventDefault(),l(this))return;N.one(e,Wn,(()=>{a(this)&&this.focus()}));const i=z.findOne(Pn);i&&i!==e&&Kn.getInstance(i).hide(),Kn.getOrCreateInstance(e).toggle(this)})),N.on(window,Dn,(()=>{for(const t of z.find(Pn))Kn.getOrCreateInstance(t).show()})),N.on(window,Bn,(()=>{for(const t of z.find("[aria-modal][class*=show][class*=offcanvas-]"))"fixed"!==getComputedStyle(t).position&&Kn.getOrCreateInstance(t).hide()})),R(Kn),m(Kn);const Qn={"*":["class","dir","id","lang","role",/^aria-[\w-]*$/i],a:["target","href","title","rel"],area:[],b:[],br:[],col:[],code:[],dd:[],div:[],dl:[],dt:[],em:[],hr:[],h1:[],h2:[],h3:[],h4:[],h5:[],h6:[],i:[],img:["src","srcset","alt","title","width","height"],li:[],ol:[],p:[],pre:[],s:[],small:[],span:[],sub:[],sup:[],strong:[],u:[],ul:[]},Xn=new Set(["background","cite","href","itemtype","longdesc","poster","src","xlink:href"]),Yn=/^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:/?#]*(?:[/?#]|$))/i,Un=(t,e)=>{const i=t.nodeName.toLowerCase();return e.includes(i)?!Xn.has(i)||Boolean(Yn.test(t.nodeValue)):e.filter((t=>t instanceof RegExp)).some((t=>t.test(i)))},Gn={allowList:Qn,content:{},extraClass:"",html:!1,sanitize:!0,sanitizeFn:null,template:"<div></div>"},Jn={allowList:"object",content:"object",extraClass:"(string|function)",html:"boolean",sanitize:"boolean",sanitizeFn:"(null|function)",template:"string"},Zn={entry:"(string|element|function|null)",selector:"(string|element)"};class ts extends H{constructor(t){super(),this._config=this._getConfig(t)}static get Default(){return Gn}static get DefaultType(){return Jn}static get NAME(){return"TemplateFactory"}getContent(){return Object.values(this._config.content).map((t=>this._resolvePossibleFunction(t))).filter(Boolean)}hasContent(){return this.getContent().length>0}changeContent(t){return this._checkContent(t),this._config.content={...this._config.content,...t},this}toHtml(){const t=document.createElement("div");t.innerHTML=this._maybeSanitize(this._config.template);for(const[e,i]of Object.entries(this._config.content))this._setContent(t,i,e);const e=t.children[0],i=this._resolvePossibleFunction(this._config.extraClass);return i&&e.classList.add(...i.split(" ")),e}_typeCheckConfig(t){super._typeCheckConfig(t),this._checkContent(t.content)}_checkContent(t){for(const[e,i]of Object.entries(t))super._typeCheckConfig({selector:e,entry:i},Zn)}_setContent(t,e,i){const n=z.findOne(i,t);n&&((e=this._resolvePossibleFunction(e))?o(e)?this._putElementInTemplate(r(e),n):this._config.html?n.innerHTML=this._maybeSanitize(e):n.textContent=e:n.remove())}_maybeSanitize(t){return this._config.sanitize?function(t,e,i){if(!t.length)return t;if(i&&"function"==typeof i)return i(t);const n=(new window.DOMParser).parseFromString(t,"text/html"),s=[].concat(...n.body.querySelectorAll("*"));for(const t of s){const i=t.nodeName.toLowerCase();if(!Object.keys(e).includes(i)){t.remove();continue}const n=[].concat(...t.attributes),s=[].concat(e["*"]||[],e[i]||[]);for(const e of n)Un(e,s)||t.removeAttribute(e.nodeName)}return n.body.innerHTML}(t,this._config.allowList,this._config.sanitizeFn):t}_resolvePossibleFunction(t){return g(t,[void 0,this])}_putElementInTemplate(t,e){if(this._config.html)return e.innerHTML="",void e.append(t);e.textContent=t.textContent}}const es=new Set(["sanitize","allowList","sanitizeFn"]),is="fade",ns="show",ss=".tooltip-inner",os=".modal",rs="hide.bs.modal",as="hover",ls="focus",cs="click",hs={AUTO:"auto",TOP:"top",RIGHT:p()?"left":"right",BOTTOM:"bottom",LEFT:p()?"right":"left"},ds={allowList:Qn,animation:!0,boundary:"clippingParents",container:!1,customClass:"",delay:0,fallbackPlacements:["top","right","bottom","left"],html:!1,offset:[0,6],placement:"top",popperConfig:null,sanitize:!0,sanitizeFn:null,selector:!1,template:'<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',title:"",trigger:"hover focus"},us={allowList:"object",animation:"boolean",boundary:"(string|element)",container:"(string|element|boolean)",customClass:"(string|function)",delay:"(number|object)",fallbackPlacements:"array",html:"boolean",offset:"(array|string|function)",placement:"(string|function)",popperConfig:"(null|object|function)",sanitize:"boolean",sanitizeFn:"(null|function)",selector:"(string|boolean)",template:"string",title:"(string|element|function)",trigger:"string"};class fs extends W{constructor(t,e){if(void 0===wi)throw new TypeError("Bootstrap's tooltips require Popper (https://popper.js.org/docs/v2/)");super(t,e),this._isEnabled=!0,this._timeout=0,this._isHovered=null,this._activeTrigger={},this._popper=null,this._templateFactory=null,this._newContent=null,this.tip=null,this._setListeners(),this._config.selector||this._fixTitle()}static get Default(){return ds}static get DefaultType(){return us}static get NAME(){return"tooltip"}enable(){this._isEnabled=!0}disable(){this._isEnabled=!1}toggleEnabled(){this._isEnabled=!this._isEnabled}toggle(){this._isEnabled&&(this._isShown()?this._leave():this._enter())}dispose(){clearTimeout(this._timeout),N.off(this._element.closest(os),rs,this._hideModalHandler),this._element.getAttribute("data-bs-original-title")&&this._element.setAttribute("title",this._element.getAttribute("data-bs-original-title")),this._disposePopper(),super.dispose()}show(){if("none"===this._element.style.display)throw new Error("Please use show on visible elements");if(!this._isWithContent()||!this._isEnabled)return;const t=N.trigger(this._element,this.constructor.eventName("show")),e=(c(this._element)||this._element.ownerDocument.documentElement).contains(this._element);if(t.defaultPrevented||!e)return;this._disposePopper();const i=this._getTipElement();this._element.setAttribute("aria-describedby",i.getAttribute("id"));const{container:n}=this._config;if(this._element.ownerDocument.documentElement.contains(this.tip)||(n.append(i),N.trigger(this._element,this.constructor.eventName("inserted"))),this._popper=this._createPopper(i),i.classList.add(ns),"ontouchstart"in document.documentElement)for(const t of[].concat(...document.body.children))N.on(t,"mouseover",h);this._queueCallback((()=>{N.trigger(this._element,this.constructor.eventName("shown")),!1===this._isHovered&&this._leave(),this._isHovered=!1}),this.tip,this._isAnimated())}hide(){if(this._isShown()&&!N.trigger(this._element,this.constructor.eventName("hide")).defaultPrevented){if(this._getTipElement().classList.remove(ns),"ontouchstart"in document.documentElement)for(const t of[].concat(...document.body.children))N.off(t,"mouseover",h);this._activeTrigger[cs]=!1,this._activeTrigger[ls]=!1,this._activeTrigger[as]=!1,this._isHovered=null,this._queueCallback((()=>{this._isWithActiveTrigger()||(this._isHovered||this._disposePopper(),this._element.removeAttribute("aria-describedby"),N.trigger(this._element,this.constructor.eventName("hidden")))}),this.tip,this._isAnimated())}}update(){this._popper&&this._popper.update()}_isWithContent(){return Boolean(this._getTitle())}_getTipElement(){return this.tip||(this.tip=this._createTipElement(this._newContent||this._getContentForTemplate())),this.tip}_createTipElement(t){const e=this._getTemplateFactory(t).toHtml();if(!e)return null;e.classList.remove(is,ns),e.classList.add(`bs-${this.constructor.NAME}-auto`);const i=(t=>{do{t+=Math.floor(1e6*Math.random())}while(document.getElementById(t));return t})(this.constructor.NAME).toString();return e.setAttribute("id",i),this._isAnimated()&&e.classList.add(is),e}setContent(t){this._newContent=t,this._isShown()&&(this._disposePopper(),this.show())}_getTemplateFactory(t){return this._templateFactory?this._templateFactory.changeContent(t):this._templateFactory=new ts({...this._config,content:t,extraClass:this._resolvePossibleFunction(this._config.customClass)}),this._templateFactory}_getContentForTemplate(){return{[ss]:this._getTitle()}}_getTitle(){return this._resolvePossibleFunction(this._config.title)||this._element.getAttribute("data-bs-original-title")}_initializeOnDelegatedTarget(t){return this.constructor.getOrCreateInstance(t.delegateTarget,this._getDelegateConfig())}_isAnimated(){return this._config.animation||this.tip&&this.tip.classList.contains(is)}_isShown(){return this.tip&&this.tip.classList.contains(ns)}_createPopper(t){const e=g(this._config.placement,[this,t,this._element]),i=hs[e.toUpperCase()];return yi(this._element,t,this._getPopperConfig(i))}_getOffset(){const{offset:t}=this._config;return"string"==typeof t?t.split(",").map((t=>Number.parseInt(t,10))):"function"==typeof t?e=>t(e,this._element):t}_resolvePossibleFunction(t){return g(t,[this._element,this._element])}_getPopperConfig(t){const e={placement:t,modifiers:[{name:"flip",options:{fallbackPlacements:this._config.fallbackPlacements}},{name:"offset",options:{offset:this._getOffset()}},{name:"preventOverflow",options:{boundary:this._config.boundary}},{name:"arrow",options:{element:`.${this.constructor.NAME}-arrow`}},{name:"preSetPlacement",enabled:!0,phase:"beforeMain",fn:t=>{this._getTipElement().setAttribute("data-popper-placement",t.state.placement)}}]};return{...e,...g(this._config.popperConfig,[void 0,e])}}_setListeners(){const t=this._config.trigger.split(" ");for(const e of t)if("click"===e)N.on(this._element,this.constructor.eventName("click"),this._config.selector,(t=>{const e=this._initializeOnDelegatedTarget(t);e._activeTrigger[cs]=!(e._isShown()&&e._activeTrigger[cs]),e.toggle()}));else if("manual"!==e){const t=e===as?this.constructor.eventName("mouseenter"):this.constructor.eventName("focusin"),i=e===as?this.constructor.eventName("mouseleave"):this.constructor.eventName("focusout");N.on(this._element,t,this._config.selector,(t=>{const e=this._initializeOnDelegatedTarget(t);e._activeTrigger["focusin"===t.type?ls:as]=!0,e._enter()})),N.on(this._element,i,this._config.selector,(t=>{const e=this._initializeOnDelegatedTarget(t);e._activeTrigger["focusout"===t.type?ls:as]=e._element.contains(t.relatedTarget),e._leave()}))}this._hideModalHandler=()=>{this._element&&this.hide()},N.on(this._element.closest(os),rs,this._hideModalHandler)}_fixTitle(){const t=this._element.getAttribute("title");t&&(this._element.getAttribute("aria-label")||this._element.textContent.trim()||this._element.setAttribute("aria-label",t),this._element.setAttribute("data-bs-original-title",t),this._element.removeAttribute("title"))}_enter(){this._isShown()||this._isHovered?this._isHovered=!0:(this._isHovered=!0,this._setTimeout((()=>{this._isHovered&&this.show()}),this._config.delay.show))}_leave(){this._isWithActiveTrigger()||(this._isHovered=!1,this._setTimeout((()=>{this._isHovered||this.hide()}),this._config.delay.hide))}_setTimeout(t,e){clearTimeout(this._timeout),this._timeout=setTimeout(t,e)}_isWithActiveTrigger(){return Object.values(this._activeTrigger).includes(!0)}_getConfig(t){const e=F.getDataAttributes(this._element);for(const t of Object.keys(e))es.has(t)&&delete e[t];return t={...e,..."object"==typeof t&&t?t:{}},t=this._mergeConfigObj(t),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}_configAfterMerge(t){return t.container=!1===t.container?document.body:r(t.container),"number"==typeof t.delay&&(t.delay={show:t.delay,hide:t.delay}),"number"==typeof t.title&&(t.title=t.title.toString()),"number"==typeof t.content&&(t.content=t.content.toString()),t}_getDelegateConfig(){const t={};for(const[e,i]of Object.entries(this._config))this.constructor.Default[e]!==i&&(t[e]=i);return t.selector=!1,t.trigger="manual",t}_disposePopper(){this._popper&&(this._popper.destroy(),this._popper=null),this.tip&&(this.tip.remove(),this.tip=null)}static jQueryInterface(t){return this.each((function(){const e=fs.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}}))}}m(fs);const ps=".popover-header",ms=".popover-body",gs={...fs.Default,content:"",offset:[0,8],placement:"right",template:'<div class="popover" role="tooltip"><div class="popover-arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>',trigger:"click"},_s={...fs.DefaultType,content:"(null|string|element|function)"};class bs extends fs{static get Default(){return gs}static get DefaultType(){return _s}static get NAME(){return"popover"}_isWithContent(){return this._getTitle()||this._getContent()}_getContentForTemplate(){return{[ps]:this._getTitle(),[ms]:this._getContent()}}_getContent(){return this._resolvePossibleFunction(this._config.content)}static jQueryInterface(t){return this.each((function(){const e=bs.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t]()}}))}}m(bs);const vs=".bs.scrollspy",ys=`activate${vs}`,ws=`click${vs}`,As=`load${vs}.data-api`,Es="active",Ts="[href]",Cs=".nav-link",Os=`${Cs}, .nav-item > ${Cs}, .list-group-item`,xs={offset:null,rootMargin:"0px 0px -25%",smoothScroll:!1,target:null,threshold:[.1,.5,1]},ks={offset:"(number|null)",rootMargin:"string",smoothScroll:"boolean",target:"element",threshold:"array"};class Ls extends W{constructor(t,e){super(t,e),this._targetLinks=new Map,this._observableSections=new Map,this._rootElement="visible"===getComputedStyle(this._element).overflowY?null:this._element,this._activeTarget=null,this._observer=null,this._previousScrollData={visibleEntryTop:0,parentScrollTop:0},this.refresh()}static get Default(){return xs}static get DefaultType(){return ks}static get NAME(){return"scrollspy"}refresh(){this._initializeTargetsAndObservables(),this._maybeEnableSmoothScroll(),this._observer?this._observer.disconnect():this._observer=this._getNewObserver();for(const t of this._observableSections.values())this._observer.observe(t)}dispose(){this._observer.disconnect(),super.dispose()}_configAfterMerge(t){return t.target=r(t.target)||document.body,t.rootMargin=t.offset?`${t.offset}px 0px -30%`:t.rootMargin,"string"==typeof t.threshold&&(t.threshold=t.threshold.split(",").map((t=>Number.parseFloat(t)))),t}_maybeEnableSmoothScroll(){this._config.smoothScroll&&(N.off(this._config.target,ws),N.on(this._config.target,ws,Ts,(t=>{const e=this._observableSections.get(t.target.hash);if(e){t.preventDefault();const i=this._rootElement||window,n=e.offsetTop-this._element.offsetTop;if(i.scrollTo)return void i.scrollTo({top:n,behavior:"smooth"});i.scrollTop=n}})))}_getNewObserver(){const t={root:this._rootElement,threshold:this._config.threshold,rootMargin:this._config.rootMargin};return new IntersectionObserver((t=>this._observerCallback(t)),t)}_observerCallback(t){const e=t=>this._targetLinks.get(`#${t.target.id}`),i=t=>{this._previousScrollData.visibleEntryTop=t.target.offsetTop,this._process(e(t))},n=(this._rootElement||document.documentElement).scrollTop,s=n>=this._previousScrollData.parentScrollTop;this._previousScrollData.parentScrollTop=n;for(const o of t){if(!o.isIntersecting){this._activeTarget=null,this._clearActiveClass(e(o));continue}const t=o.target.offsetTop>=this._previousScrollData.visibleEntryTop;if(s&&t){if(i(o),!n)return}else s||t||i(o)}}_initializeTargetsAndObservables(){this._targetLinks=new Map,this._observableSections=new Map;const t=z.find(Ts,this._config.target);for(const e of t){if(!e.hash||l(e))continue;const t=z.findOne(decodeURI(e.hash),this._element);a(t)&&(this._targetLinks.set(decodeURI(e.hash),e),this._observableSections.set(e.hash,t))}}_process(t){this._activeTarget!==t&&(this._clearActiveClass(this._config.target),this._activeTarget=t,t.classList.add(Es),this._activateParents(t),N.trigger(this._element,ys,{relatedTarget:t}))}_activateParents(t){if(t.classList.contains("dropdown-item"))z.findOne(".dropdown-toggle",t.closest(".dropdown")).classList.add(Es);else for(const e of z.parents(t,".nav, .list-group"))for(const t of z.prev(e,Os))t.classList.add(Es)}_clearActiveClass(t){t.classList.remove(Es);const e=z.find(`${Ts}.${Es}`,t);for(const t of e)t.classList.remove(Es)}static jQueryInterface(t){return this.each((function(){const e=Ls.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t]()}}))}}N.on(window,As,(()=>{for(const t of z.find('[data-bs-spy="scroll"]'))Ls.getOrCreateInstance(t)})),m(Ls);const Ss=".bs.tab",Ds=`hide${Ss}`,$s=`hidden${Ss}`,Is=`show${Ss}`,Ns=`shown${Ss}`,Ps=`click${Ss}`,js=`keydown${Ss}`,Ms=`load${Ss}`,Fs="ArrowLeft",Hs="ArrowRight",Ws="ArrowUp",Bs="ArrowDown",zs="Home",Rs="End",qs="active",Vs="fade",Ks="show",Qs=".dropdown-toggle",Xs=`:not(${Qs})`,Ys='[data-bs-toggle="tab"], [data-bs-toggle="pill"], [data-bs-toggle="list"]',Us=`.nav-link${Xs}, .list-group-item${Xs}, [role="tab"]${Xs}, ${Ys}`,Gs=`.${qs}[data-bs-toggle="tab"], .${qs}[data-bs-toggle="pill"], .${qs}[data-bs-toggle="list"]`;class Js extends W{constructor(t){super(t),this._parent=this._element.closest('.list-group, .nav, [role="tablist"]'),this._parent&&(this._setInitialAttributes(this._parent,this._getChildren()),N.on(this._element,js,(t=>this._keydown(t))))}static get NAME(){return"tab"}show(){const t=this._element;if(this._elemIsActive(t))return;const e=this._getActiveElem(),i=e?N.trigger(e,Ds,{relatedTarget:t}):null;N.trigger(t,Is,{relatedTarget:e}).defaultPrevented||i&&i.defaultPrevented||(this._deactivate(e,t),this._activate(t,e))}_activate(t,e){t&&(t.classList.add(qs),this._activate(z.getElementFromSelector(t)),this._queueCallback((()=>{"tab"===t.getAttribute("role")?(t.removeAttribute("tabindex"),t.setAttribute("aria-selected",!0),this._toggleDropDown(t,!0),N.trigger(t,Ns,{relatedTarget:e})):t.classList.add(Ks)}),t,t.classList.contains(Vs)))}_deactivate(t,e){t&&(t.classList.remove(qs),t.blur(),this._deactivate(z.getElementFromSelector(t)),this._queueCallback((()=>{"tab"===t.getAttribute("role")?(t.setAttribute("aria-selected",!1),t.setAttribute("tabindex","-1"),this._toggleDropDown(t,!1),N.trigger(t,$s,{relatedTarget:e})):t.classList.remove(Ks)}),t,t.classList.contains(Vs)))}_keydown(t){if(![Fs,Hs,Ws,Bs,zs,Rs].includes(t.key))return;t.stopPropagation(),t.preventDefault();const e=this._getChildren().filter((t=>!l(t)));let i;if([zs,Rs].includes(t.key))i=e[t.key===zs?0:e.length-1];else{const n=[Hs,Bs].includes(t.key);i=b(e,t.target,n,!0)}i&&(i.focus({preventScroll:!0}),Js.getOrCreateInstance(i).show())}_getChildren(){return z.find(Us,this._parent)}_getActiveElem(){return this._getChildren().find((t=>this._elemIsActive(t)))||null}_setInitialAttributes(t,e){this._setAttributeIfNotExists(t,"role","tablist");for(const t of e)this._setInitialAttributesOnChild(t)}_setInitialAttributesOnChild(t){t=this._getInnerElement(t);const e=this._elemIsActive(t),i=this._getOuterElement(t);t.setAttribute("aria-selected",e),i!==t&&this._setAttributeIfNotExists(i,"role","presentation"),e||t.setAttribute("tabindex","-1"),this._setAttributeIfNotExists(t,"role","tab"),this._setInitialAttributesOnTargetPanel(t)}_setInitialAttributesOnTargetPanel(t){const e=z.getElementFromSelector(t);e&&(this._setAttributeIfNotExists(e,"role","tabpanel"),t.id&&this._setAttributeIfNotExists(e,"aria-labelledby",`${t.id}`))}_toggleDropDown(t,e){const i=this._getOuterElement(t);if(!i.classList.contains("dropdown"))return;const n=(t,n)=>{const s=z.findOne(t,i);s&&s.classList.toggle(n,e)};n(Qs,qs),n(".dropdown-menu",Ks),i.setAttribute("aria-expanded",e)}_setAttributeIfNotExists(t,e,i){t.hasAttribute(e)||t.setAttribute(e,i)}_elemIsActive(t){return t.classList.contains(qs)}_getInnerElement(t){return t.matches(Us)?t:z.findOne(Us,t)}_getOuterElement(t){return t.closest(".nav-item, .list-group-item")||t}static jQueryInterface(t){return this.each((function(){const e=Js.getOrCreateInstance(this);if("string"==typeof t){if(void 0===e[t]||t.startsWith("_")||"constructor"===t)throw new TypeError(`No method named "${t}"`);e[t]()}}))}}N.on(document,Ps,Ys,(function(t){["A","AREA"].includes(this.tagName)&&t.preventDefault(),l(this)||Js.getOrCreateInstance(this).show()})),N.on(window,Ms,(()=>{for(const t of z.find(Gs))Js.getOrCreateInstance(t)})),m(Js);const Zs=".bs.toast",to=`mouseover${Zs}`,eo=`mouseout${Zs}`,io=`focusin${Zs}`,no=`focusout${Zs}`,so=`hide${Zs}`,oo=`hidden${Zs}`,ro=`show${Zs}`,ao=`shown${Zs}`,lo="hide",co="show",ho="showing",uo={animation:"boolean",autohide:"boolean",delay:"number"},fo={animation:!0,autohide:!0,delay:5e3};class po extends W{constructor(t,e){super(t,e),this._timeout=null,this._hasMouseInteraction=!1,this._hasKeyboardInteraction=!1,this._setListeners()}static get Default(){return fo}static get DefaultType(){return uo}static get NAME(){return"toast"}show(){N.trigger(this._element,ro).defaultPrevented||(this._clearTimeout(),this._config.animation&&this._element.classList.add("fade"),this._element.classList.remove(lo),d(this._element),this._element.classList.add(co,ho),this._queueCallback((()=>{this._element.classList.remove(ho),N.trigger(this._element,ao),this._maybeScheduleHide()}),this._element,this._config.animation))}hide(){this.isShown()&&(N.trigger(this._element,so).defaultPrevented||(this._element.classList.add(ho),this._queueCallback((()=>{this._element.classList.add(lo),this._element.classList.remove(ho,co),N.trigger(this._element,oo)}),this._element,this._config.animation)))}dispose(){this._clearTimeout(),this.isShown()&&this._element.classList.remove(co),super.dispose()}isShown(){return this._element.classList.contains(co)}_maybeScheduleHide(){this._config.autohide&&(this._hasMouseInteraction||this._hasKeyboardInteraction||(this._timeout=setTimeout((()=>{this.hide()}),this._config.delay)))}_onInteraction(t,e){switch(t.type){case"mouseover":case"mouseout":this._hasMouseInteraction=e;break;case"focusin":case"focusout":this._hasKeyboardInteraction=e}if(e)return void this._clearTimeout();const i=t.relatedTarget;this._element===i||this._element.contains(i)||this._maybeScheduleHide()}_setListeners(){N.on(this._element,to,(t=>this._onInteraction(t,!0))),N.on(this._element,eo,(t=>this._onInteraction(t,!1))),N.on(this._element,io,(t=>this._onInteraction(t,!0))),N.on(this._element,no,(t=>this._onInteraction(t,!1)))}_clearTimeout(){clearTimeout(this._timeout),this._timeout=null}static jQueryInterface(t){return this.each((function(){const e=po.getOrCreateInstance(this,t);if("string"==typeof t){if(void 0===e[t])throw new TypeError(`No method named "${t}"`);e[t](this)}}))}}return R(po),m(po),{Alert:Q,Button:Y,Carousel:Lt,Collapse:Rt,Dropdown:Ki,Modal:kn,Offcanvas:Kn,Popover:bs,ScrollSpy:Ls,Tab:Js,Toast:po,Tooltip:fs}}));
//# sourceMappingURL=bootstrap.bundle.min.js.map
/*
 * LaraClassifier - Classified Ads Web Application
 * Copyright (c) BeDigit. All Rights Reserved
 *
 * Website: https://laraclassifier.com
 * Author: Mayeul Akpovi (BeDigit - https://bedigit.com)
 *
 * LICENSE
 * -------
 * This software is provided under a license agreement and may only be used or copied
 * in accordance with its terms, including the inclusion of the above copyright notice.
 * As this software is sold exclusively on CodeCanyon,
 * please review the full license details here: https://codecanyon.net/licenses/standard
 */

onDocumentReady((event) => {
	// Tooltip
	// -------
	// Enable tooltips everywhere (Default trigger: 'hover focus')
	const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl);
	});
	
	// Enable tooltips everywhere (Default trigger: 'hover focus')
	// Select only elements that have both "auto-tooltip" class and a "title" attribute
	const autoTooltipTriggerList = [].slice.call(document.querySelectorAll('.auto-tooltip[title]'));
	const autoTooltipList = autoTooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl);
	});
	
	// Enable tooltips everywhere (Default trigger: 'hover')
	const tooltipHoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltipHover"]'));
	const tooltipHoverList = tooltipHoverTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl, {
			trigger: 'hover'
		});
	});
	
	// Popover
	// -------
	/* popovers in Bootstrap 5.x requires vanilla JavaScript */
	const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
	const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
		return new bootstrap.Popover(popoverTriggerEl, {
			html: true
		});
	});
	
	// Modal
	// -----
	// Fix Bootstrap Modal Focus Issue on Close
	// This ensures that when any Bootstrap modal is closed, focus is removed from active elements inside it.
	// Prevents the "Blocked aria-hidden" error and improves accessibility.
	document.addEventListener("hide.bs.modal", function () {
		document.activeElement.blur(); // Remove focus from active element before hiding any modal
	});
});

/**
 * Initialize all tooltips in the DOM element (including the new one)
 *
 * Enable tooltips everywhere in the DOM element
 * Usage: initElementTooltips(domElement, {html: true});
 *        initElementTooltips(domElement, {trigger: 'hover'});
 *        initElementTooltips(domElement, {trigger: 'hover focus'});
 *
 * @param element
 * @param config
 * @param toggle
 */
function initElementTooltips(element, config = {}, toggle = 'tooltip') {
	if (!element) return;
	
	const tooltipTriggerList = [].slice.call(element.querySelectorAll(`[data-bs-toggle="${toggle}"]`));
	const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl, config);
	});
}

/**
 * Initialize all popovers in the DOM element (including the new one)
 *
 * Enable popovers everywhere
 * Usage: initElementPopovers(domElement, {html: true});
 *
 * @param element
 * @param config
 * @param toggle
 */
function initElementPopovers(element, config = {}, toggle = 'popover') {
	if (!element) return;
	
	const popoverTriggerList = [].slice.call(element.querySelectorAll(`[data-bs-toggle="${toggle}"]`));
	const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
		return new bootstrap.Popover(popoverTriggerEl, config);
	});
}

/*
 * LaraClassifier - Classified Ads Web Application
 * Copyright (c) BeDigit. All Rights Reserved
 *
 * Website: https://laraclassifier.com
 * Author: Mayeul Akpovi (BeDigit - https://bedigit.com)
 *
 * LICENSE
 * -------
 * This software is provided under a license agreement and may only be used or copied
 * in accordance with its terms, including the inclusion of the above copyright notice.
 * As this software is sold exclusively on CodeCanyon,
 * please review the full license details here: https://codecanyon.net/licenses/standard
 */

/**
 * CookieManager class for handling cookies in web projects.
 *
 * Usage Instructions:
 *
 * 1. Include the Script: Add cookieManager.js to your project via a <script> tag or import it as a module.
 *
 * <script src="cookieManager.js"></script>
 * Or in a module:
 * import CookieManager from './cookieManager.js';
 *
 * 2. Initialize
 *
 * const cookie = new CookieManager({
 *      expires: 60, // Default expiration: 60 minutes
 *      path: '/',
 *      secure: true,
 *      sameSite: 'Strict'
 * });
 *
 * 3. Examples
 *
 * // Set a cookie
 * cookie.setCookie('username', 'john_doe', 30);
 *
 * // Get a cookie
 * console.log(cookie.getCookie('username')); // 'john_doe'
 *
 * // Check if cookie exists
 * console.log(cookie.hasCookie('username')); // true
 *
 * // Update a cookie
 * cookie.updateCookie('username', 'jane_doe', 60);
 *
 * // Remove a cookie
 * cookie.removeCookie('username');
 *
 * // List all cookies
 * console.log(cookie.getAllCookies());
 *
 * // Clear all cookies
 * cookie.clearAllCookies();
 */
class CookieManager {
	/**
	 * Default cookie parameters.
	 * @private
	 */
	#defaults = {
		expires: null, // in minutes, null for session cookie
		path: '/',
		domain: '',
		secure: true,
		sameSite: 'Strict'
	};
	
	/**
	 * Initializes CookieManager with optional custom defaults.
	 * @param {Object} [customDefaults] - Custom default cookie parameters.
	 */
	constructor(customDefaults = {}) {
		this.#defaults = {...this.#defaults, ...customDefaults};
	}
	
	/**
	 * Validates if a value is non-empty (not null, undefined, or empty string).
	 * @private
	 * @param {*} value - Value to check.
	 * @returns {boolean} True if value is non-empty.
	 */
	#isFilled(value) {
		return value !== null && value !== undefined && value !== '';
	}
	
	/**
	 * Sets a cookie with the specified name, value, and options.
	 * @param {string} name - Cookie name.
	 * @param {string} value - Cookie value.
	 * @param {number|null} [expires] - Expiration in minutes (null for session cookie).
	 * @param {Object} [options] - Additional cookie options (path, domain, secure, sameSite).
	 */
	setCookie(name, value, expires = null, options = {}) {
		if (!this.#isFilled(name)) throw new Error('Cookie name is required.');
		
		const params = {...this.#defaults, ...options, expires};
		let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
		
		if (this.#isFilled(params.expires)) {
			const date = new Date();
			date.setTime(date.getTime() + params.expires * 60 * 1000);
			cookieString += `; expires=${date.toUTCString()}`;
		}
		
		if (this.#isFilled(params.path)) cookieString += `; path=${params.path}`;
		if (this.#isFilled(params.domain)) cookieString += `; domain=${params.domain}`;
		if (params.secure) cookieString += '; secure';
		if (this.#isFilled(params.sameSite)) cookieString += `; SameSite=${params.sameSite}`;
		
		document.cookie = cookieString;
	}
	
	/**
	 * Gets the value of a cookie by name.
	 * @param {string} name - Cookie name.
	 * @returns {string|null} Cookie value or null if not found.
	 */
	getCookie(name) {
		if (!this.#isFilled(name)) return null;
		
		const encName = `${encodeURIComponent(name)}=`;
		const cookies = document.cookie.split(';');
		
		for (let cookie of cookies) {
			cookie = cookie.trim();
			if (cookie.startsWith(encName)) {
				return decodeURIComponent(cookie.substring(encName.length));
			}
		}
		
		return null;
	}
	
	/**
	 * Checks if a cookie exists and has a non-empty value.
	 * @param {string} name - Cookie name.
	 * @returns {boolean} True if cookie exists.
	 */
	hasCookie(name) {
		return this.#isFilled(this.getCookie(name));
	}
	
	/**
	 * Removes a cookie by setting its expiration to the past.
	 * @param {string} name - Cookie name.
	 * @param {Object} [options] - Options like path or domain to match the cookie.
	 */
	removeCookie(name, options = {}) {
		this.setCookie(name, '', -1, options);
	}
	
	/**
	 * Updates an existing cookie's value and/or options.
	 * @param {string} name - Cookie name.
	 * @param {string} newValue - New cookie value.
	 * @param {number|null} [expires] - New expiration in minutes.
	 * @param {Object} [options] - New cookie options.
	 * @returns {boolean} True if cookie was updated, false if it didn't exist.
	 */
	updateCookie(name, newValue, expires = null, options = {}) {
		if (!this.hasCookie(name)) return false;
		this.setCookie(name, newValue, expires, options);
		return true;
	}
	
	/**
	 * Lists all cookies as an object.
	 * @returns {Object} Object with cookie names as keys and values.
	 */
	getAllCookies() {
		const cookies = document.cookie.split(';');
		const result = {};
		
		for (let cookie of cookies) {
			cookie = cookie.trim();
			if (cookie) {
				const [name, value] = cookie.split('=').map(part => decodeURIComponent(part));
				result[name] = value;
			}
		}
		
		return result;
	}
	
	/**
	 * Clears all cookies.
	 * @param {Object} [options] - Options like path or domain to match cookies.
	 */
	clearAllCookies(options = {}) {
		const cookies = this.getAllCookies();
		for (const name in cookies) {
			this.removeCookie(name, options);
		}
	}
}

// Export for module-based projects or attach to window for global use
if (typeof module !== 'undefined' && module.exports) {
	module.exports = CookieManager;
} else {
	window.CookieManager = CookieManager;
}

/*! @license DOMPurify 3.2.5 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.5/LICENSE */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):(e="undefined"!=typeof globalThis?globalThis:e||self).DOMPurify=t()}(this,(function(){"use strict";const{entries:e,setPrototypeOf:t,isFrozen:n,getPrototypeOf:o,getOwnPropertyDescriptor:r}=Object;let{freeze:i,seal:a,create:l}=Object,{apply:c,construct:s}="undefined"!=typeof Reflect&&Reflect;i||(i=function(e){return e}),a||(a=function(e){return e}),c||(c=function(e,t,n){return e.apply(t,n)}),s||(s=function(e,t){return new e(...t)});const u=R(Array.prototype.forEach),m=R(Array.prototype.lastIndexOf),p=R(Array.prototype.pop),f=R(Array.prototype.push),d=R(Array.prototype.splice),h=R(String.prototype.toLowerCase),g=R(String.prototype.toString),T=R(String.prototype.match),y=R(String.prototype.replace),E=R(String.prototype.indexOf),A=R(String.prototype.trim),_=R(Object.prototype.hasOwnProperty),S=R(RegExp.prototype.test),b=(N=TypeError,function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return s(N,t)});var N;function R(e){return function(t){t instanceof RegExp&&(t.lastIndex=0);for(var n=arguments.length,o=new Array(n>1?n-1:0),r=1;r<n;r++)o[r-1]=arguments[r];return c(e,t,o)}}function w(e,o){let r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:h;t&&t(e,null);let i=o.length;for(;i--;){let t=o[i];if("string"==typeof t){const e=r(t);e!==t&&(n(o)||(o[i]=e),t=e)}e[t]=!0}return e}function O(e){for(let t=0;t<e.length;t++){_(e,t)||(e[t]=null)}return e}function D(t){const n=l(null);for(const[o,r]of e(t)){_(t,o)&&(Array.isArray(r)?n[o]=O(r):r&&"object"==typeof r&&r.constructor===Object?n[o]=D(r):n[o]=r)}return n}function v(e,t){for(;null!==e;){const n=r(e,t);if(n){if(n.get)return R(n.get);if("function"==typeof n.value)return R(n.value)}e=o(e)}return function(){return null}}const L=i(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),C=i(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),x=i(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),I=i(["animate","color-profile","cursor","discard","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),M=i(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover","mprescripts"]),k=i(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),U=i(["#text"]),z=i(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","popover","popovertarget","popovertargetaction","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","wrap","xmlns","slot"]),P=i(["accent-height","accumulate","additive","alignment-baseline","amplitude","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","exponent","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","intercept","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","slope","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","tablevalues","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),H=i(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),F=i(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),B=a(/\{\{[\w\W]*|[\w\W]*\}\}/gm),W=a(/<%[\w\W]*|[\w\W]*%>/gm),G=a(/\$\{[\w\W]*/gm),Y=a(/^data-[\-\w.\u00B7-\uFFFF]+$/),j=a(/^aria-[\-\w]+$/),X=a(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),q=a(/^(?:\w+script|data):/i),$=a(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),K=a(/^html$/i),V=a(/^[a-z][.\w]*(-[.\w]+)+$/i);var Z=Object.freeze({__proto__:null,ARIA_ATTR:j,ATTR_WHITESPACE:$,CUSTOM_ELEMENT:V,DATA_ATTR:Y,DOCTYPE_NAME:K,ERB_EXPR:W,IS_ALLOWED_URI:X,IS_SCRIPT_OR_DATA:q,MUSTACHE_EXPR:B,TMPLIT_EXPR:G});const J=1,Q=3,ee=7,te=8,ne=9,oe=function(){return"undefined"==typeof window?null:window};var re=function t(){let n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:oe();const o=e=>t(e);if(o.version="3.2.5",o.removed=[],!n||!n.document||n.document.nodeType!==ne||!n.Element)return o.isSupported=!1,o;let{document:r}=n;const a=r,c=a.currentScript,{DocumentFragment:s,HTMLTemplateElement:N,Node:R,Element:O,NodeFilter:B,NamedNodeMap:W=n.NamedNodeMap||n.MozNamedAttrMap,HTMLFormElement:G,DOMParser:Y,trustedTypes:j}=n,q=O.prototype,$=v(q,"cloneNode"),V=v(q,"remove"),re=v(q,"nextSibling"),ie=v(q,"childNodes"),ae=v(q,"parentNode");if("function"==typeof N){const e=r.createElement("template");e.content&&e.content.ownerDocument&&(r=e.content.ownerDocument)}let le,ce="";const{implementation:se,createNodeIterator:ue,createDocumentFragment:me,getElementsByTagName:pe}=r,{importNode:fe}=a;let de={afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]};o.isSupported="function"==typeof e&&"function"==typeof ae&&se&&void 0!==se.createHTMLDocument;const{MUSTACHE_EXPR:he,ERB_EXPR:ge,TMPLIT_EXPR:Te,DATA_ATTR:ye,ARIA_ATTR:Ee,IS_SCRIPT_OR_DATA:Ae,ATTR_WHITESPACE:_e,CUSTOM_ELEMENT:Se}=Z;let{IS_ALLOWED_URI:be}=Z,Ne=null;const Re=w({},[...L,...C,...x,...M,...U]);let we=null;const Oe=w({},[...z,...P,...H,...F]);let De=Object.seal(l(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),ve=null,Le=null,Ce=!0,xe=!0,Ie=!1,Me=!0,ke=!1,Ue=!0,ze=!1,Pe=!1,He=!1,Fe=!1,Be=!1,We=!1,Ge=!0,Ye=!1,je=!0,Xe=!1,qe={},$e=null;const Ke=w({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]);let Ve=null;const Ze=w({},["audio","video","img","source","image","track"]);let Je=null;const Qe=w({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),et="http://www.w3.org/1998/Math/MathML",tt="http://www.w3.org/2000/svg",nt="http://www.w3.org/1999/xhtml";let ot=nt,rt=!1,it=null;const at=w({},[et,tt,nt],g);let lt=w({},["mi","mo","mn","ms","mtext"]),ct=w({},["annotation-xml"]);const st=w({},["title","style","font","a","script"]);let ut=null;const mt=["application/xhtml+xml","text/html"];let pt=null,ft=null;const dt=r.createElement("form"),ht=function(e){return e instanceof RegExp||e instanceof Function},gt=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(!ft||ft!==e){if(e&&"object"==typeof e||(e={}),e=D(e),ut=-1===mt.indexOf(e.PARSER_MEDIA_TYPE)?"text/html":e.PARSER_MEDIA_TYPE,pt="application/xhtml+xml"===ut?g:h,Ne=_(e,"ALLOWED_TAGS")?w({},e.ALLOWED_TAGS,pt):Re,we=_(e,"ALLOWED_ATTR")?w({},e.ALLOWED_ATTR,pt):Oe,it=_(e,"ALLOWED_NAMESPACES")?w({},e.ALLOWED_NAMESPACES,g):at,Je=_(e,"ADD_URI_SAFE_ATTR")?w(D(Qe),e.ADD_URI_SAFE_ATTR,pt):Qe,Ve=_(e,"ADD_DATA_URI_TAGS")?w(D(Ze),e.ADD_DATA_URI_TAGS,pt):Ze,$e=_(e,"FORBID_CONTENTS")?w({},e.FORBID_CONTENTS,pt):Ke,ve=_(e,"FORBID_TAGS")?w({},e.FORBID_TAGS,pt):{},Le=_(e,"FORBID_ATTR")?w({},e.FORBID_ATTR,pt):{},qe=!!_(e,"USE_PROFILES")&&e.USE_PROFILES,Ce=!1!==e.ALLOW_ARIA_ATTR,xe=!1!==e.ALLOW_DATA_ATTR,Ie=e.ALLOW_UNKNOWN_PROTOCOLS||!1,Me=!1!==e.ALLOW_SELF_CLOSE_IN_ATTR,ke=e.SAFE_FOR_TEMPLATES||!1,Ue=!1!==e.SAFE_FOR_XML,ze=e.WHOLE_DOCUMENT||!1,Fe=e.RETURN_DOM||!1,Be=e.RETURN_DOM_FRAGMENT||!1,We=e.RETURN_TRUSTED_TYPE||!1,He=e.FORCE_BODY||!1,Ge=!1!==e.SANITIZE_DOM,Ye=e.SANITIZE_NAMED_PROPS||!1,je=!1!==e.KEEP_CONTENT,Xe=e.IN_PLACE||!1,be=e.ALLOWED_URI_REGEXP||X,ot=e.NAMESPACE||nt,lt=e.MATHML_TEXT_INTEGRATION_POINTS||lt,ct=e.HTML_INTEGRATION_POINTS||ct,De=e.CUSTOM_ELEMENT_HANDLING||{},e.CUSTOM_ELEMENT_HANDLING&&ht(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(De.tagNameCheck=e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),e.CUSTOM_ELEMENT_HANDLING&&ht(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(De.attributeNameCheck=e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),e.CUSTOM_ELEMENT_HANDLING&&"boolean"==typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements&&(De.allowCustomizedBuiltInElements=e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),ke&&(xe=!1),Be&&(Fe=!0),qe&&(Ne=w({},U),we=[],!0===qe.html&&(w(Ne,L),w(we,z)),!0===qe.svg&&(w(Ne,C),w(we,P),w(we,F)),!0===qe.svgFilters&&(w(Ne,x),w(we,P),w(we,F)),!0===qe.mathMl&&(w(Ne,M),w(we,H),w(we,F))),e.ADD_TAGS&&(Ne===Re&&(Ne=D(Ne)),w(Ne,e.ADD_TAGS,pt)),e.ADD_ATTR&&(we===Oe&&(we=D(we)),w(we,e.ADD_ATTR,pt)),e.ADD_URI_SAFE_ATTR&&w(Je,e.ADD_URI_SAFE_ATTR,pt),e.FORBID_CONTENTS&&($e===Ke&&($e=D($e)),w($e,e.FORBID_CONTENTS,pt)),je&&(Ne["#text"]=!0),ze&&w(Ne,["html","head","body"]),Ne.table&&(w(Ne,["tbody"]),delete ve.tbody),e.TRUSTED_TYPES_POLICY){if("function"!=typeof e.TRUSTED_TYPES_POLICY.createHTML)throw b('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');if("function"!=typeof e.TRUSTED_TYPES_POLICY.createScriptURL)throw b('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');le=e.TRUSTED_TYPES_POLICY,ce=le.createHTML("")}else void 0===le&&(le=function(e,t){if("object"!=typeof e||"function"!=typeof e.createPolicy)return null;let n=null;const o="data-tt-policy-suffix";t&&t.hasAttribute(o)&&(n=t.getAttribute(o));const r="dompurify"+(n?"#"+n:"");try{return e.createPolicy(r,{createHTML:e=>e,createScriptURL:e=>e})}catch(e){return console.warn("TrustedTypes policy "+r+" could not be created."),null}}(j,c)),null!==le&&"string"==typeof ce&&(ce=le.createHTML(""));i&&i(e),ft=e}},Tt=w({},[...C,...x,...I]),yt=w({},[...M,...k]),Et=function(e){f(o.removed,{element:e});try{ae(e).removeChild(e)}catch(t){V(e)}},At=function(e,t){try{f(o.removed,{attribute:t.getAttributeNode(e),from:t})}catch(e){f(o.removed,{attribute:null,from:t})}if(t.removeAttribute(e),"is"===e)if(Fe||Be)try{Et(t)}catch(e){}else try{t.setAttribute(e,"")}catch(e){}},_t=function(e){let t=null,n=null;if(He)e="<remove></remove>"+e;else{const t=T(e,/^[\r\n\t ]+/);n=t&&t[0]}"application/xhtml+xml"===ut&&ot===nt&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");const o=le?le.createHTML(e):e;if(ot===nt)try{t=(new Y).parseFromString(o,ut)}catch(e){}if(!t||!t.documentElement){t=se.createDocument(ot,"template",null);try{t.documentElement.innerHTML=rt?ce:o}catch(e){}}const i=t.body||t.documentElement;return e&&n&&i.insertBefore(r.createTextNode(n),i.childNodes[0]||null),ot===nt?pe.call(t,ze?"html":"body")[0]:ze?t.documentElement:i},St=function(e){return ue.call(e.ownerDocument||e,e,B.SHOW_ELEMENT|B.SHOW_COMMENT|B.SHOW_TEXT|B.SHOW_PROCESSING_INSTRUCTION|B.SHOW_CDATA_SECTION,null)},bt=function(e){return e instanceof G&&("string"!=typeof e.nodeName||"string"!=typeof e.textContent||"function"!=typeof e.removeChild||!(e.attributes instanceof W)||"function"!=typeof e.removeAttribute||"function"!=typeof e.setAttribute||"string"!=typeof e.namespaceURI||"function"!=typeof e.insertBefore||"function"!=typeof e.hasChildNodes)},Nt=function(e){return"function"==typeof R&&e instanceof R};function Rt(e,t,n){u(e,(e=>{e.call(o,t,n,ft)}))}const wt=function(e){let t=null;if(Rt(de.beforeSanitizeElements,e,null),bt(e))return Et(e),!0;const n=pt(e.nodeName);if(Rt(de.uponSanitizeElement,e,{tagName:n,allowedTags:Ne}),e.hasChildNodes()&&!Nt(e.firstElementChild)&&S(/<[/\w!]/g,e.innerHTML)&&S(/<[/\w!]/g,e.textContent))return Et(e),!0;if(e.nodeType===ee)return Et(e),!0;if(Ue&&e.nodeType===te&&S(/<[/\w]/g,e.data))return Et(e),!0;if(!Ne[n]||ve[n]){if(!ve[n]&&Dt(n)){if(De.tagNameCheck instanceof RegExp&&S(De.tagNameCheck,n))return!1;if(De.tagNameCheck instanceof Function&&De.tagNameCheck(n))return!1}if(je&&!$e[n]){const t=ae(e)||e.parentNode,n=ie(e)||e.childNodes;if(n&&t){for(let o=n.length-1;o>=0;--o){const r=$(n[o],!0);r.__removalCount=(e.__removalCount||0)+1,t.insertBefore(r,re(e))}}}return Et(e),!0}return e instanceof O&&!function(e){let t=ae(e);t&&t.tagName||(t={namespaceURI:ot,tagName:"template"});const n=h(e.tagName),o=h(t.tagName);return!!it[e.namespaceURI]&&(e.namespaceURI===tt?t.namespaceURI===nt?"svg"===n:t.namespaceURI===et?"svg"===n&&("annotation-xml"===o||lt[o]):Boolean(Tt[n]):e.namespaceURI===et?t.namespaceURI===nt?"math"===n:t.namespaceURI===tt?"math"===n&&ct[o]:Boolean(yt[n]):e.namespaceURI===nt?!(t.namespaceURI===tt&&!ct[o])&&!(t.namespaceURI===et&&!lt[o])&&!yt[n]&&(st[n]||!Tt[n]):!("application/xhtml+xml"!==ut||!it[e.namespaceURI]))}(e)?(Et(e),!0):"noscript"!==n&&"noembed"!==n&&"noframes"!==n||!S(/<\/no(script|embed|frames)/i,e.innerHTML)?(ke&&e.nodeType===Q&&(t=e.textContent,u([he,ge,Te],(e=>{t=y(t,e," ")})),e.textContent!==t&&(f(o.removed,{element:e.cloneNode()}),e.textContent=t)),Rt(de.afterSanitizeElements,e,null),!1):(Et(e),!0)},Ot=function(e,t,n){if(Ge&&("id"===t||"name"===t)&&(n in r||n in dt))return!1;if(xe&&!Le[t]&&S(ye,t));else if(Ce&&S(Ee,t));else if(!we[t]||Le[t]){if(!(Dt(e)&&(De.tagNameCheck instanceof RegExp&&S(De.tagNameCheck,e)||De.tagNameCheck instanceof Function&&De.tagNameCheck(e))&&(De.attributeNameCheck instanceof RegExp&&S(De.attributeNameCheck,t)||De.attributeNameCheck instanceof Function&&De.attributeNameCheck(t))||"is"===t&&De.allowCustomizedBuiltInElements&&(De.tagNameCheck instanceof RegExp&&S(De.tagNameCheck,n)||De.tagNameCheck instanceof Function&&De.tagNameCheck(n))))return!1}else if(Je[t]);else if(S(be,y(n,_e,"")));else if("src"!==t&&"xlink:href"!==t&&"href"!==t||"script"===e||0!==E(n,"data:")||!Ve[e]){if(Ie&&!S(Ae,y(n,_e,"")));else if(n)return!1}else;return!0},Dt=function(e){return"annotation-xml"!==e&&T(e,Se)},vt=function(e){Rt(de.beforeSanitizeAttributes,e,null);const{attributes:t}=e;if(!t||bt(e))return;const n={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:we,forceKeepAttr:void 0};let r=t.length;for(;r--;){const i=t[r],{name:a,namespaceURI:l,value:c}=i,s=pt(a);let m="value"===a?c:A(c);if(n.attrName=s,n.attrValue=m,n.keepAttr=!0,n.forceKeepAttr=void 0,Rt(de.uponSanitizeAttribute,e,n),m=n.attrValue,!Ye||"id"!==s&&"name"!==s||(At(a,e),m="user-content-"+m),Ue&&S(/((--!?|])>)|<\/(style|title)/i,m)){At(a,e);continue}if(n.forceKeepAttr)continue;if(At(a,e),!n.keepAttr)continue;if(!Me&&S(/\/>/i,m)){At(a,e);continue}ke&&u([he,ge,Te],(e=>{m=y(m,e," ")}));const f=pt(e.nodeName);if(Ot(f,s,m)){if(le&&"object"==typeof j&&"function"==typeof j.getAttributeType)if(l);else switch(j.getAttributeType(f,s)){case"TrustedHTML":m=le.createHTML(m);break;case"TrustedScriptURL":m=le.createScriptURL(m)}try{l?e.setAttributeNS(l,a,m):e.setAttribute(a,m),bt(e)?Et(e):p(o.removed)}catch(e){}}}Rt(de.afterSanitizeAttributes,e,null)},Lt=function e(t){let n=null;const o=St(t);for(Rt(de.beforeSanitizeShadowDOM,t,null);n=o.nextNode();)Rt(de.uponSanitizeShadowNode,n,null),wt(n),vt(n),n.content instanceof s&&e(n.content);Rt(de.afterSanitizeShadowDOM,t,null)};return o.sanitize=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=null,r=null,i=null,l=null;if(rt=!e,rt&&(e="\x3c!--\x3e"),"string"!=typeof e&&!Nt(e)){if("function"!=typeof e.toString)throw b("toString is not a function");if("string"!=typeof(e=e.toString()))throw b("dirty is not a string, aborting")}if(!o.isSupported)return e;if(Pe||gt(t),o.removed=[],"string"==typeof e&&(Xe=!1),Xe){if(e.nodeName){const t=pt(e.nodeName);if(!Ne[t]||ve[t])throw b("root node is forbidden and cannot be sanitized in-place")}}else if(e instanceof R)n=_t("\x3c!----\x3e"),r=n.ownerDocument.importNode(e,!0),r.nodeType===J&&"BODY"===r.nodeName||"HTML"===r.nodeName?n=r:n.appendChild(r);else{if(!Fe&&!ke&&!ze&&-1===e.indexOf("<"))return le&&We?le.createHTML(e):e;if(n=_t(e),!n)return Fe?null:We?ce:""}n&&He&&Et(n.firstChild);const c=St(Xe?e:n);for(;i=c.nextNode();)wt(i),vt(i),i.content instanceof s&&Lt(i.content);if(Xe)return e;if(Fe){if(Be)for(l=me.call(n.ownerDocument);n.firstChild;)l.appendChild(n.firstChild);else l=n;return(we.shadowroot||we.shadowrootmode)&&(l=fe.call(a,l,!0)),l}let m=ze?n.outerHTML:n.innerHTML;return ze&&Ne["!doctype"]&&n.ownerDocument&&n.ownerDocument.doctype&&n.ownerDocument.doctype.name&&S(K,n.ownerDocument.doctype.name)&&(m="<!DOCTYPE "+n.ownerDocument.doctype.name+">\n"+m),ke&&u([he,ge,Te],(e=>{m=y(m,e," ")})),le&&We?le.createHTML(m):m},o.setConfig=function(){gt(arguments.length>0&&void 0!==arguments[0]?arguments[0]:{}),Pe=!0},o.clearConfig=function(){ft=null,Pe=!1},o.isValidAttribute=function(e,t,n){ft||gt({});const o=pt(e),r=pt(t);return Ot(o,r,n)},o.addHook=function(e,t){"function"==typeof t&&f(de[e],t)},o.removeHook=function(e,t){if(void 0!==t){const n=m(de[e],t);return-1===n?void 0:d(de[e],n,1)[0]}return p(de[e])},o.removeHooks=function(e){de[e]=[]},o.removeAllHooks=function(){de={afterSanitizeAttributes:[],afterSanitizeElements:[],afterSanitizeShadowDOM:[],beforeSanitizeAttributes:[],beforeSanitizeElements:[],beforeSanitizeShadowDOM:[],uponSanitizeAttribute:[],uponSanitizeElement:[],uponSanitizeShadowNode:[]}},o}();return re}));
//# sourceMappingURL=purify.min.js.map

/*
 * LaraClassifier - Classified Ads Web Application
 * Copyright (c) BeDigit. All Rights Reserved
 *
 * Website: https://laraclassifier.com
 * Author: Mayeul Akpovi (BeDigit - https://bedigit.com)
 *
 * LICENSE
 * -------
 * This software is provided under a license agreement and may only be used or copied
 * in accordance with its terms, including the inclusion of the above copyright notice.
 * As this software is sold exclusively on CodeCanyon,
 * please review the full license details here: https://codecanyon.net/licenses/standard
 */

/**
 * Class to manage dark mode based on app settings, user (database), cookie, or system preferences
 */
class ThemeDetector {
	#cookieManager;
	#isFromAdminPanel;
	#isDarkThemeEnabled;
	#isSystemThemeEnabled;
	#isLoggedUser;
	#userPreference;
	#cookieName;
	#cookieExpiresMinutes;
	#showIconOnly;
	#mediaQuery;
	#validPreferences = ['dark', 'light'];
	
	/**
	 * Initializes ThemeDetector
	 * @param {CookieManager} cookieManager - Instance of CookieManager for cookie operations
	 * @param {Object} [config={}] - Configuration object
	 * @param {boolean} [config.isFromAdminPanel=false] - Whether user is from the admin panel
	 * @param {boolean} [config.isDarkThemeEnabled=true] - Whether dark theme is allowed by app admin
	 * @param {boolean} [config.isSystemThemeEnabled=true] - Whether system/auto theme is allowed by app admin
	 * @param {boolean} [config.isLoggedUser=false] - Whether the current user is logged in
	 * @param {string|null} [config.userPreference=null] - User's theme preference from database ('dark', 'light', 'system', or null)
	 * @param {string} [config.cookieName='themePreference'] - Name of the cookie for theme preference
	 * @param {number} [config.cookieExpiresMinutes=60] - Cookie expiration in minutes
	 * @param {boolean} [config.showIconOnly=false] - Whether showing only icon is allowed
	 */
	constructor(cookieManager, config = {}) {
		if (!(cookieManager instanceof CookieManager)) {
			throw new Error('A valid CookieManager instance is required.');
		}
		
		this.#cookieManager = cookieManager;
		this.#isFromAdminPanel = config.isFromAdminPanel ?? false;
		this.#isDarkThemeEnabled = config.isDarkThemeEnabled ?? true;
		this.#isSystemThemeEnabled = config.isSystemThemeEnabled ?? true;
		this.#isLoggedUser = config.isLoggedUser ?? false;
		if (this.#isSystemThemeEnabled) {
			this.#validPreferences.push('system');
		}
		this.#userPreference = this.#validPreferences.includes(config.userPreference) ? config.userPreference : null;
		this.#cookieName = config.cookieName ?? 'themePreference';
		this.#cookieExpiresMinutes = config.cookieExpiresMinutes ?? 365 * 24 * 60; // 1 year in minutes
		this.#showIconOnly = config.showIconOnly ?? false;
		this.#mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		
		// Initial theme setup
		this.#updateTheme();
		
		// Update the theme switcher on document load or on theme change manually
		const themeSwitcherEl = document.getElementById('themeSwitcher');
		if (themeSwitcherEl) {
			this.updateThemeSwitcher(themeSwitcherEl, null);
		}
		
		// Listen for system theme changes
		this.#mediaQuery.addEventListener('change', this.#handleSystemThemeChange.bind(this));
	}
	
	/**
	 * Check if dark mode is enabled based on preferences without updating the theme
	 * @static
	 * @param {CookieManager} cookieManager - Instance of CookieManager for cookie operations
	 * @param {Object} [config={}] - Configuration object
	 * @param {boolean} [config.isDarkThemeEnabled=true] - Whether dark theme is allowed by app admin
	 * @param {boolean} [config.isSystemThemeEnabled=true] - Whether system/auto theme is allowed by app admin
	 * @param {boolean} [config.isLoggedUser=false] - Whether the current user is logged in
	 * @param {string|null} [config.userPreference=null] - User's theme preference from database ('dark', 'light', 'system', or null)
	 * @param {string} [config.cookieName='themePreference'] - Name of the cookie for theme preference
	 * @returns {boolean} True if dark mode should be applied
	 */
	static checkDarkTheme(cookieManager, config = {}) {
		if (!(cookieManager instanceof CookieManager)) {
			throw new Error('A valid CookieManager instance is required.');
		}
		
		const isDarkThemeEnabled = config.isDarkThemeEnabled ?? true;
		const isSystemThemeEnabled = config.isSystemThemeEnabled ?? true;
		const isLoggedUser = config.isLoggedUser ?? false;
		const validPreferences = ['dark', 'light'];
		if (isSystemThemeEnabled) {
			validPreferences.push('system');
		}
		const userPreference = validPreferences.includes(config.userPreference) ? config.userPreference : null;
		const cookieName = config.cookieName ?? 'themePreference';
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		
		// If dark mode is disabled by app settings, return false
		if (!isDarkThemeEnabled) return false;
		
		// If user is logged in and has a database preference, use it
		if (isLoggedUser && userPreference !== null) {
			if (userPreference === 'system') return mediaQuery.matches;
			return userPreference === 'dark';
		}
		
		// Check cookie preference
		const cookiePreference = cookieManager.getCookie(cookieName);
		if (validPreferences.includes(cookiePreference)) {
			if (cookiePreference === 'system') return mediaQuery.matches;
			return cookiePreference === 'dark';
		}
		
		// Fall back to system preference
		return (isSystemThemeEnabled && mediaQuery.matches);
	}
	
	/**
	 * Check if dark mode is enabled based on preferences
	 * @returns {boolean} True if dark mode should be applied
	 */
	isDarkThemeEnabled() {
		const currentTheme = this.getTheme();
		
		if (currentTheme === 'system') {
			return this.#mediaQuery.matches;
		}
		
		return currentTheme === 'dark';
	}
	
	/**
	 * Get the current theme
	 * @returns {*|string|null}
	 */
	getTheme() {
		// If dark mode is disabled by app settings, always return false
		if (!this.#isFromAdminPanel && !this.#isDarkThemeEnabled) return null;
		
		// If user is logged in and has a database preference, use it
		if (this.#isLoggedUser && this.#userPreference !== null) {
			return this.#userPreference;
		}
		
		// Check cookie preference
		const cookiePreference = this.#cookieManager.getCookie(this.#cookieName);
		if (this.#validPreferences.includes(cookiePreference)) {
			return cookiePreference;
		}
		
		// Fall back to system preference
		return this.#isSystemThemeEnabled ? 'system' : null;
	}
	
	/**
	 * Handle theme changes (system or user-initiated)
	 * @private
	 */
	#updateTheme() {
		if (this.isDarkThemeEnabled()) {
			this.#applyDarkMode();
		} else {
			this.#removeDarkMode();
		}
	}
	
	/**
	 * Apply dark mode styles
	 * @private
	 */
	#applyDarkMode() {
		// [Business Code]
		// [Add any dark mode styling here]
		if (this.#isFromAdminPanel) {
			document.documentElement.setAttribute('data-bs-theme', 'dark');
			document.documentElement.setAttribute('data-theme', 'dark');
			document.body.setAttribute('data-theme', 'dark');
			
			const mainWrapperEl = $('#main-wrapper');
			if (mainWrapperEl.length) {
				const themeConfig = {...adminPanelSettings || {}};
				themeConfig.Theme = true;
				mainWrapperEl.AdminSettings(themeConfig);
			}
		} else {
			// document.documentElement.setAttribute('theme', 'dark');
			document.documentElement.setAttribute('data-bs-theme', 'dark');
			
			const logoDarkEl = document.querySelector('.navbar .logo img.dark-logo');
			const logoLightEl = document.querySelector('.navbar .logo img.light-logo');
			if (logoDarkEl && logoLightEl) {
				logoDarkEl.style.setProperty('display', 'none');
				logoLightEl.style.setProperty('display', 'block');
			}
		}
		
		const recaptchaEls = document.querySelectorAll('.g-recaptcha');
		if (recaptchaEls.length > 0) {
			recaptchaEls.forEach(item => {
				item.setAttribute('data-theme', 'dark');
			});
		}
	}
	
	/**
	 * Remove dark mode styles
	 * @private
	 */
	#removeDarkMode() {
		// [Business Code]
		// [Add any light mode styling here]
		if (this.#isFromAdminPanel) {
			document.documentElement.removeAttribute('data-bs-theme');
			document.documentElement.setAttribute('data-theme', 'light');
			document.body.setAttribute('data-theme', 'light');
			
			const mainWrapperEl = $('#main-wrapper');
			if (mainWrapperEl.length) {
				const themeConfig = {...adminPanelSettings || {}};
				themeConfig.Theme = false;
				mainWrapperEl.AdminSettings(themeConfig);
			}
		} else {
			// document.documentElement.setAttribute('theme', 'light');
			document.documentElement.removeAttribute('data-bs-theme');
			
			const logoDarkEl = document.querySelector('.navbar .logo img.dark-logo');
			const logoLightEl = document.querySelector('.navbar .logo img.light-logo');
			if (logoDarkEl && logoLightEl) {
				logoDarkEl.style.setProperty('display', 'block');
				logoLightEl.style.setProperty('display', 'none');
			}
		}
		
		const recaptchaEls = document.querySelectorAll('.g-recaptcha');
		if (recaptchaEls.length > 0) {
			recaptchaEls.forEach(item => {
				item.setAttribute('data-theme', 'light');
			});
		}
	}
	
	/**
	 * Update the theme switcher selection (If it is available)
	 * @param themeSwitcherEl
	 * @param selectedTheme
	 */
	updateThemeSwitcher(themeSwitcherEl, selectedTheme = null) {
		const currentTheme = this.getTheme();
		
		// [Business Code]
		// If the theme switcher is available, then update its UI.
		if (!themeSwitcherEl) {
			return;
		}
		
		const buttonEl = themeSwitcherEl.querySelector('.dropdown-toggle');
		const buttonElSpanLarge = themeSwitcherEl.querySelector('.dropdown-toggle span.large-screen');
		const buttonElSpanSmall = themeSwitcherEl.querySelector('.dropdown-toggle span.small-screen');
		const menuItemsEls = themeSwitcherEl.querySelectorAll('a.dropdown-item, li.dropdown-item a.nav-link');
		
		if (!buttonEl || menuItemsEls.length <= 0) {
			return;
		}
		
		const buttonTheme = buttonEl.getAttribute('data-theme');
		menuItemsEls.forEach(item => {
			// Get the selected theme data
			const itemTheme = item.getAttribute('data-theme');
			const itemLabel = item.innerHTML.trim();
			
			let formattedItemLabel = itemLabel;
			if (this.#showIconOnly) {
				const icon = item.querySelector('i');
				if (icon) {
					formattedItemLabel = icon.outerHTML;
				}
			}
			
			const doesSwitcherCanBeUpdated = (
				(
					selectedTheme === null
					&& itemTheme === currentTheme
					&& buttonTheme !== currentTheme
				)
				|| (
					selectedTheme !== null
					&& itemTheme === selectedTheme
					&& buttonTheme !== selectedTheme
				)
			);
			
			if (doesSwitcherCanBeUpdated) {
				const newTheme = selectedTheme ? selectedTheme : currentTheme;
				
				// Update button data and HTML label
				buttonEl.setAttribute('data-theme', newTheme);
				
				if (buttonElSpanLarge && buttonElSpanSmall) {
					buttonElSpanLarge.innerHTML = DOMPurify.sanitize(formattedItemLabel);
					buttonElSpanSmall.innerHTML = DOMPurify.sanitize(itemLabel);
				} else {
					// Sanitization of the HTML to prevent potential XSS attacks by escaping unsafe HTML.
					// DOMPurify is used for better security.
					buttonEl.innerHTML = DOMPurify.sanitize(formattedItemLabel);
				}
				
				// Remove active class from all items
				menuItemsEls.forEach(i => i.classList.remove('active'));
				
				// Add active class to selected item
				item.classList.add('active');
			}
		});
	}
	
	/**
	 * Handle system theme changes
	 * @private
	 * @param {MediaQueryListEvent} e - The media query change event
	 */
	#handleSystemThemeChange(e) {
		// Only update if no user (database) or cookie preference is set, or if either is 'system'
		if (this.#isLoggedUser && this.#userPreference !== null && this.#userPreference !== 'system') {
			return;
		}
		
		if (this.#cookieManager.hasCookie(this.#cookieName) && this.#cookieManager.getCookie(this.#cookieName) !== 'system') {
			return;
		}
		
		this.#updateTheme();
		
		// [Business Code]
		// If the theme switcher is available, then update its UI.
		const themeSwitcherEl = document.getElementById('themeSwitcher');
		if (themeSwitcherEl) {
			const buttonEl = themeSwitcherEl.querySelector('.dropdown-toggle');
			if (buttonEl) {
				const selectedTheme = buttonEl.getAttribute('data-theme');
				this.updateThemeSwitcher(themeSwitcherEl, selectedTheme);
			}
		}
	}
	
	/**
	 * Set user theme preference (cookie or database) and update theme
	 * @param {string} theme - 'dark', 'light', or 'system'
	 * @param {Function} [saveToDatabase] - Optional callback to save preference to database
	 */
	setUserTheme(theme, saveToDatabase) {
		if (!this.#validPreferences.includes(theme)) {
			throw new Error("Theme must be " + this.#validPreferences.join(', ') + ".");
		}
		
		if (theme === 'system') {
			if (this.#isSystemThemeEnabled) {
				this.#cookieManager.removeCookie(this.#cookieName);
				if (this.#isLoggedUser && saveToDatabase) {
					saveToDatabase('system'); // Save to database
					this.#userPreference = 'system'; // Update local preference
				}
			}
		} else {
			this.#cookieManager.setCookie(this.#cookieName, theme, this.#cookieExpiresMinutes);
			if (this.#isLoggedUser && saveToDatabase) {
				saveToDatabase(theme); // Save to database
				this.#userPreference = theme; // Update local preference
			}
		}
		
		this.#updateTheme();
	}
	
	/**
	 * Save user preference to database (for logged-in users)
	 * @param {string} theme - 'dark', 'light', or 'system'
	 * @param {Function} saveToDatabase - Callback to save preference to database
	 */
	saveUserPreference(theme, saveToDatabase) {
		if (!this.#isLoggedUser) {
			throw new Error('Cannot save user preference: user is not logged in.');
		}
		if (!saveToDatabase) {
			throw new Error('A saveToDatabase callback is required.');
		}
		if (!this.#validPreferences.includes(theme)) {
			throw new Error("Theme must be " + this.#validPreferences.join(', ') + ".");
		}
		
		saveToDatabase(theme);
		this.#userPreference = theme; // Update local userPreference
		
		this.#updateTheme();
	}
}

// Export for module-based projects or attach to window for global use
if (typeof module !== 'undefined' && module.exports) {
	module.exports = ThemeDetector;
} else {
	window.ThemeDetector = ThemeDetector;
}

// Usage example:
// const cookieManager = new CookieManager({ expires: 60, path: '/', secure: true, sameSite: 'Strict' });
// const config = {
//     isDarkThemeEnabled: true,
//     isLoggedUser: true,
//     userPreference: 'dark',
//     cookieName: 'custom_theme',
//     cookieExpiresMinutes: 30 * 24 * 60 // 30 days
// };

// Check dark theme without updating
// const isDark = ThemeDetector.checkDarkTheme(cookieManager, config);
// console.log(isDark); // true or false, use for third-party plugins

// Initialize ThemeDetector for theme management
// const theme = new ThemeDetector(cookieManager, config);
// theme.setUserTheme('light', (theme) => {
//     // Example: API call to save theme to database
//     fetch('/api/user/preferences', {
//         method: 'POST',
//         body: JSON.stringify({ theme })
//     });
// });
// theme.saveUserPreference('system', (theme) => {
//     // Example: API call to save theme to database
//     fetch('/api/user/preferences', {
//         method: 'POST',
//         body: JSON.stringify({ theme })
//     });
// });

/*
 * LaraClassifier - Classified Ads Web Application
 * Copyright (c) BeDigit. All Rights Reserved
 *
 * Website: https://laraclassifier.com
 * Author: Mayeul Akpovi (BeDigit - https://bedigit.com)
 *
 * LICENSE
 * -------
 * This software is provided under a license agreement and may only be used or copied
 * in accordance with its terms, including the inclusion of the above copyright notice.
 * As this software is sold exclusively on CodeCanyon,
 * please review the full license details here: https://codecanyon.net/licenses/standard
 */

if (typeof cookieParams === 'undefined') {
	var cookieExpiresMinutes = 30 * 24 * 60; /* 30 days */
	var cookieParams = {
		expires: cookieExpiresMinutes,
		path: '/',
		secure: true,
		sameSite: 'Strict'
	};
}
if (typeof isAdminPanel === 'undefined') {
	var isAdminPanel = false;
}
if (typeof isSettingsAppDarkModeEnabled === 'undefined') {
	var isSettingsAppDarkModeEnabled = false;
}
if (typeof isSettingsAppSystemThemeEnabled === 'undefined') {
	var isSettingsAppSystemThemeEnabled = false;
}
if (typeof isLoggedUser === 'undefined') {
	var isLoggedUser = false;
}
if (typeof userThemePreference === 'undefined') {
	var userThemePreference = null;
}
if (typeof showIconOnly === 'undefined') {
	var showIconOnly = false;
}

onDocumentReady((event) => {
	
	const cookieManager = new CookieManager(cookieParams);
	const config = {
		isFromAdminPanel: isAdminPanel,
		isDarkThemeEnabled: isSettingsAppDarkModeEnabled,
		isSystemThemeEnabled: isSettingsAppSystemThemeEnabled,
		isLoggedUser: isLoggedUser,
		userPreference: userThemePreference,
		cookieExpiresMinutes: cookieParams.expires,
		showIconOnly: showIconOnly
	};
	
	/* Update the theme preference on page load */
	const themeDetector = new ThemeDetector(cookieManager, config);
	
	/* Set or unset the theme preference from the theme switcher */
	const themeSwitcherEl = document.getElementById('themeSwitcher');
	if (themeSwitcherEl) {
		const buttonEl = themeSwitcherEl.querySelector('.dropdown-toggle');
		const buttonElSpanLarge = themeSwitcherEl.querySelector('.dropdown-toggle span.large-screen');
		const buttonElSpanSmall = themeSwitcherEl.querySelector('.dropdown-toggle span.small-screen');
		const menuItemsEls = themeSwitcherEl.querySelectorAll('a.dropdown-item, li.dropdown-item a.nav-link');
		
		if (buttonEl && menuItemsEls.length > 0) {
			menuItemsEls.forEach(item => {
				item.addEventListener('click', function (e) {
					e.preventDefault();
					
					// Get the selected theme data
					const csrfToken = this.getAttribute('data-csrf-token');
					const userId = this.getAttribute('data-user-id');
					const selectedTheme = this.getAttribute('data-theme');
					const selectedLabel = this.innerHTML.trim();
					
					let formattedSelectedLabel = selectedLabel;
					if (showIconOnly) {
						const icon = this.querySelector('i');
						if (icon) {
							formattedSelectedLabel = icon.outerHTML;
						}
					}
					
					// Update button data and HTML label
					buttonEl.setAttribute('data-theme', selectedTheme);
					
					if (buttonElSpanLarge && buttonElSpanSmall) {
						buttonElSpanLarge.innerHTML = DOMPurify.sanitize(formattedSelectedLabel);
						buttonElSpanSmall.innerHTML = DOMPurify.sanitize(selectedLabel);
					} else {
						// Sanitization of the HTML to prevent potential XSS attacks by escaping unsafe HTML.
						// DOMPurify is used for better security.
						buttonEl.innerHTML = DOMPurify.sanitize(formattedSelectedLabel);
					}
					
					// Remove active class from all items
					menuItemsEls.forEach(i => i.classList.remove('active'));
					
					// Add active class to selected item
					this.classList.add('active');
					
					// Save the selected theme in cookie (guest) or in database (logged-in user)
					themeDetector.setUserTheme(selectedTheme, (theme) => saveThemeToDatabase(csrfToken, userId, theme));
				});
			});
		}
	}
	
});

/**
 * Set the dark mode for a given user in the Database
 *
 * @param csrfToken
 * @param userId
 * @param theme
 */
function saveThemeToDatabase(csrfToken, userId, theme) {
	let url = `${siteUrl}/account/save-theme-preference`;
	let data = {
		'user_id': userId,
		'theme': theme,
		'_token': csrfToken
	};
	
	httpRequest('post', url, data).then(json => {
		const defaultErrorMessage = langLayout.themePreference.error || 'Unknown error';
		
		// Error Found (e.g. Demo Restriction)
		if (typeof json.success !== 'undefined' && typeof json.error !== 'undefined') {
			let errorMessage = json.error || defaultErrorMessage;
			errorMessage = (typeof errorMessage === 'string') ? errorMessage : defaultErrorMessage;
			
			if (!json.success) {
				jsAlert(errorMessage, 'error');
				return;
			} else {
				throw new Error(errorMessage);
			}
		}
		
		// Required Response Data Missing
		if (typeof json.theme === 'undefined' || typeof json.message === 'undefined') {
			jsAlert(defaultErrorMessage, 'error');
			return;
		}
		
		jsAlert(json.message, 'success');
		
	}).catch(error => {
		jsAlert(error, 'error', false, true);
	});
}

/**
 * Check if dark theme is enabled
 * @returns {boolean}
 */
function isDarkThemeEnabled() {
	const cookieManager = new CookieManager(cookieParams);
	const config = {
		isDarkThemeEnabled: isSettingsAppDarkModeEnabled,
		isSystemThemeEnabled: isSettingsAppSystemThemeEnabled,
		isLoggedUser: isLoggedUser,
		userPreference: userThemePreference,
		cookieExpiresMinutes: cookieParams.expires
	};
	
	return ThemeDetector.checkDarkTheme(cookieManager, config);
}

/**
 * Check if dark theme is enabled in the DOM root (i.e. with <html> attribute)
 * @returns {boolean}
 */
function isDarkThemeEnabledInDomRoot() {
	const domElement = document.documentElement;
	if (!domElement) return false;
	
	const dataBsThemeValue = domElement.getAttribute('data-bs-theme');
	
	return (dataBsThemeValue === 'dark');
}


const fgTranslations = {
	en: {
		error_form_not_found: 'Form not found',
		unsaved_changes_prompt: 'You have unsaved changes. Are you sure you want to leave?'
	},
	fr: {
		error_form_not_found: 'Formulaire non trouvé',
		unsaved_changes_prompt: 'Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter ?'
	},
	es: {
		error_form_not_found: 'Formulario no encontrado',
		unsaved_changes_prompt: 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?'
	},
	ar: {
		error_form_not_found: 'النموذج غير موجود',
		unsaved_changes_prompt: 'لديك تغييرات غير محفوظة. هل أنت متأكد أنك تريد المغادرة؟'
	},
	pt: {
		error_form_not_found: 'Formulário não encontrado',
		unsaved_changes_prompt: 'Você tem alterações não salvas. Tem certeza de que deseja sair?'
	},
	de: {
		error_form_not_found: 'Formular nicht gefunden',
		unsaved_changes_prompt: 'Sie haben ungespeicherte Änderungen. Möchten Sie wirklich verlassen?'
	},
	it: {
		error_form_not_found: 'Modulo non trovato',
		unsaved_changes_prompt: 'Hai modifiche non salvate. Sei sicuro di voler uscire?'
	},
	tr: {
		error_form_not_found: 'Form bulunamadı',
		unsaved_changes_prompt: 'Kaydedilmemiş değişiklikleriniz var. Ayrılmak istediğinizden emin misiniz?'
	},
	ru: {
		error_form_not_found: 'Форма не найдена',
		unsaved_changes_prompt: 'У вас есть несохраненные изменения. Вы уверены, что хотите уйти?'
	},
	hi: {
		error_form_not_found: 'फॉर्म नहीं मिला',
		unsaved_changes_prompt: 'आपके पास असहेजे गए परिवर्तन हैं। क्या आप वाकई छोड़ना चाहते हैं?'
	},
	bn: {
		error_form_not_found: 'ফর্ম পাওয়া যায়নি',
		unsaved_changes_prompt: 'আপনার অসংরক্ষিত পরিবর্তন আছে। আপনি কি নিশ্চিতভাবে চলে যেতে চান?'
	},
	zh: {
		error_form_not_found: '未找到表单',
		unsaved_changes_prompt: '您有未保存的更改。确定要离开吗？'
	},
	ja: {
		error_form_not_found: 'フォームが見つかりません',
		unsaved_changes_prompt: '保存されていない変更があります。本当に離れますか？'
	},
	th: {
		error_form_not_found: 'ไม่พบแบบฟอร์ม',
		unsaved_changes_prompt: 'คุณมีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก แน่ใจหรือไม่ว่าต้องการออก?'
	},
	ro: {
		error_form_not_found: 'Formularul nu a fost găsit',
		unsaved_changes_prompt: 'Aveți modificări nesalvate. Sigur doriți să părăsiți?'
	},
	ka: {
		error_form_not_found: 'ფორმა ვერ მოიძებნა',
		unsaved_changes_prompt: 'თქვენ გაქვთ შეუნახავი ცვლილებები. დარწმუნებული ხართ, რომ გსურთ დატოვება?'
	},
	he: {
		error_form_not_found: 'הטופס לא נמצא',
		unsaved_changes_prompt: 'יש לך שינויים שלא נשמרו. האם אתה בטוח שברצונך לעזוב?'
	},
	nl: {
		error_form_not_found: 'Formulier niet gevonden',
		unsaved_changes_prompt: 'Je hebt niet-opgeslagen wijzigingen. Weet je zeker dat je wilt vertrekken?'
	},
	nb: {
		error_form_not_found: 'Skjema ikke funnet',
		unsaved_changes_prompt: 'Du har ulagrede endringer. Er du sikker på at du vil forlate?'
	},
	uk: {
		error_form_not_found: 'Форму не знайдено',
		unsaved_changes_prompt: 'У вас є незбережені зміни. Ви впевнені, що хочете піти?'
	},
	pl: {
		error_form_not_found: 'Formularz nie znaleziony',
		unsaved_changes_prompt: 'Masz niezapisane zmiany. Czy na pewno chcesz opuścić?'
	},
	el: {
		error_form_not_found: 'Η φόρμα δεν βρέθηκε',
		unsaved_changes_prompt: 'Έχετε μη αποθηκευμένες αλλαγές. Είστε σίγουροι ότι θέλετε να φύγετε;'
	},
	da: {
		error_form_not_found: 'Formular ikke fundet',
		unsaved_changes_prompt: 'Du har ikke-gemte ændringer. Er du sikker på, at du vil forlade?'
	},
	sv: {
		error_form_not_found: 'Formulär ej hittat',
		unsaved_changes_prompt: 'Du har osparade ändringar. Är du säker på att du vill lämna?'
	},
	fi: {
		error_form_not_found: 'Lomaketta ei löydy',
		unsaved_changes_prompt: 'Sinulla on tallentamattomia muutoksia. Haluatko varmasti poistua?'
	},
	hu: {
		error_form_not_found: 'Az űrlap nem található',
		unsaved_changes_prompt: 'Mentetlen módosításaid vannak. Biztosan el akarsz menni?'
	},
	sr: {
		error_form_not_found: 'Форма није пронађена',
		unsaved_changes_prompt: 'Имате несачуване промене. Да ли сте сигурни да желите да напустите?'
	},
	cs: {
		error_form_not_found: 'Formulář nenalezen',
		unsaved_changes_prompt: 'Máte neuložené změny. Opravdu chcete odejít?'
	},
	bg: {
		error_form_not_found: 'Формулярът не е намерен',
		unsaved_changes_prompt: 'Имате незапазени промени. Сигурни ли сте, че искате да напуснете?'
	},
	hr: {
		error_form_not_found: 'Obrazac nije pronađen',
		unsaved_changes_prompt: 'Imate nespremljene promjene. Jeste li sigurni da želite otići?'
	},
	et: {
		error_form_not_found: 'Vormi ei leitud',
		unsaved_changes_prompt: 'Sul on salvestamata muudatusi. Kas oled kindel, et soovid lahkuda?'
	},
	lt: {
		error_form_not_found: 'Forma nerasta',
		unsaved_changes_prompt: 'Turite neišsaugotų pakeitimų. Ar tikrai norite išeiti?'
	},
	lv: {
		error_form_not_found: 'Forma nav atrasta',
		unsaved_changes_prompt: 'Jums ir nesaglabātas izmaiņas. Vai tiešām vēlaties pamest?'
	},
	sk: {
		error_form_not_found: 'Formulár sa nenašiel',
		unsaved_changes_prompt: 'Máte neuložené zmeny. Naozaj chcete odísť?'
	},
	sl: {
		error_form_not_found: 'Obrazec ni najden',
		unsaved_changes_prompt: 'Imate neshranjene spremembe. Ali ste prepričani, da želite zapustiti?'
	},
	is: {
		error_form_not_found: 'Eyðublað fannst ekki',
		unsaved_changes_prompt: 'Þú hefur óvistaðar breytingar. Ertu viss um að þú viljir fara?'
	},
	sq: {
		error_form_not_found: 'Formulari nuk u gjet',
		unsaved_changes_prompt: 'Keni ndryshime të paruajtura. Jeni i sigurt që doni të largoheni?'
	}
};

/*
 * LaraClassifier - Classified Ads Web Application
 * Copyright (c) BeDigit. All Rights Reserved
 *
 * Website: https://laraclassifier.com
 * Author: Mayeul Akpovi (BeDigit - https://bedigit.com)
 *
 * LICENSE
 * -------
 * This software is provided under a license agreement and may only be used or copied
 * in accordance with its terms, including the inclusion of the above copyright notice.
 * As this software is sold exclusively on CodeCanyon,
 * please review the full license details here: https://codecanyon.net/licenses/standard
 */

/*
 * Functionality:
 *
 * - Tracks form changes in real-time
 * - Prompts on browser tab/window close
 * - Prompts on link clicks (except links with target="_blank", data-bs-toggle="modal" or data-ignore-guard="true")
 *   i.e. Bypassing for links with target="_blank", data-bs-toggle="modal" or data-ignore-guard="true".
 * - Resets when form is submitted
 * - Works with any form input types
 *   Support for all form field types (input, select, checkbox, radio, textarea, hidden, etc.).
 * - Compares original vs current form data
 * - Provides methods to manually reset or check dirty state
 * - Automatic initialization for forms with class="unsaved-guard".
 * - notifyChange() method for programmatic changes (e.g., hidden fields).
 * - Handling of beforeunload and link click events with translated/custom prompts.
 */

class UnsavedFormGuard {
	constructor(form, options = {}) {
		this.form = form;
		this.isDirty = false;
		this.originalData = new FormData();
		this.translations = options.translations || {};
		this.language = options.language || 'en';
		this.texts = options.texts || {};
		
		if (!this.form) {
			console.error(this.t('error_form_not_found', 'Form not found'));
			return;
		}
		
		this.init();
	}
	
	// Translation function with custom texts and fallback
	t(key, defaultText) {
		// Check custom texts first
		if (this.texts[key]) {
			return this.texts[key];
		}
		// Fall back to language-specific translation
		const langTranslations = this.translations[this.language] || {};
		return langTranslations[key] || defaultText;
	}
	
	init() {
		// Store initial form data
		this.saveOriginalData();
		
		// Track form changes
		this.form.addEventListener('change', () => {
			this.isDirty = this.hasChanges();
		});
		
		// Track input events for real-time updates
		this.form.addEventListener('input', () => {
			this.isDirty = this.hasChanges();
		});
		
		// Handle form submission (reset dirty state)
		this.form.addEventListener('submit', () => {
			this.isDirty = false;
		});
		
		// Handle beforeunload event
		window.addEventListener('beforeunload', (e) => {
			if (this.isDirty) {
				e.preventDefault();
				const message = this.t('unsaved_changes_prompt', 'You have unsaved changes. Are you sure you want to leave?');
				e.returnValue = message;
				return message;
			}
		});
		
		// Handle link clicks
		document.addEventListener('click', (e) => {
			if (
				this.isDirty &&
				e.target.tagName === 'A' &&
				!e.target.dataset.ignoreGuard &&
				!(e.target.dataset.bsToggle && e.target.dataset.bsToggle === 'modal') &&
				e.target.target !== '_blank'
			) {
				if (!confirm(this.t('unsaved_changes_prompt', 'You have unsaved changes. Are you sure you want to leave?'))) {
					e.preventDefault();
				}
			}
		});
	}
	
	saveOriginalData() {
		const formData = new FormData(this.form);
		for (const [key, value] of formData) {
			this.originalData.set(key, value);
		}
	}
	
	hasChanges() {
		const currentData = new FormData(this.form);
		
		// Compare current form data with original
		for (const [key, value] of this.originalData) {
			if (currentData.get(key) !== value) {
				return true;
			}
		}
		
		// Check for new fields
		for (const [key] of currentData) {
			if (!this.originalData.has(key)) {
				return true;
			}
		}
		
		return false;
	}
	
	// Method to manually reset dirty state
	reset() {
		this.isDirty = false;
		this.saveOriginalData();
	}
	
	// Method to check if form is dirty
	isFormDirty() {
		return this.isDirty;
	}
	
	// Static method to initialize all forms with the guard class
	static initAll(guardClass = 'unsaved-guard', options = {}) {
		const forms = document.querySelectorAll(`form.${guardClass}`);
		const guards = [];
		forms.forEach(form => {
			guards.push(new UnsavedFormGuard(form, options));
		});
		return guards;
	}
}

/* Automatically initialize all forms with class 'unsaved-guard' on DOM load */
document.addEventListener('DOMContentLoaded', () => {
	let texts, language;
	
	if (typeof langLayout !== 'undefined' && typeof langLayout.unsavedFormGuard !== 'undefined') {
		texts = langLayout.unsavedFormGuard;
	}
	
	if (typeof languageCode !== 'undefined') {
		language = languageCode;
		language = language.split('-')[0];
		language = language.split('_')[0];
	}
	
	UnsavedFormGuard.initAll('unsaved-guard', {
		texts: texts || {},
		translations: fgTranslations || {},
		language: language || navigator.language.split('-')[0] || 'en'
	});
});

(function () {
	"use strict";
	
	/*
	// Preloader
	window.addEventListener('load', function () {
		const ellipsis = document.querySelector('.lds-ellipsis');
		const preloader = document.querySelector('.preloader');
		const body = document.body;
		
		if (ellipsis) {
			ellipsis.style.transition = 'opacity 0.3s';
			ellipsis.style.opacity = '0';
			ellipsis.addEventListener('transitionend', () => ellipsis.style.display = 'none');
		}
		
		if (preloader) {
			setTimeout(() => {
				preloader.style.transition = 'opacity 0.3s';
				preloader.style.opacity = '0';
				preloader.addEventListener('transitionend', () => preloader.style.display = 'none');
			}, 333);
		}
		
		if (body) {
			setTimeout(() => {
				// No specific action needed for body delay in vanilla JS
			}, 333);
		}
	});
	*/
	
	// YouTube video to autoplay in modal
	let videoSrc;
	const videoButtons = document.querySelectorAll('.video-btn');
	videoButtons.forEach(button => {
		button.addEventListener('click', function () {
			videoSrc = this.dataset.src;
		});
	});
	
	const videoModal = document.getElementById('videoModal');
	const video = document.getElementById('video');
	
	if (videoModal) {
		videoModal.addEventListener('shown.bs.modal', function () {
			if (video && videoSrc) {
				video.setAttribute('src', `${videoSrc}?autoplay=1&modestbranding=1&showinfo=0&rel=0`);
			}
		});
		
		videoModal.addEventListener('hide.bs.modal', function () {
			if (video && videoSrc) {
				video.setAttribute('src', videoSrc);
			}
		});
	}
	
	// Tooltips (this remains the same as it was already vanilla JS using Bootstrap)
	const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
	const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl);
	});
	
})();

/*
 * LaraClassifier - Classified Ads Web Application
 * Copyright (c) BeDigit. All Rights Reserved
 *
 * Website: https://laraclassifier.com
 * Author: Mayeul Akpovi (BeDigit - https://bedigit.com)
 *
 * LICENSE
 * -------
 * This software is provided under a license agreement and may only be used or copied
 * in accordance with its terms, including the inclusion of the above copyright notice.
 * As this software is sold exclusively on CodeCanyon,
 * please review the full license details here: https://codecanyon.net/licenses/standard
 */

// OTP Form (Focusing on next input and auto-submit)
(function () {
	"use strict";
	
	// OTP Form handling
	const otpForm = document.getElementById('twoFactorOtpForm');
	const otpInputs = document.querySelectorAll('#otpInputs .form-control');
	const codeInput = document.getElementById('otpCode');
	const submitBtn = document.getElementById('otpButton');
	
	// Ensure translations are available
	const translations = window.authTranslations || {
		verify: 'Verify',
		submitting: 'Submitting...'
	};
	
	otpInputs.forEach((input, index) => {
		// Handle keyup for navigation and single character input
		input.addEventListener('keyup', function (e) {
			if (this.value.length === 0) {
				const prevInput = otpInputs[index - 1];
				if (prevInput) {
					prevInput.focus();
				}
			} else if (this.value.length === this.maxLength) {
				const nextInput = otpInputs[index + 1];
				if (nextInput) {
					nextInput.focus();
				} else {
					submitOtpForm();
				}
			}
			// Ensure only single digits
			if (this.value.length > 0) {
				this.value = this.value.replace(/[^0-9]/g, '').slice(0, 1);
			}
		});
		
		// Handle paste event
		input.addEventListener('paste', function (e) {
			e.preventDefault();
			const pastedData = (e.clipboardData || window.clipboardData).getData('text');
			const digits = pastedData.replace(/[^0-9]/g, ''); // Only keep numbers
			
			// Calculate how many inputs remain from current position
			const remainingInputs = otpInputs.length - index;
			const codeToPaste = digits.slice(0, remainingInputs);
			
			// Fill inputs from current position
			for (let i = 0; i < codeToPaste.length; i++) {
				const targetInput = otpInputs[index + i];
				if (targetInput) {
					targetInput.value = codeToPaste[i];
				}
			}
			
			// Focus the last filled input or submit if at end
			const lastFilledIndex = Math.min(index + codeToPaste.length - 1, otpInputs.length - 1);
			otpInputs[lastFilledIndex].focus();
			
			if (lastFilledIndex === otpInputs.length - 1) {
				submitOtpForm();
			}
		});
	});
	
	function submitOtpForm() {
		if (!otpForm) return;
		
		// Check if form is already submitting
		if (otpForm.dataset.submitting === 'true') return;
		
		const allFilled = Array.from(otpInputs).every(input => input.value.length === 1);
		if (!allFilled) return;
		
		const code = Array.from(otpInputs).map(input => input.value).join('');
		
		if (codeInput) {
			codeInput.value = code;
		}
		
		// Disable button and submit
		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.textContent = translations.submitting; // Optional: visual feedback
		}
		
		// Set data attribute before submission
		otpForm.dataset.submitting = 'true';
		otpForm.submit();
	}
	
	// Handle form submission
	// Updated submit handler to check data attribute
	if (otpForm) {
		otpForm.addEventListener('submit', function (e) {
			if (otpForm.dataset.submitting === 'true') {
				e.preventDefault(); // Prevent duplicate submission
				return;
			}
			
			const allFilled = Array.from(otpInputs).every(input => input.value.length === 1);
			if (!allFilled) {
				e.preventDefault();
				return;
			}
			
			const code = Array.from(otpInputs).map(input => input.value).join('');
			
			if (codeInput) {
				codeInput.value = code;
			}
			
			if (submitBtn) {
				submitBtn.disabled = true;
				submitBtn.textContent = translations.submitting;
			}
			
			otpForm.dataset.submitting = 'true'; // Mark as submitting
			// No need to call otpForm.submit() here since it’s the natural submission
		});
	}
	
	// Reset data attribute and button state on page load
	window.addEventListener('load', function () {
		if (otpForm) {
			otpForm.dataset.submitting = 'false'; // Initialize/reset submitting state
		}
		if (submitBtn) {
			submitBtn.disabled = false;
			submitBtn.textContent = translations.verify;
		}
	});
	
	// Re-enable button if submission fails (optional)
	if (otpForm) {
		otpForm.addEventListener('submit', function (e) {
			// This assumes you're using AJAX or want to handle failed submissions
			// Remove if using standard form submission
			setTimeout(() => {
				if (submitBtn) {
					submitBtn.disabled = false;
					submitBtn.textContent = translations.verify; // Reset to original text
				}
			}, 5000); // Adjust timeout as needed
		});
	}
	
})();


/*
 * LaraClassifier - Classified Ads Web Application
 * Copyright (c) BeDigit. All Rights Reserved
 *
 * Website: https://laraclassifier.com
 * Author: Mayeul Akpovi (BeDigit - https://bedigit.com)
 *
 * LICENSE
 * -------
 * This software is provided under a license agreement and may only be used or copied
 * in accordance with its terms, including the inclusion of the above copyright notice.
 * As this software is sold exclusively on CodeCanyon,
 * please review the full license details here: https://codecanyon.net/licenses/standard
 */

if (typeof isLoggedUser === 'undefined') {
	var isLoggedUser = false;
}
if (typeof defaultAuthField === 'undefined') {
	var defaultAuthField = 'email';
}

onDocumentReady((event) => {
	
	/* Get all forms elements */
	const formEls = document.querySelectorAll('form');
	
	/* Get all forms that have an auth field */
	const authFormEls = Array.from(formEls).filter(form => form.querySelector('.auth-field-item'));
	
	if (authFormEls.length > 0) {
		authFormEls.forEach(formEl => {
			
			/* Select an auth field */
			selectAuthField(formEl, null, defaultAuthField);
			
			/* Add event listener for click events on elements with class 'auth-field' */
			const authFieldLinkEls = formEl.querySelectorAll('a.auth-field');
			if (authFieldLinkEls.length > 0) {
				authFieldLinkEls.forEach(element => {
					element.addEventListener('click', e => {
						e.preventDefault();
						selectAuthField(formEl, e.target);
					});
				});
			}
			
			/* Add event listener for change events on elements with class 'auth-field-input' */
			const authFieldRadioBtnEls = formEl.querySelectorAll('input.auth-field-input');
			if (authFieldRadioBtnEls.length > 0) {
				authFieldRadioBtnEls.forEach(element => {
					element.addEventListener('change', e => {
						selectAuthField(formEl, e.target);
					});
				});
			}
			
		});
	}
	
});

/**
 * Select an auth field (email or phone)
 *
 * @param formEl
 * @param thisEl
 * @param defaultAuthField
 * @returns {boolean}
 */
function selectAuthField(formEl, thisEl = null, defaultAuthField = null) {
	defaultAuthField = defaultAuthField || 'email';
	
	/* Select default auth field */
	let authFieldTagName;
	let authField;
	if (thisEl) {
		authFieldTagName = thisEl.tagName.toLowerCase();
		authField = (authFieldTagName === 'input')
			? thisEl.value
			: thisEl.dataset.authField ?? defaultAuthField;
	} else {
		authField = defaultAuthField;
	}
	
	if (!authField || authField.length <= 0) {
		jsAlert('Impossible to get the auth field!', 'error', false);
		return false;
	}
	
	/* Update the 'auth_field' field value */
	if (authFieldTagName && authFieldTagName === 'a') {
		const authFieldEls = formEl.querySelectorAll("input[name='auth_field']:not([type=radio], [type=checkbox])");
		if (authFieldEls.length > 0) {
			authFieldEls.forEach(input => {
				input.value = authField;
			});
		}
	}
	
	/* Get the auth field items (email|phone) & the selected item elements */
	const itemsEls = formEl.querySelectorAll('.auth-field-item');
	const canBeHiddenItemsEls = formEl.querySelectorAll('.auth-field-item:not(.force-to-display)');
	
	let selectedItemParentEl;
	const selectedItemEl = formEl.querySelector("input[name='" + authField + "']");
	if (selectedItemEl) {
		selectedItemParentEl = selectedItemEl.closest('.auth-field-item');
	}
	
	/* Manage required '<sup>' tag in the auth field items' label */
	if (itemsEls.length > 0) {
		itemsEls.forEach(item => {
			item.classList.remove('required');
			let sup = item.querySelector('label sup');
			if (sup) {
				sup.remove();
			}
		});
	}
	
	if (selectedItemParentEl) {
		selectedItemParentEl.classList.remove('required');
		selectedItemParentEl.classList.add('required');
		const labelEl = selectedItemParentEl.querySelector('label');
		if (labelEl) {
			const labelRequireTagEl = labelEl.querySelector('span.text-danger');
			if (!labelRequireTagEl) {
				labelEl.innerHTML += ' <span class="text-danger ms-1">*</span>';
			}
		}
	}
	
	/* Manage auth field items display */
	if (typeof isLoggedUser !== 'undefined' && isLoggedUser !== true) {
		if (canBeHiddenItemsEls.length > 0) {
			canBeHiddenItemsEls.forEach(item => {
				item.classList.add('d-none');
			});
		}
		if (selectedItemParentEl) {
			selectedItemParentEl.classList.remove('d-none');
		}
	}
}
