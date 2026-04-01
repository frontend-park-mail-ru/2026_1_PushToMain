declare namespace JSX {
    interface IntrinsicElements {
        [elemName: string]: any;
    }
    
    interface Element {
        type: any;
        props: any;
    }
}