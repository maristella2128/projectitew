import '../css/app.css';
import './bootstrap';

import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import { PageContext } from './inertia-adapter';
import axios from 'axios';

const pages = import.meta.glob('./Pages/**/*.jsx');
const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

function DynamicPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // window.page is injected by app.blade.php
    const [componentName, setComponentName] = useState(window.page?.component);
    const [props, setProps] = useState(window.page?.props || {});

    useEffect(() => {
        window._navEvent = {
            visit: (url, options = {}) => {
                axios.get(url, { headers: { 'X-SPA': 'true', 'Accept': 'text/html, application/xhtml+xml' } })
                    .then(res => {
                        if (res.data?.component) {
                            window._navEvent.applyPage(res.data.component, res.data.props, url, options.replace);
                        }
                        if (options.onSuccess) options.onSuccess({ props: res.data?.props || {} });
                    })
                    .catch(e => {
                        if (e.response?.status === 401 || e.response?.status === 419) {
                            window.location.href = '/login';
                        } else if (e.response?.status === 409) {
                            window.location.reload();
                        } else if (e.response?.headers['x-spa-location']) {
                            window._navEvent.visit(e.response.headers['x-spa-location']);
                        }
                    });
            },
            request: (method, url, data, options = {}) => {
                const isGet = method.toLowerCase() === 'get';
                axios({ 
                    method, 
                    url, 
                    data: isGet ? undefined : data, 
                    params: isGet ? data : undefined,
                    headers: { 'X-SPA': 'true', 'Accept': 'text/html, application/xhtml+xml, application/json' } 
                })
                    .then(res => {
                        const loc = res.headers['x-spa-location'];
                        if (options.onSuccess) options.onSuccess({ props: res.data?.props || res.data || {} });
                        if (options.onFinish) options.onFinish();

                        if (loc) {
                            window._navEvent.visit(loc, { replace: true });
                            return;
                        }

                        if (res.data?.component) {
                            window._navEvent.applyPage(res.data.component, res.data.props, null, false);
                        }
                    })
                    .catch(e => {
                        const loc = e.response?.headers['x-spa-location'];
                        if (e.response?.status === 401 || e.response?.status === 419) {
                            window.location.href = '/login';
                        } else if (e.response?.status === 409) {
                            window.location.reload();
                        } else if (loc) {
                            if (options.onSuccess) options.onSuccess({ props: {} });
                            if (options.onFinish) options.onFinish();
                            window._navEvent.visit(loc, { replace: true });
                            return;
                        }
                        if (options.onError) options.onError(e.response?.data?.errors || {});
                        if (options.onFinish) options.onFinish();
                    });
            },
            applyPage: (newComp, newProps, url, replace = false) => {
                if (url) {
                    const targetUrl = new URL(url, window.location.origin);
                    const targetPath = targetUrl.pathname + targetUrl.search;
                    const currentUrl = window.location.pathname + window.location.search;
                    
                    if (targetPath === currentUrl && newComp === componentName) {
                        return; // Already here
                    }
                    
                    if (targetPath !== currentUrl) {
                        navigate(targetPath, { replace: replace });
                    }
                }
                
                setComponentName(newComp);
                setProps(newProps);
            }
        };
    }, [navigate, componentName]);

    // Handle PopState (Back/Forward browser buttons)
    useEffect(() => {
        const handlePopState = () => {
             const url = window.location.pathname + window.location.search;
             window._navEvent.visit(url, { replace: true });
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Also handle when react router changes location, but not initiated by us
    // Because we use navigate(), this is mostly to ensure correctness.
    const [lastLoc, setLastLoc] = useState(location.pathname + location.search);
    useEffect(() => {
       const currentLoc = location.pathname + location.search;
       if (currentLoc !== lastLoc) {
           setLastLoc(currentLoc);
           // If we changed location but component is same, it might be a back button
           // For simplicity, we just rely on popstate event or explicit visits
       }
    }, [location, lastLoc]);

    const PageComponent = useMemo(() => {
        if (!componentName) return null;
        const importFn = pages[`./Pages/${componentName}.jsx`];
        if (!importFn) {
            console.error(`Page not found: ./Pages/${componentName}.jsx`);
            return () => <div>Page not found: {componentName}</div>;
        }
        return lazy(importFn);
    }, [componentName]);

    if (!PageComponent) return null;

    return (
        <PageContext.Provider value={{ props, component: componentName }}>
            <Suspense fallback={<div className="flex h-full w-full items-center justify-center">Loading...</div>}>
                <PageComponent {...props} />
            </Suspense>
        </PageContext.Provider>
    );
}

const el = document.getElementById('app');
el.style.cssText = 'height:100%;width:100%;overflow:hidden;';

const root = createRoot(el);
root.render(
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <DynamicPage />
    </BrowserRouter>
);
