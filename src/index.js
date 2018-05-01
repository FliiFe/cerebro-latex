/* global MathJax */
import icon from './icon.png';

const loadScript = (src) => new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
});

const loadMathJax = () => {
    window.MathJax = {
        SVG: {scale: 150, useFontCache: false}
    };
    return loadScript('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.2/MathJax.js?config=TeX-AMS_SVG');
};

const importSVG = (sourceSVG) => {
    const svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);
    const canvas = document.createElement('canvas'); // document.getElementById('tex-canvas');
    canvas.width = sourceSVG.width.baseVal.value;
    canvas.height = sourceSVG.height.baseVal.value;
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(svg_xml);

    return new Promise((resolve) => {
        img.onload = () => {
            ctx.fillStyle = 'white';
            ctx.fillRect(0,0,canvas.width,canvas.height);
            ctx.drawImage(img, 0, 0);
            resolve(canvas);
        };
    });
};

const createPng = async () => {
    const svgElement = document.querySelector('#math-render svg');
    svgElement.setAttribute('width', svgElement.width.baseVal.value + 'px');
    svgElement.setAttribute('height', svgElement.height.baseVal.value + 'px');
    const canvas = await importSVG(svgElement);
    const anchor = document.createElement('a');
    anchor.href = canvas.toDataURL();
    anchor.download = 'giac.png';
    anchor.dispatchEvent(new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        button: 0,
        buttons: 1,
    }));
};

export const fn = async ({ term, display }) => {
    if(term.substring(0,4) !== 'tex ') return;
    if(!window.MathJax) await loadMathJax();
    display({
        title: 'LaTeX',
        icon,
        getPreview: () => (
            <div>
                <div id='math-render'>
                    {'\\[' + term.substring(4) + '\\]'}
                </div>
                <span onClick={createPng}>Export to PNG</span>
            </div>
        )
    });
    setTimeout(() => window.MathJax && MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'math-render']), 200);
};
