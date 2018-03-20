/* global MathJax */
import icon from './icon.png';

const loadMathJax = () => {
    window.MathJax = {
        SVG: {scale: 150}
    };
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src  = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_SVG";
    document.getElementsByTagName("head")[0].appendChild(script);
}

export const fn = ({ term, display }) => {
    if(term.substring(0,4) !== 'tex ') return;
    if(!window.MathJax) loadMathJax();
    display({
        title: `tex ${term.substring(4)}`,
        icon,
        getPreview: () => (
            <div id='math-render'>{'\\[' + term.substring(4) + '\\]'}</div>
        )
    });
    setTimeout(() => window.MathJax && MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'math-render']), 200);
};
