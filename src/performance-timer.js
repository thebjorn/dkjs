
const stats = {init: performance.now()};


const _performance = tag => {
    const now = performance.now();
    let prev = now;
    if (_performance.events.length >= 1) {
        // prev = _performance.events[0][1];
        prev = _performance.events[_performance.events.length - 1][1];
    }
    _performance.events.push([tag, now, now-prev]);
};
_performance.events = [];
_performance.toString = () => {
    _performance.events.forEach(([tag, now, duration]) => console.log("PERF-EVT:", Math.round(duration, 6), tag));
};
_performance('loaded-stats-timer');

export default _performance;
