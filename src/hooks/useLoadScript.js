import { useState, useCallback, useEffect } from 'react';

/**
 * 
 * @param {{
 * id: string,
 * scriptUrl: string,
 * onLoadSuccess: (successData) => void,
 * onLoadFail: (failureData) => void,
 * appendElement: HTMLElement
 * }} params
 * 
 * id the script tag id
 * appendElement - if not available will be using the document.head to attach the script else given element
 */
const useLoadScript = (params) => {
    const {
        scriptUrl,
        id,
        onLoadSuccess,
        onLoadFail,
        appendElement = document.head
    } = params;
    const [isScriptLoaded, setIsScriptLoaded] = useState(false)

    /**
     * Memoized callback for onLoadSuccess
     * This helps to pick the newest onLoadSuccess as this can be 
     * reasigning from usage components
     */
    const onScriptLoadComplete = useCallback((success) => {
        setIsScriptLoaded(true);
        onLoadSuccess && onLoadSuccess(success);
    }, [onLoadSuccess]);

    /**
     * Memoized callback for onLoadFail
     * This helps to pick the newest onLoadFail as this can be 
     * reasigning from usage components
     */
    const onScriptLoadFail = useCallback((failure) => {
        setIsScriptLoaded(false);
        onLoadFail && onLoadFail(failure);
    }, [onLoadFail]);

    const loadGoogleScript = useCallback(() => {
        // create script element with event listeners for script load and error
        const scriptElement = document.createElement('script');
        scriptElement.setAttribute('id', id);
        scriptElement.setAttribute('src', scriptUrl);
        scriptElement.addEventListener('load', onScriptLoadComplete);
        scriptElement.addEventListener('error', onScriptLoadFail);

        // Apppend the script tag.
        appendElement.appendChild(scriptElement);
    }, [appendElement, scriptUrl, id, onScriptLoadComplete, onScriptLoadFail]);

    /** Remove the script from dom */
    const removeScript = () => {
        const scriptElem = document.getElementById(id);
        if (scriptElem !== null) {
            scriptElem.parentNode.removeChild(scriptElem);
        }
    }

    /**
     * Kickstart things
     */
    useEffect(() => {
        loadGoogleScript();
    }, [loadGoogleScript]);

    return {
        isScriptLoaded,
        removeScript
    }
}

export default useLoadScript;