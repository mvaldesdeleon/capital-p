const test = require('tape');
const sinon = require('sinon');
const P = require('../index.js');

const res = x => P((res, rej) => res(x));
const rej = x => P((res, rej) => rej(x));

test('P', t => {
    const error = new Error('error');

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
    const v = u.catch(x => x); // 9
    const w = v.then(x => x * 2); // 18
    const x = w.then(x => {
        throw error;
    });
    const y = x.then(never);
    const z = y.catch(x => 'fixed');

    p.catch(never);
    q.catch(never);
    r.catch(never);
    s.catch(sc);
    u.catch(uc);
    v.catch(never);
    w.catch(never);
    x.catch(xc);
    y.catch(yc);
    z.catch(never);

    p.then(pt);
    q.then(qt);
    r.then(rt);
    s.then(never);
    u.then(never);
    v.then(vt);
    w.then(wt);
    x.then(never);
    y.then(never);
    z.then(zt);

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

    t.end();
});
