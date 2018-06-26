module.exports = class {
    constructor(me, counts, values, max_rounds, log) {
        this.me = me;
        this.counts = counts;
        this.values = values;
        this.max_rounds = max_rounds;
        this.log = log;
    }

    offer(o) {
        return this.counts;
    }
}
