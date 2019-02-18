

const _default32 = {
    up: 'url(//static.datakortet.no/dk/sort-za-32.cur), pointer',
    down: 'url(//static.datakortet.no/dk/sort-az-32.cur), pointer'
};

const _default24 = {
    up: 'url(//static.datakortet.no/dk/sort-za.cur), pointer',
    down: 'url(//static.datakortet.no/dk/sort-az.cur), pointer'
};

export function cursor(name) {
    return _default24[name] || name;
}
