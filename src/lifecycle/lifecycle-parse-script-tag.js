// import _ from "lodash";
import dkglobal from "./dkglobal";
import dk from "../dk-obj";

/**
 * The script tag (<script src="dk.js" ..) can have additional attributes:
 *
 *      DEBUG
 *      LOGLEVEL
 *      crossorigin
 *      data-main
 *
 * @param dk
 */
export default function parse_script_tag(dk) {
    dk.performance('parse-script-tag-start');
    // we've got all the script tags under dk.webpage.scripts
    // let tag = dk.webpage.scripts.dk.tag;
    let tag = dk('script[DK]');
    if (tag === null) {
        throw `dk.js script tag now need the DK attribute:
            <script DK src="...dk.js"...>
        `;
    }
    
    const scripttag_attributes = {
        DEBUG: false,
        LOGLEVEL: null,
        crossorigin: null,
    };
    
    Array.from(tag.attributes, attr => {  // node.attributes cannot for-of on IE
        switch (attr.name.toLowerCase()) {
            case 'debug':
                // <script debug src=..> => debug===4
                scripttag_attributes.DEBUG = true;
                break;
            case 'loglevel':
                // <script debug src=..> => debug===4
                scripttag_attributes.loglevel = parseInt(attr.value || "4", 10);
                break;
            case 'crossorigin':
                scripttag_attributes.crossorigin = attr.value;
                break;
            case 'data-main':
                let val = attr.value;
                if (val.slice(-val.length) !== '.js') {
                    val += '.js';
                }
                scripttag_attributes[attr.name] = val;
                break;
            default:
                scripttag_attributes[attr.name] = attr.value;
                break;
        }
    });
    if (scripttag_attributes.LOGLEVEL === null) {
        scripttag_attributes.LOGLEVEL = scripttag_attributes.DEBUG ? 4 : 0;
    }
    
    // global vars override script tag vars
    let DEBUG = dkglobal.DEBUG;
    let LOGLEVEL = dkglobal.LOGLEVEL;
    if (typeof DEBUG !== 'undefined') scripttag_attributes.DEBUG = DEBUG;
    if (typeof LOGLEVEL !== 'undefined') scripttag_attributes.LOGLEVEL = LOGLEVEL;
    
    dk.DEBUG = scripttag_attributes.DEBUG;
    dk.LOGLEVEL = scripttag_attributes.LOGLEVEL;
    
    delete scripttag_attributes.DEBUG;
    delete scripttag_attributes.LOGLEVEL;
    
    dk.scripttag_attributes = scripttag_attributes;
    dk.performance('parse-script-tag-end');
}
