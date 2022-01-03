import { useRef, useEffect } from 'react'

function useDocumentTitle(title, prevailOnUnmount = false) {
    const defaultTitle = useRef(document.title);

    useEffect(() => {
        document.title = title;
    }, [title]);

    useEffect(() => {
        function prevailOnUnmount() {
            if (!prevailOnUnmount) {
                document.title = defaultTitle.current;
            }
        }
        prevailOnUnmount()
    }, [prevailOnUnmount])
}

export function PageTitle(props) {
    const titlePrefix = " | Holidaze"
    useDocumentTitle(`${props.title}${titlePrefix}`)

    return <></>
}