import {JSonDataSource} from "../tree-data";

const data = {
    "cache": {
        "DK": {
            "children": [
                "DK$TikTok",
                "DK$Generelt DK"
            ],
            "key": "DK",
            "label": "DK",
            "parent": null,
            "path": [
                "DK"
            ],
            "root": "DK",
            "value": null
        },
        "DK$Generelt DK": {
            "children": [
                "DK$Generelt DK$Digitaltesten"
            ],
            "key": "DK$Generelt DK",
            "label": "Generelt DK",
            "parent": "DK",
            "path": [
                "DK",
                "DK$Generelt DK"
            ],
            "root": "DK",
            "value": 1
        },
        "DK$Generelt DK$Digitaltesten": {
            "children": [],
            "key": "DK$Generelt DK$Digitaltesten",
            "label": "Digitaltesten",
            "parent": "DK$Generelt DK",
            "path": [
                "DK",
                "DK$Generelt DK",
                "DK$Generelt DK$Digitaltesten"
            ],
            "root": "DK",
            "value": 244
        },
        "DK$TikTok": {
            "children": [],
            "key": "DK$TikTok",
            "label": "TikTok",
            "parent": "DK",
            "path": [
                "DK",
                "DK$TikTok"
            ],
            "root": "DK",
            "value": 5
        },
        "FinAut": {
            "children": [
                "FinAut$Finaut",
                "FinAut$AFR"
            ],
            "key": "FinAut",
            "label": "FinAut",
            "parent": null,
            "path": [
                "FinAut"
            ],
            "root": "FinAut",
            "value": null
        },
        "FinAut$AFR": {
            "children": [
                "FinAut$AFR$Webl\u00f8sning",
                "FinAut$AFR$timer-h\u00f8y"
            ],
            "key": "FinAut$AFR",
            "label": "AFR",
            "parent": "FinAut",
            "path": [
                "FinAut",
                "FinAut$AFR"
            ],
            "root": "FinAut",
            "value": null
        },
        "FinAut$AFR$Webl\u00f8sning": {
            "children": [
                "FinAut$AFR$Webl\u00f8sning$AFR-Utvikling"
            ],
            "key": "FinAut$AFR$Webl\u00f8sning",
            "label": "Webl\u00f8sning",
            "parent": "FinAut$AFR",
            "path": [
                "FinAut",
                "FinAut$AFR",
                "FinAut$AFR$Webl\u00f8sning"
            ],
            "root": "FinAut",
            "value": null
        },
        "FinAut$AFR$Webl\u00f8sning$AFR-Utvikling": {
            "children": [],
            "key": "FinAut$AFR$Webl\u00f8sning$AFR-Utvikling",
            "label": "AFR-Utvikling",
            "parent": "FinAut$AFR$Webl\u00f8sning",
            "path": [
                "FinAut",
                "FinAut$AFR",
                "FinAut$AFR$Webl\u00f8sning",
                "FinAut$AFR$Webl\u00f8sning$AFR-Utvikling"
            ],
            "root": "FinAut",
            "value": 151
        },
        "FinAut$AFR$timer-h\u00f8y": {
            "children": [
                "FinAut$AFR$timer-h\u00f8y$AFR-support"
            ],
            "key": "FinAut$AFR$timer-h\u00f8y",
            "label": "timer-h\u00f8y",
            "parent": "FinAut$AFR",
            "path": [
                "FinAut",
                "FinAut$AFR",
                "FinAut$AFR$timer-h\u00f8y"
            ],
            "root": "FinAut",
            "value": null
        },
        "FinAut$AFR$timer-h\u00f8y$AFR-support": {
            "children": [],
            "key": "FinAut$AFR$timer-h\u00f8y$AFR-support",
            "label": "AFR-support",
            "parent": "FinAut$AFR$timer-h\u00f8y",
            "path": [
                "FinAut",
                "FinAut$AFR",
                "FinAut$AFR$timer-h\u00f8y",
                "FinAut$AFR$timer-h\u00f8y$AFR-support"
            ],
            "root": "FinAut",
            "value": 90
        },
        "FinAut$Finaut": {
            "children": [
                "FinAut$Finaut$IFU-prosjekt"
            ],
            "key": "FinAut$Finaut",
            "label": "Finaut",
            "parent": "FinAut",
            "path": [
                "FinAut",
                "FinAut$Finaut"
            ],
            "root": "FinAut",
            "value": null
        },
        "FinAut$Finaut$IFU-prosjekt": {
            "children": [
                "FinAut$Finaut$IFU-prosjekt$dkcal"
            ],
            "key": "FinAut$Finaut$IFU-prosjekt",
            "label": "IFU-prosjekt",
            "parent": "FinAut$Finaut",
            "path": [
                "FinAut",
                "FinAut$Finaut",
                "FinAut$Finaut$IFU-prosjekt"
            ],
            "root": "FinAut",
            "value": 222
        },
        "FinAut$Finaut$IFU-prosjekt$dkcal": {
            "children": [],
            "key": "FinAut$Finaut$IFU-prosjekt$dkcal",
            "label": "dkcal",
            "parent": "FinAut$Finaut$IFU-prosjekt",
            "path": [
                "FinAut",
                "FinAut$Finaut",
                "FinAut$Finaut$IFU-prosjekt",
                "FinAut$Finaut$IFU-prosjekt$dkcal"
            ],
            "root": "FinAut",
            "value": 230
        },
        "NRPA": {
            "children": [
                "NRPA$Statens Str\u00e5lev\u00e6rn"
            ],
            "key": "NRPA",
            "label": "NRPA",
            "parent": null,
            "path": [
                "NRPA"
            ],
            "root": "NRPA",
            "value": null
        },
        "NRPA$Statens Str\u00e5lev\u00e6rn": {
            "children": [],
            "key": "NRPA$Statens Str\u00e5lev\u00e6rn",
            "label": "Statens Str\u00e5lev\u00e6rn",
            "parent": "NRPA",
            "path": [
                "NRPA",
                "NRPA$Statens Str\u00e5lev\u00e6rn"
            ],
            "root": "NRPA",
            "value": 211
        },
        "NT": {
            "children": [
                "NT$Fotballdommer",
                "NT$Generelt NT",
                "NT$it-drift"
            ],
            "key": "NT",
            "label": "NT",
            "parent": null,
            "path": [
                "NT"
            ],
            "root": "NT",
            "value": null
        },
        "NT$Fotballdommer": {
            "children": [],
            "key": "NT$Fotballdommer",
            "label": "Fotballdommer",
            "parent": "NT",
            "path": [
                "NT",
                "NT$Fotballdommer"
            ],
            "root": "NT",
            "value": 95
        },
        "NT$Generelt NT": {
            "children": [
                "NT$Generelt NT$SOA"
            ],
            "key": "NT$Generelt NT",
            "label": "Generelt NT",
            "parent": "NT",
            "path": [
                "NT",
                "NT$Generelt NT"
            ],
            "root": "NT",
            "value": 4
        },
        "NT$Generelt NT$SOA": {
            "children": [],
            "key": "NT$Generelt NT$SOA",
            "label": "SOA",
            "parent": "NT$Generelt NT",
            "path": [
                "NT",
                "NT$Generelt NT",
                "NT$Generelt NT$SOA"
            ],
            "root": "NT",
            "value": 243
        },
        "NT$it-drift": {
            "children": [
                "NT$it-drift$QM oppgradering",
                "NT$it-drift$Dj.1.8 oppgradering"
            ],
            "key": "NT$it-drift",
            "label": "it-drift",
            "parent": "NT",
            "path": [
                "NT",
                "NT$it-drift"
            ],
            "root": "NT",
            "value": 8
        },
        "NT$it-drift$Dj.1.8 oppgradering": {
            "children": [],
            "key": "NT$it-drift$Dj.1.8 oppgradering",
            "label": "Dj.1.8 oppgradering",
            "parent": "NT$it-drift",
            "path": [
                "NT",
                "NT$it-drift",
                "NT$it-drift$Dj.1.8 oppgradering"
            ],
            "root": "NT",
            "value": 241
        },
        "NT$it-drift$QM oppgradering": {
            "children": [],
            "key": "NT$it-drift$QM oppgradering",
            "label": "QM oppgradering",
            "parent": "NT$it-drift",
            "path": [
                "NT",
                "NT$it-drift",
                "NT$it-drift$QM oppgradering"
            ],
            "root": "NT",
            "value": 234
        },
        "SjDir": {
            "children": [
                "SjDir$B\u00e5t"
            ],
            "key": "SjDir",
            "label": "SjDir",
            "parent": null,
            "path": [
                "SjDir"
            ],
            "root": "SjDir",
            "value": null
        },
        "SjDir$B\u00e5t": {
            "children": [],
            "key": "SjDir$B\u00e5t",
            "label": "B\u00e5t",
            "parent": "SjDir",
            "path": [
                "SjDir",
                "SjDir$B\u00e5t"
            ],
            "root": "SjDir",
            "value": 2
        }
    },
    "roots": [
        "FinAut",
        "SjDir",
        "NT",
        "DK",
        "NRPA"
    ]
};


test('root-in-cache', () => {
    data.roots.forEach(r => {
        expect(data.cache[r]).toBeDefined();
    });
    const ds = new JSonDataSource(data);
    expect(ds.height).toBe(42);
});
