const P = fn => {
    const _f = fn => typeof fn === 'function';
    const _pf = (prop, x) => typeof x === 'object' && _f(x[prop]);
    const _tc = (res, rej, fn) => (...args) => {
        try { (px => _pf('then', px) ? px.then(res, rej) : res(px))(fn(...args)); }
        catch(err) { rej(err); }
    };

    const ress = [], rejs = [];
    let s = 'pen', v;

    fn((...args) => {
        if (s !== 'pen') return;
        ress.map(([res, rej, t]) => _tc(res, rej, t)(...args));
        v = args;
        s = 'res';
    },(...args) => {
        if (s !== 'pen') return;
        rejs.map(([res, rej, c]) => _tc(res, rej, c)(...args));
        v = args;
        s = 'rej';
    });

    const then = (t, c) => P((res, rej) => {
        if (s === 'res') return _f(t) ? _tc(res, rej, t)(...v) : res(...v);
        else if (s === 'rej') return _f(c) ? _tc(res, rej, c)(...v) : rej(...v);

        _f(t) && ress.push([res, rej, t]);
        _f(c) && rejs.push([res, rej, c]);
    });

    return {
        then,
        catch: (c) => then(null, c)
    };
};

module.exports = P;
