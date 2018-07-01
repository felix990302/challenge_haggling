// eslint-disable-next-line no-undef
module.exports = class {
    constructor(me, counts, values, max_rounds, log) {
        this.me = me;
        this.counts = counts;
        this.values = values;
        this.max_rounds = max_rounds;
        this.log = log;

        this.goFirst = me == 0;
        this.roundsLeft = max_rounds;
        this.totalValue = 0;
        this.individualValues = [];
        this.allNonZeroItems = [];
        this.previousOffer = undefined;

        log([this.goFirst, max_rounds,]);
        log(counts);
        log(values);
        for(var k=0; k<counts.length; ++k) {
            let temp = counts[k]*values[k];
            this.totalValue += temp;
            this.individualValues[k] = temp;
            this.allNonZeroItems[k] = temp>0 ? counts[k] : 0;
        }
        log(this.totalValue);
    }

    offer(o) {
        --this.roundsLeft;
        let offer = o;
        this.log(o ? this.gain(o) : "first turn");
        if(this.goFirst) {
            if(offer) { // not very first turn
                if(this.roundsLeft == 0) { // last offer to be made
                    offer =  this.acceptIfGain(offer);
                } else if(this.isAcceptable(offer, 0.3+0.025*this.roundsLeft)) {
                    offer =  undefined;
                } else {
                    offer = this.makeCompromise(
                        offer,
                        this.previousOffer,
                        (amount, prev) =>
                            Math.min(Math.ceil((amount+prev)/2), prev),
                    );
                }
            } else { // very first turn, initial offer
                offer = this.makeInitialOffer(
                    (count) => Math.ceil(count/2),
                );
            }
        } else { // go second
            if(this.roundsLeft == 0) { // last offer to make
                offer = this.acceptIfGain(offer);
            } else if (this.isAcceptable(offer, 0.3+0.025*this.roundsLeft)) { // round in-between 
                offer = undefined;
            } else { // round in-between
                offer = this.makeCompromise(
                    offer,
                    this.previousOffer ? this.previousOffer : this.allNonZeroItems,
                    (amount, prev) =>
                        Math.min(Math.ceil((amount+prev)/2), prev),
                );
            }
        }
        this.previousOffer = offer;
        return offer;
    }

    makeCompromise(offerArr, prevArr, compromiseFunc) {
        return offerArr.map(
            (amount, ind) => compromiseFunc(amount, prevArr[ind]),
        );
    }

    makeInitialOffer(desiredFunc) {
        return this.allNonZeroItems.map(
            (count, ind) => desiredFunc(count, ind),
        );
    } 

    gain(offer) {
        return offer.reduce(
            (acc, count, ind) => acc + count*this.values[ind],
            0,
        );
    }

    isAcceptable(offer, ROI) {
        var desiredRate = ROI > 0.5 ? 0.5 : ROI;
        return this.gain(offer) >= desiredRate * this.totalValue;
    }

    acceptIfGain(offer) {
        if(this.gain(offer) > 0) {
            return undefined;
        } else {
            return this.counts;
        }
    }
};
