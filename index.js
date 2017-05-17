const P = fn => {
    const _f = fn => typeof fn === 'function';
    const _pf = (prop, x) => typeof x === 'object' && _f(x[prop]);
    const _tc = (res, rej, fn) => (...args) => {
        try { (px => _pf('then', px) ? px.then(res, rej) : res(px))(fn(...args)); }
        catch(err) { rej(err); }
    };
    const _to = fn => (...args) => process.nextTick(() => fn(...args));

    const ress = [], rejs = [];
    let s = 'pen', v;

    fn((...args) => {
        if (s !== 'pen') return;
        ress.map(([res, rej, t]) => _f(t) ? _tc(res, rej, t)(...args) : res(...args));
        v = args;
        s = 'res';
    },(...args) => {
        if (s !== 'pen') return;
        rejs.map(([res, rej, c]) => _f(c) ? _tc(res, rej, c)(...args) : rej(...args));
        v = args;
        s = 'rej';
    });

    const then = (t, c) => P((res, rej) => {
        if (s === 'res') return _f(t) ? _to(_tc(res, rej, t))(...v) : res(...v);
        else if (s === 'rej') return _f(c) ? _to(_tc(res, rej, c))(...v) : rej(...v);

        ress.push([res, rej, t]);
        rejs.push([res, rej, c]);
    });

    return {
        then,
        catch: (c) => then(null, c)
    };
};

const all = (promises) => {
    return P((res, rej) => {
        const [first, ...rest] = promises.map(p => p.catch(rej));
        const wait_next = ([curr, ...rest], values, last_val) => {
            const latest_values = values.concat(last_val);

            if(curr) return curr.then(val => wait_next(rest, [], val));
            else return latest_values;
        };

        return first.then(val => wait_next(rest, [], val)).then(res);
    });
};

P.all = all;

module.exports = P;
