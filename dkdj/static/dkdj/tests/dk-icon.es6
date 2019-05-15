//
// class IconLibrary {
//     constructor(props) {
//         Object.assign(this, {
//             url: '',
//             prefix: '',
//             classes: '',
//         }, props);
//     }
//
//     /*
//      *  name can include optional attributes::
//      *
//      *     play:fw,3x,li,spin,rotate-90
//      *
//      *  fw:             fixed witdth icon (e.g. for menus)
//      *  lg,2x,3x,4x,5x: larger size
//      *  border:         added border
//      *  li:             list item bullet
//      *  spin:           add css3 spinning animation
//      *  rotate-90/180/270:
//      *  flip-horizontal:
//      *  flip-vertical
//      */
//     make_icon(name) {
//         name = name || "";  // catch undefined
//         let res = document.createElement('i');
//         let nameparts = name.split(':');
//         name = nameparts[0];
//
//         res.classList.add(this.classes);
//         let classname = this.prefix + (this[name] !== undefined ? this[name] : name);
//         res.classList.add(classname);
//         if (name) res.classList.add(name);
//         if (nameparts.length > 1) {
//             let attrs = nameparts[1].split(',');
//             attrs.forEach(attr => {
//                 if (this[attr.replace('-', '_')]) {
//                     res = this[attr.replace('-', '_')](res);
//                 } else {
//                     res.classList.add(this.prefix + attr);
//                 }
//             });
//         }
//
//         return res;
//     }
//
//     static fontawsome4() {
//         return new IconLibrary({
//             classes: 'fa',
//             prefix: 'fa-',
//             url: "https://static.datakortet.no/font/fa470/css/font-awesome.css",
//             // save: 'save',
//             remove: 'trash-o',
//             cancel: 'times-circle-o',
//             up: 'chevron-up',
//             down: 'chevron-down'
//             // plus, minus, play, paperclip
//         });
//     }
// }
//
//
// const icon = (function () {
//     let chosen_icons = IconLibrary.fontawsome4();
//     // dkrequire(chosen_icons.url);
//     return (...args) => chosen_icons.make_icon(...args);
// }());
//
//
// customElements.define('dk-icon', class extends HTMLElement {
//     constructor() {
//         super();
//     }
//    
//     get src() {
//         return this.getAttribute("src");
//     }
//    
//     set src(val) {
//         this.setAttribute('src', val);
//     }
//    
//     static get observedAttributes() {
//         return ['src'];
//     }
//    
//     attributeChangedCallback(attrname, oldval, newval) {
//         if (attrname === 'src') {
//             // this.innerHTML = `<i class="${newval} fa fa-${newval} fa-fw icon"></i>`;
//             if (this.icon) {
//                 this.icon.classList.remove(oldval, 'fa-' + oldval);
//                 this.icon.classList.add(newval, 'fa-' + newval);
//             }
//         }
//     }
//     connectedCallback() {
//         this.root = this.attachShadow({mode: 'open'});
//         this.icon = icon(this.src);
//         this.root.innerHTML = `<link rel="stylesheet" href="https://static.datakortet.no/font/fa470/css/font-awesome.css">`;
//         this.root.appendChild(this.icon);
//     }
//
//     invalidate() {
//         this.icon.setAttribute('src', this.src);
//     }
//
// });
