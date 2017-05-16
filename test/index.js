const test = require('tape');
const sinon = require('sinon');
const P = require('../index.js');

const res = x => P((res, rej) => res(x));
const rej = x => P((res, rej) => rej(x));
const all = pxs => pxs.reduce((p, px) => p.then(xs => px.then(x => xs.concat(x))), res([]));

test('P', t => {
    const error = new Error('error');

    const id = x => x;
    const never = sinon.spy();
    const pt = sinon.spy();
    const qt = sinon.spy();
    const rt = sinon.spy();
    const sc = sinon.spy();
    const uc = sinon.spy();
    const vt = sinon.spy();
    const wt = sinon.spy();
    const xc = sinon.spy();
    const yc = sinon.spy();
    const zt = sinon.spy();

    const p = res(3);
    const q = p.then(x => x + 3); // 6
    const r = q.then(x => res(x * 2)); // 12
    const s = r.then(x => rej(x - 3)); // 9
    const u = s.then(never);
    const v = s.catch(x => x); // 9
    const w = v.then(x => x * 2); // 18
    const x = w.then(x => {
        throw error;
    });
    const y = x.then(never);
    const z = x.catch(x => 'fixed');

    const p1 = [];

    p1.push(p.catch(never));
    p1.push(q.catch(never));
    p1.push(r.catch(never));
    p1.push(s.catch(sc));
    p1.push(u.catch(uc));
    p1.push(v.catch(never));
    p1.push(w.catch(never));
    p1.push(x.catch(xc));
    p1.push(y.catch(yc));
    p1.push(z.catch(never));

    p1.push(p.then(pt));
    p1.push(q.then(qt));
    p1.push(r.then(rt));
    p1.push(s.then(never).catch(id));
    p1.push(u.then(never).catch(id));
    p1.push(v.then(vt));
    p1.push(w.then(wt));
    p1.push(x.then(never).catch(id));
    p1.push(y.then(never).catch(id));
    p1.push(z.then(zt));

    const t1 = all(p1).then(() => {
        t.true(never.notCalled);
        t.true(pt.called);
        t.true(pt.calledWith(3));
        t.true(qt.called);
        t.true(qt.calledWith(6));
        t.true(rt.called);
        t.true(rt.calledWith(12));
        t.true(sc.called);
        t.true(sc.calledWith(9));
        t.true(uc.called);
        t.true(uc.calledWith(9));
        t.true(vt.called);
        t.true(vt.calledWith(9));
        t.true(wt.called);
        t.true(wt.calledWith(18));
        t.true(xc.called);
        t.true(xc.calledWith(error));
        t.true(yc.called);
        t.true(yc.calledWith(error));
        t.true(zt.called);
        t.true(zt.calledWith('fixed'));

        return 't1';
    });

    const at = sinon.spy();
    const bt = sinon.spy();
    const cc = sinon.spy();
    const dc = sinon.spy();

    const a = P((res, rej) => (res(1), res(2)));
    const b = P((res, rej) => (res(1), rej(2)));
    const c = P((res, rej) => (rej(1), res(2)));
    const d = P((res, rej) => (rej(1), rej(2)));

    const p2 = [];

    p2.push(a.then(at));
    p2.push(b.then(bt));
    p2.push(c.then(never).catch(id));
    p2.push(d.then(never).catch(id));

    p2.push(a.catch(never));
    p2.push(b.catch(never));
    p2.push(c.catch(cc));
    p2.push(d.catch(dc));

    const t2 = all(p2).then(() => {
        t.true(never.notCalled);
        t.true(at.called);
        t.true(at.calledWith(1));
        t.true(bt.called);
        t.true(bt.calledWith(1));
        t.true(cc.called);
        t.true(cc.calledWith(1));
        t.true(dc.called);
        t.true(dc.calledWith(1));

        return 't2';
    });

    const et = sinon.spy();
    const fc = sinon.spy();

    const e = res(1);
    const f = rej(2);

    const p3 = [];

    p3.push(e.then(et));
    p3.push(f.catch(fc));

    t.true(et.notCalled);
    t.true(fc.notCalled);

    const t3 = all(p3).then(() => {
        t.true(et.called);
        t.true(et.calledWith(1));
        t.true(fc.called);
        t.true(fc.calledWith(2));

        return 't3';
    });

    all([t1, t2, t3]).then((ts) => {
        t.end();
    });
});
