

export function sort_by(collection, fn) {
    const tmp = [];
    collection.forEach(v => tmp.push([fn(v), v]));
    tmp.sort();
    return tmp.map(([key, val]) => val);
}
