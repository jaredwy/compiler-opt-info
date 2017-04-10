import test from 'ava';


test(async (t) => {
    t.is(await fn(), 'foo');
});