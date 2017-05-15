const P = fn => {
    const _f = fn => typeof fn === 'function';
    const _fp = (prop, x) => typeof x === 'object' && _f(x[prop]);
    const _t = (fn, px) => _fp('then', px) ? px.then(fn) : fn(px);
    const _c = (fn, px) => _fp('catch', px) ? px.catch(fn) : fn(px);
    const _tc = (res, rej, px) => _fp('then', px) ? px.then(res, rej) : res(px);

    const ress = [];
    const rejs = [];
    let s = 'pen';
    let v = undefined;

    fn((...args) => {
        ress.map(([res, t]) => [res, t(...args)]).forEach(args => _t(...args));
        v = args;
        s = 'res';
    },(...args) => {
        rejs.map(([rej, c]) => [rej, c(...args)]).forEach(args => _c(...args));
        v = args;
        s = 'rej';
    });

    return {
        then: (t, c) => P((res, rej) => {
            if (s === 'res') return _f(t) ? _tc(res, rej, t(...v)) : res(...v);
            else if (s === 'rej') return _f(c) ? _tc(res, rej, c(...v)) : rej(...v);

            _f(t) && ress.push([res, t]);
            _f(c) && rejs.push([rej, c]);
        }),
        catch: (c) => P((res, rej) => {
            if (s === 'rej') return _f(c) ? _tc(res, rej, c(...v)) : rej(...v);

            _f(c) && rejs.push([rej, c]);
        })
    };
};

module.exports = P;
