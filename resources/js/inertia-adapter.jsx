import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation, BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

// Create a global context to mimic Inertia's page props
export const PageContext = createContext({
    props: {},
    component: null,
    setPage: () => {},
});

// usePage hook wrapper
export function usePage() {
    const { props, component } = useContext(PageContext);
    const location = useLocation();
    return { props, component, url: location.pathname + location.search };
}

// Router object polyfill to replace router.visit, router.post, etc.
export const router = {
    visit: (url, options = {}) => {
        window._navEvent?.visit(url, options);
    },
    post: (url, data, options = {}) => {
        window._navEvent?.request('post', url, data, options);
    },
    get: (url, data, options = {}) => {
        window._navEvent?.request('get', url, data, options);
    },
    put: (url, data, options = {}) => {
        window._navEvent?.request('put', url, data, options);
    },
    patch: (url, data, options = {}) => {
        window._navEvent?.request('patch', url, data, options);
    },
    delete: (url, options = {}) => {
        window._navEvent?.request('delete', url, {}, options);
    },
    reload: (options = {}) => {
        const url = window.location.pathname + window.location.search;
        window._navEvent?.visit(url, options);
    }
};

// <Link> component polyfill
export function Link({ href, method = 'get', data = {}, as = 'a', className, children, onClick, preserveScroll, preserveState, ...props }) {
    const navigate = useNavigate();

    const handleClick = (e) => {
        if (onClick) onClick(e);
        if (e.defaultPrevented) return;
        
        e.preventDefault();
        
        if (method.toLowerCase() === 'get' && Object.keys(data).length === 0) {
            router.visit(href, { preserveScroll, preserveState });
        } else {
            router[method.toLowerCase()](href, data, { preserveScroll, preserveState });
        }
    };

    if (as === 'button') {
        return <button className={className} onClick={handleClick} {...props}>{children}</button>;
    }

    return <a href={href} className={className} onClick={handleClick} {...props}>{children}</a>;
}

// useForm hook polyfill mimicking Inertia's useForm
export function useForm(initialValues = {}) {
    // Some usages do useForm('key', initialValues)
    if (typeof initialValues === 'string') {
        initialValues = arguments[1] || {};
    }

    const [data, setData] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [wasSuccessful, setWasSuccessful] = useState(false);
    const [recentlySuccessful, setRecentlySuccessful] = useState(false);
    const [hasErrors, setHasErrors] = useState(false);

    const reset = (...fields) => {
        if (fields.length === 0) {
            setData(initialValues);
        } else {
            setData(prev => {
                const newData = { ...prev };
                fields.forEach(f => newData[f] = initialValues[f]);
                return newData;
            });
        }
    };

    const clearErrors = (...fields) => {
        if (fields.length === 0) {
            setErrors({});
            setHasErrors(false);
        } else {
            setErrors(prev => {
                const newErrs = { ...prev };
                fields.forEach(f => delete newErrs[f]);
                setHasErrors(Object.keys(newErrs).length > 0);
                return newErrs;
            });
        }
    };

    let transformCallback = (data) => data;

    const transform = (callback) => {
        transformCallback = callback;
    };

    const submit = (method, url, options = {}) => {
        setProcessing(true);
        setWasSuccessful(false);
        
        const methodStr = method.toLowerCase();
        let payloadData = methodStr === 'get' ? undefined : transformCallback(data);
        const queryParams = methodStr === 'get' ? transformCallback(data) : undefined;
        
        // AUTO-CONVERT TO FORMDATA IF FILES ARE DETECTED
        const hasFiles = (obj) => {
            if (obj instanceof File || obj instanceof Blob) return true;
            if (typeof obj === 'object' && obj !== null) {
                return Object.values(obj).some(v => hasFiles(v));
            }
            return false;
        };

        const isMultipart = hasFiles(payloadData);
        let finalData = payloadData;

        if (isMultipart || options.forceFormData) {
            const formData = new FormData();
            
            // Method Spoofing for non-POST multipart requests
            if (methodStr !== 'post' && methodStr !== 'get') {
                formData.append('_method', methodStr.toUpperCase());
            }

            const appendToFormData = (key, value) => {
                if (value instanceof Array) {
                    value.forEach((v, i) => appendToFormData(`${key}[${i}]`, v));
                } else if (typeof value === 'object' && value !== null && !(value instanceof File) && !(value instanceof Blob)) {
                    Object.keys(value).forEach(k => appendToFormData(`${key}[${k}]`, value[k]));
                } else {
                    formData.append(key, value === null ? '' : value);
                }
            };

            Object.keys(payloadData).forEach(key => appendToFormData(key, payloadData[key]));
            finalData = formData;
        }

        axios({
            method: (isMultipart && methodStr !== 'get') ? 'post' : methodStr,
            url,
            data: finalData,
            params: queryParams,
            headers: {
                'X-SPA': 'true',
                'Accept': 'text/html, application/xhtml+xml',
                ...(isMultipart ? { 'Content-Type': 'multipart/form-data' } : {})
            }
        })
        .then(response => {
            setProcessing(false);
            setWasSuccessful(true);
            setRecentlySuccessful(true);
            clearErrors();
            setTimeout(() => setRecentlySuccessful(false), 2000);
            
            if (options.onSuccess) options.onSuccess({ props: response.data?.props || {} });
            
            // If the server returns a redirect, follow it
            if (response.headers['x-spa-location']) {
                router.visit(response.headers['x-spa-location']);
            } else if (response.data && response.data.component) {
                 // Push state if it's SPA
                 window._navEvent?.applyPage(response.data.component, response.data.props, url);
            }

        })
        .catch(error => {
            setProcessing(false);

            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                setHasErrors(true);
                if (options.onError) options.onError(error.response.data.errors);
                return;
            }

            // 409 means already authenticated — redirect to dashboard, do NOT retry login
            if (error.response?.status === 409) {
                const loc = error.response.headers['x-spa-location'] || error.response.data?.location || '/dashboard';
                window.location.href = loc;
                return;
            }

            // 302 redirect — follow location header
            if (error.response?.status === 302) {
                const loc = error.response.headers['x-spa-location'] 
                         || error.response.headers['location'] 
                         || error.response.data?.location 
                         || '/dashboard';
                window.location.href = loc;
                return;
            }

            // Generic error handler
            if (options.onError) options.onError(error.response?.data || {});
        })
        .finally(() => {
            if (options.onFinish) options.onFinish();
        });
    };

    return {
        data,
        setData: (k, v) => {
            if (typeof k === 'function') {
                setData(k);
            } else if (typeof k === 'string') {
                setData(prev => ({ ...prev, [k]: v }));
            }
        },
        transform,
        post: (url, options) => submit('POST', url, options),
        put: (url, options) => submit('PUT', url, options),
        patch: (url, options) => submit('PATCH', url, options),
        delete: (url, options) => submit('DELETE', url, options),
        get: (url, options) => submit('GET', url, options),
        processing,
        errors,
        setErrors,
        clearErrors,
        reset,
        wasSuccessful,
        recentlySuccessful,
        hasErrors
    };
}

export const Head = ({ title }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);
    return null;
};
