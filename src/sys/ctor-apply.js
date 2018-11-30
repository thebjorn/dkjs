

/**
 *   `apply` for ctor functions, e.g.  dk.ctor_apply(Date, [1970, 5, 2]);
 */
export default function ctor_apply(ctor, args) {
    args = [null].concat([...args]);
    let Factory = ctor.bind.apply(ctor, args);
    return new Factory();
}
