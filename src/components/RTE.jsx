import React, { useEffect, useRef, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export default function RTE({ name = 'content', label, defaultValue = "" }) {
    const { control, setValue, getValues } = useFormContext();
    const editorRef = useRef(null);
    const [isEditorReady, setIsEditorReady] = React.useState(false);
    
    // Initialize TinyMCE
    useEffect(() => {
        // Only load TinyMCE in the browser
        if (typeof window === 'undefined') return;
        
        // Check if TinyMCE is already loaded
        if (window.tinymce) {
            initEditor();
            return;
        }

        // Load TinyMCE script
        const script = document.createElement('script');
        script.src = 'https://cdn.tiny.cloud/1/13m2oi3polmmiogzl9fhskaz4vrpc1ynz7s8jw62eiim4xm8/tinymce/6/tinymce.min.js';
        script.referrerPolicy = 'origin';
        script.async = true;
        
        script.onload = initEditor;
        script.onerror = (error) => {
            console.error('Failed to load TinyMCE:', error);
        };
        
        document.head.appendChild(script);

        return () => {
            if (window.tinymce) {
                window.tinymce.remove();
            }
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, []);

    const initEditor = useCallback(() => {
        if (!window.tinymce) {
            console.error('TinyMCE not available');
            return;
        }
        
        const editorId = `rte-${name}`;
        
        // Initialize TinyMCE
        window.tinymce.init({
            selector: `#${editorId}`,
            plugins: 'link lists',
            toolbar: 'undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist outdent indent | link',
            menubar: false,
            height: 300,
            setup: (editor) => {
                editorRef.current = editor;
                
                editor.on('init', () => {
                    const currentValue = getValues(name) || defaultValue;
                    if (currentValue) {
                        editor.setContent(currentValue);
                    }
                    setIsEditorReady(true);
                });
                
                editor.on('change', () => {
                    const content = editor.getContent();
                    setValue(name, content, { shouldDirty: true, shouldValidate: true });
                });
                
                editor.on('blur', () => {
                    const content = editor.getContent();
                    setValue(name, content, { shouldDirty: true, shouldValidate: true });
                });
            }
        });
        
        return () => {
            if (window.tinymce) {
                const editor = window.tinymce.get(editorId);
                if (editor) {
                    editor.remove();
                }
            }
        };
    }, [name, setValue, getValues, defaultValue]);

    return (
        <div className='w-full'>
            {label && <label className='inline-block mb-1 pl-1'>{label}</label>}
            <div id={`rte-${name}`} className='min-h-[300px] border rounded' />
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <input type="hidden" {...field} />
                )}
            />
        </div>
    );
}

